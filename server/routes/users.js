const express = require('express');
const router = express.Router();
const db = require('../db')
const svgCaptcha = require('svg-captcha')
const sms_util= require('./../util/sms_util')
const md5 =require('blueimp-md5')
const { nanoid } = require('nanoid')
var users = {};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource 1212');
});
/* 发送图形验证码 */
router.get('/captcha', (req, res) => {
  let captcha = svgCaptcha.create({
    color: true,
    noise: 1,
    ignoreChars: '0o1liO',
    background: '#F7B3B3',
    size: 4
  });
  req.session.captcha = captcha.text.toLowerCase();
  console.log('++',req.session.captcha);
  res.type('svg');
  res.send(captcha.data)
});
/* 发送短信验证码 */
router.get('/send_code', (req, res) => {
  let phone=req.query.phone;
  let isregister=req.query.isregister
  let sqlStr="SELECT phone FROM user WHERE user.phone='" +phone+ "' LIMIT 1;";
  if (isregister==0) {
    db.query(sqlStr, (err, results) => {
      if (err) {
        return res.json({err_code: 0, message: '请求验证码失败！'})
      }else{
        if (!results[0]) {   
          let code=sms_util.randomCode(4);
          sms_util.sendCode(phone, code, function (success) {
            console.log('---',success);
            if(success){
              users[phone] = code;
              res.json({ success_code: 200, message: '发送验证码成功！'})
            }else{
              res.json({err_code: 0, message: '发送验证码失败！'})
            }
          })

        }else{
          res.json({ success_code: 202, message: '手机号码已注册！' })
        }
       
      }
      
    })
  }else{
    db.query(sqlStr, (err, results) => {
      if (err) {
        return res.json({err_code: 0, message: '请求验证码失败！'})
      }else{
        if (results[0]) {   
          let code=sms_util.randomCode(4);
          users[phone] = code;
          res.json({success_code: 200, message: '验证码获取成功!', code});
          // sms_util.sendCode(phone, code, function (success) {
          //   console.log('---',success);
          //   if(success){
          //     users[phone] = code;
          //     res.json({success_code: 200, message: '验证码获取成功!', code});
          //   }else{
          //     res.json({err_code: 0, message: '发送验证码失败！'})
          //   }
          // })
        }else{
          res.json({ success_code: 202, message: '手机号码未注册！' })
        }
       
      }
      
    })
  }
  
  
});
/* 手机验证码登录 */
router.post('/login_code', (req, res)=>{
// 1. 获取数据
const phone = req.body.phone;
const code = req.body.code;
console.log('000',users[phone]);
console.log('111',req.body);
// 2. 判断验证码是否正确
if(users[phone] !== code){
    return res.json({error_code: 0, message: '验证码错误!'})
}

// 3. 查询和操作数据
delete  users[phone];
let sqlStr="SELECT * FROM user WHERE user.phone='" +phone+ "' LIMIT 1;";

db.query(sqlStr, (err, results) => {
  if (err) {
    return res.json({err_code: 0, message: '请求登录失败！'})
  }else{
    results=JSON.parse(JSON.stringify(results))
    if (results[0]) {
       req.session.userId =results[0].id;
       res.json({ success_code: 200, message:'登录成功！' ,data:{id:results[0].id,phone:results[0].phone,nickname:results[0].nickname,picture:results[0].picture,sex:results[0].sex,age:results[0].age} })
    }else{
      res.json({ success_code: 202, message: '手机号码未注册！' })
    }
   
  }
  
})

});
/* 密码登录 */
router.post('/login_pwd', (req, res)=>{
  // 1. 获取数据
  const phone = req.body.phone;
  const password=md5(req.body.password);
  const captcha = req.body.captcha.toLowerCase() ;
  console.log('111',req.body,'222+',password);
  console.log('--',req.session);
  // 2. 判断验证码是否正确
  if(req.session.captcha !== captcha){
      return res.json({error_code: 0, message: '验证码错误!'})
  }
  
  // 3. 查询和操作数据
  delete  req.session.captcha;
  let sqlStr="SELECT * FROM user WHERE user.phone='" +phone+ "' LIMIT 1;";
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求登录失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))
      if (results[0]) {
        if (results[0].password !== password) {
          res.json({ success_code: 202, message:'手机号码或密码不正确！' })
        }else{
          req.session.userId =results[0].id;
          res.json({ success_code: 200, message:'登录成功！' ,data:{id:results[0].id,phone:results[0].phone,nickname:results[0].nickname,picture:results[0].picture,sex:results[0].sex,age:results[0].age} })
        }
         
      }else{
        res.json({ success_code: 202, message: '手机号码未注册！' })
      }
     
    }
    
  })
  
  });
/* 账号注册 */
router.post('/register', (req, res)=>{
  // 1. 获取数据
  const nickname = req.body.nickname;
  const phone = req.body.phone;
  const password=md5(req.body.password);
  const code = req.body.code;
  const id=nanoid()
  console.log('111',req.body);
  // 2. 判断验证码是否正确
  if(users[phone] !== code){
      return res.json({error_code: 0, message: '验证码错误!'})
  }
  // 3. 查询和操作数据
  delete  users[phone];
  let sqlStr="SELECT * FROM user WHERE user.phone='" +phone+ "' LIMIT 1;";
  let addStr="INSERT INTO user set ?";
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求注册失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))
      if (!results[0]) {
         db.query(addStr,{id,nickname,phone,password},(err,result)=>{
          if (err) {
            return res.json({err_code: 0, message: '请求注册失败！'})
          }else{
            if (result) {
              res.json({ success_code: 200, message:'注册成功！'})
            }else{
              res.json({ success_code: 202, message:'注册失败！'})
            }
          }
         })
      }else{
        res.json({ success_code: 202, message: '手机号码已注册！' })
      }
     
    }
    
  })
  });

/* 退出登录 */
router.get('/logout', (req, res)=>{
  // 清除session中的userid
  const deleteId=delete req.session.userId;
  // 返回数据
  if(deleteId){
    res.send({success_code: 200, message: '退出登录成功'});
  }else{
    res.send({error_code: 0, message: '退出登录失败'});
  }
  
})


module.exports = router;
