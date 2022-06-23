const express = require('express');
const router = express.Router();
const db = require('../db')
const transaction = require('../db/transaction')
const { nanoid } = require('nanoid')
var qiniu = require("qiniu");
var moment = require('moment');

/* 修改用户信息 */
router.post('/my', (req, res) => {
  let id=req.session.userId;
  let picture=req.body.picture;
  let nickname=req.body.nickname;
  let sex=req.body.sex;
  let age=parseInt(req.body.age);
  //查询和操作数据
  let sqlStr="UPDATE user set ? WHERE ?";
  db.query(sqlStr,[{picture,nickname,sex,age},{id}],(err, results) => {
    if (err) {
      console.log('---',err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))
      if (results) {
         res.json({ success_code: 200, message:'成功！' })
      }else{
        res.json({ success_code: 202, message: '更新失败！' })
      }
     
    }
    
  })

});
/* 请求用户信息 */
router.get('/user_info', (req, res) => {
  let userId=req.session.userId;
  //查询和操作数据
  let sqlStr="SELECT * FROM user WHERE user.id='" +userId+ "' LIMIT 1;";
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求登录失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))
      if (results[0]) {
         req.session.userId =results[0].id;
         res.json({ success_code: 200, message:'登录成功！' ,data:{id:results[0].id,phone:results[0].phone,nickname:results[0].nickname,picture:results[0].picture,sex:results[0].sex,age:results[0].age} })
      }else{
        delete req.session.userId
        res.json({ success_code: 202, message: '请先登录！' })
      }
     
    }
    
  })

});
/* 地址：添加、修改、删除 */
router.post('/address', (req, res) => {
  let userid=req.session.userId;
  let state=req.body.state;
  let addressinfo=req.body.address;
  let name=addressinfo.name;
  let phone=addressinfo.tel;
  let lastaddress=addressinfo.addressDetail;
  let areacode=addressinfo.areaCode;
  let province=addressinfo.province;
  let city=addressinfo.city;
  let county=addressinfo.county;
  let isdefault=addressinfo.isDefault?1:0;
  let id=parseInt(addressinfo.id)

  let sqlStr1="UPDATE addressinfo set isdefault=0";
  let sqlStr2="INSERT INTO addressinfo set ?";
  let sqlStr3=`UPDATE addressinfo set ? WHERE id=${id}`;
  let sqlStr4="DELETE FROM addressinfo WHERE id=?";
  if (state==3) {
  //查询和操作数据
    db.query(sqlStr4,[id],(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求失败！'})
      }else{
        console.log(results);
        if (results) {
          res.json({ success_code: 200, message:'删除地址成功！' })
        }else{
          res.json({ success_code: 202, message: '删除地址失败！' })
        }
      }
    })
  }else{
      if (isdefault==1) {
      db.query(sqlStr1,(err, results) => {
        if (err) {
          return res.json({err_code: 0, message: '请求失败！'})
        }else{
          console.log('去除默认成功');
        }
      })
      }
      if (state==1) {
        db.query(sqlStr2,[{userid,name,phone,lastaddress,areacode,province,city,county,isdefault}],(err, results) => {
          if (err) {
            console.log(err);
            return res.json({err_code: 0, message: '请求失败！'})
          }else{
            console.log(results);
            if (results) {
              res.json({ success_code: 200, message:'添加地址成功！' })
            }else{
              res.json({ success_code: 202, message: '添加地址失败！' })
            }
          }
        })
      }
      if (state==2) {
        db.query(sqlStr3,[{name,phone,lastaddress,areacode,province,city,county,isdefault}],(err, results) => {
          if (err) {
            console.log(err);
            return res.json({err_code: 0, message: '请求失败！'})
          }else{
            console.log(results);
            if (results) {
              res.json({ success_code: 200, message:'更新地址成功！' })
            }else{
              res.json({ success_code: 202, message: '更新地址失败！' })
            }
          }
        })
      }
  }

});
/*获取我的地址  */
router.post('/addressinfo', (req, res) => {
  let userid=req.session.userId;
  let sqlStr="SELECT * FROM addressinfo WHERE userid=? order by isdefault desc";
  db.query(sqlStr,[userid],(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        res.json({ success_code: 200, message:results })
      }else{
        res.json({ success_code: 202, message: '请求地址失败！' })
      }
    
    }
    
  })
});

/* 获取七牛云的上传凭证 */
router.get('/uploadtoken', (req, res) => {
    let accessKey = 'oXmPF3SxeJ54EAGMoH-1LuiTqC7D3txfl4NRSD5l'
    let secretKey = '0ff939H6sfECNrkZWUCyTxJve8qdtsp4OAfgBPXF'
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let bucket = 'pc-store'
    //要上传的空间
    var options = {
      scope: bucket,
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    
    // 构建上传凭证
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    if(uploadToken){
        res.json({uploadToken})
    }
})
/* 获取我的评论 */
router.get('/getmycomments', (req, res)=>{
  // 1. 获取数据
  let page = req.query.page || 1;
  let count = req.query.count || 10;
  const userid=req.session.userId
  let sqlStr1=`SELECT cid,comments.fid,comments.content,comments.time,publish.content AS tocontent,publish.videourl AS tovideourl,publish.imgurl AS toimgurl,
  (select nickname from user as c where c.id = publish.userid)as tonickname,
    (select picture from user as c where c.id = publish.userid)as topicture
   FROM comments LEFT JOIN publish ON comments.fid=publish.fid WHERE comments.userid='${userid}' order by time desc limit ${(page-1)*count},${count}`
  db.query(sqlStr1, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        results.forEach(element => {
          if (element.toimgurl) {
            element.toimgurl=element.toimgurl.split(',')
          }
        }); 
        res.json({ success_code: 200, message:results})
      }else{
        res.json({ success_code: 202, message:'获取失败！'})
      }
    }
  })
  });
/* 获取评论 */
router.get('/getcomments', (req, res)=>{
  // 1. 获取数据
  const fid=parseInt(req.query.fid);
  let sqlStr1=`SELECT cid,fid,userid,nickname,picture,content,time,
  (select count(*) from reply as c where c.cid = comments.cid )as replycount FROM comments LEFT JOIN user ON comments.userid=user.id WHERE fid=${fid} order by time desc`
  db.query(sqlStr1, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        res.json({ success_code: 200, message:results})
      }else{
        res.json({ success_code: 202, message:'获取失败！'})
      }
    }
  })
  });
/* 评论 */
router.get('/comments', (req, res)=>{
  // 1. 获取数据
  const content =req.query.content;
  const fid=parseInt(req.query.fid);
  const cid=nanoid()
  const userid=req.session.userId
  const time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  let sqlStr1=`INSERT INTO comments(cid,fid,userid,content,time) values('${cid}',${fid},'${userid}','${content}','${time}')`
  db.query(sqlStr1, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        let data={cid,fid,userid,content,time}
        res.json({ success_code: 200, message:data})
      }else{
        res.json({ success_code: 202, message:'评论失败！'})
      }
    }
  })
  });
/* 获取回复 */
router.get('/getreply', (req, res)=>{
  // 1. 获取数据
  const cid=req.query.cid;
  let sqlStr1=`SELECT rid,cid,userid,touserid,replytype,content,time,
  (select nickname from user as c where c.id = reply.userid)as nickname,
  (select picture from user as c where c.id = reply.userid)as picture,
  (select nickname from user as c where c.id = reply.touserid)as tonickname,
  (select content from reply as c where c.rid=reply.torid)as tocontent
   FROM reply WHERE cid='${cid}' order by time desc`
  // console.log(sqlStr1);
  db.query(sqlStr1, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        res.json({ success_code: 200, message:results})
      }else{
        res.json({ success_code: 202, message:'获取失败！'})
      }
    }
  })
  });
/* 回复 */
router.get('/reply', (req, res)=>{
  const replytype=parseInt(req.query.replytype)//回复类型
  const content =req.query.content;//回复内容
  const torid =req.query.torid;//被回复的回复id
  const fid=req.query.fid;//回复所在的帖子id
  const cid=req.query.cid;//回复所在的评论id
  const rid=nanoid()//生成此次回复的id
  const touserid=req.query.touserid;//被回复的用户id
  const userid=req.session.userId//进行回复的用户id
  const time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')//回复时间
  let sqlStr1='INSERT INTO reply set ?'
  db.query(sqlStr1,{rid,cid,fid,userid,touserid,replytype,content,time,torid},(err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        res.json({ success_code: 200, message:'回复成功'})
      }else{
        res.json({ success_code: 202, message:'回复失败！'})
      }
    }
  })
  });
/* 点赞与取消点赞 */
router.get('/cheers', (req, res)=>{
  // 1. 获取数据
  const status =parseInt(req.query.status);
  const fid=parseInt(req.query.fid);
  const userid=req.session.userId
  let sqlStr=`SELECT * FROM cheers WHERE fid=${fid} AND userid='${userid}'`
  let sqlStr1=`INSERT INTO cheers(fid,userid,status) values(${fid},'${userid}',${status})`
  let sqlStr2=`UPDATE cheers set status=${status} WHERE fid=${fid} AND userid='${userid}'`
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (!results[0]) {
        db.query(sqlStr1, (err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '添加点赞记录失败！'})
          }else{
            res.json({ success_code: 200, message:'添加点赞记录成功！'})
          }
        })
      }else{
        db.query(sqlStr2, (err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '更新点赞记录失败！'})
          }else{
            res.json({ success_code: 200, message:'更新点赞记录成功！'})
          }
        })
      }
    }
  })

  });
/* 标记与取消标记 */
router.get('/tag', (req, res)=>{
  // 1. 获取数据
  const status =parseInt(req.query.status);
  const fid=parseInt(req.query.fid);
  const userid=req.session.userId
  let sqlStr=`SELECT * FROM tag WHERE fid=${fid} AND userid='${userid}'`
  let sqlStr1=`INSERT INTO tag(fid,userid,status) values(${fid},'${userid}',${status})`
  let sqlStr2=`UPDATE tag set status=${status} WHERE fid=${fid} AND userid='${userid}'`
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (!results[0]) {
        db.query(sqlStr1, (err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求失败1！'})
          }else{
            res.json({ success_code: 200, message:'添加标记记录成功！'})
          }
        })
      }else{
        db.query(sqlStr2, (err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求失败2！'})
          }else{
            res.json({ success_code: 200, message:'更新标记记录成功！'})
          }
        })
      }
    }
  })
  });
/* 发布帖子 */
router.post('/publish', (req, res)=>{
  // 1. 获取数据
  const message = req.body.message;
  const imgurl = req.body.imgurl ||'';
  const videourl = req.body.videourl ||'' ;
  const time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  const userid=req.session.userId
  let sqlStr=`INSERT INTO publish(userid,content,videourl,imgurl,time) values('${userid}','${message}','${videourl}','${imgurl}','${time}')`
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求失败！'})
    }else{
      if (results) {
        res.json({ success_code: 200, message:'发布成功！'})
      }else{
        res.json({ success_code: 202, message: '发布失败！' })
      }
    }
  })
  });
/* 获取论坛列表 */
router.get('/getpublishlist', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 10;
  let userid=req.session.userId
  let sqlStr=`select fid,userid,nickname,picture,content,videourl,imgurl,time,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.status )as zancount,
  (select count(*) from tag as c where c.fid = publish.fid AND c.status )as tagcount,
  (select count(*) from comments as c where c.fid = publish.fid )as replycount,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as ischeers,
  (select count(*) from tag as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as istag
  from publish LEFT JOIN user ON publish.userid=user.id order by publish.time desc limit ${(page-1)*count},${count}`
  // console.log(sqlStr);
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        if (element.imgurl) {
          element.imgurl=element.imgurl.split(',')
        }
      }); 
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 获取我的评论论坛列表 */
router.get('/getmypublishlist', (req, res) => {
  let fid = req.query.fid;
  let userid=req.session.userId
  // console.log(count);
  // let sqlStr = "SELECT fid,userid,content,videourl,imgurl,replycount,zancount,time,nickname,picture FROM publish INNER JOIN user on publish.userid=user.id order by publish.time desc limit " + (page - 1) * count + ',' + count;
  let sqlStr=`SELECT userid,
	(select count(*) from cheers as c where c.fid = publish.fid AND c.status )as zancount,
  (select count(*) from tag as c where c.fid = publish.fid AND c.status )as tagcount,
  (select count(*) from comments as c where c.fid = publish.fid )as replycount,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as ischeers,
  (select count(*) from tag as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as istag
  FROM publish WHERE publish.fid=${fid} limit 1`
  // console.log(sqlStr);
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 获取我的发布*/
router.get('/getmyforum', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 10;
  let userid=req.session.userId
  let sqlStr=`select fid,userid,nickname,picture,content,videourl,imgurl,time,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.status )as zancount,
  (select count(*) from tag as c where c.fid = publish.fid AND c.status )as tagcount,
  (select count(*) from comments as c where c.fid = publish.fid )as replycount,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as ischeers,
  (select count(*) from tag as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as istag
  from publish LEFT JOIN user ON publish.userid=user.id WHERE publish.userid='${userid}' order by publish.time desc limit ${(page-1)*count},${count}`
  // console.log(sqlStr);
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        if (element.imgurl) {
          element.imgurl=element.imgurl.split(',')
        }
      }); 
      // console.log(results);
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 获取我的标记 */
router.get('/getmytag', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 10;
  let userid=req.session.userId
  let sqlStr=`select publish.fid,content,videourl,imgurl,time,status,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.status )as zancount,
  (select count(*) from tag as c where c.fid = publish.fid AND c.status )as tagcount,
  (select count(*) from comments as c where c.fid = publish.fid )as replycount,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as ischeers,
  (select count(*) from tag as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as istag
  from publish LEFT JOIN tag ON publish.fid=tag.fid WHERE tag.userid='${userid}' AND status=1 order by publish.time desc limit ${(page-1)*count},${count}`
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        if (element.imgurl) {
          element.imgurl=element.imgurl.split(',')
        }
      }); 
      // console.log(results);
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 获取首页帖子 */
router.get('/gethomeforum', (req, res) => {
  let userid=req.session.userId
  let sqlStr=`select publish.fid,content,videourl,imgurl,time,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.status )as zancount,
  (select count(*) from tag as c where c.fid = publish.fid AND c.status )as tagcount,
  (select count(*) from comments as c where c.fid = publish.fid )as replycount,
  (select count(*) from cheers as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as ischeers,
  (select count(*) from tag as c where c.fid = publish.fid AND c.userid='${userid}' AND c.status )as istag
  from publish WHERE publish.fid=59`
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        if (element.imgurl) {
          element.imgurl=element.imgurl.split(',')
        }
      }); 
      // console.log(results);
      res.json({ success_code: 200, message: results })
    }
  })
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
/* 获取首页轮播图 */
router.get('/homeswipe', (req, res) => {
  let sqlStr = 'SELECT * FROM goods INNER JOIN homeswipe ON goods.pid=homeswipe.pid ';
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({ err_code: 0, message: '请求数据失败！'
      })
    }else{
      results.forEach(element => {
        element.picture=element.picture.split(',')
      }); 
      res.json({ success_code: 200, message: results })
    }
 
  })

});
/* 获取销量排行 */
router.get('/topsales', (req, res) => {
  let sqlStr = 'SELECT * FROM goods order by goods.sales desc limit 10';
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({
        err_code: 0,
        message: '请求数据失败！'
      })
    }else{
      results.forEach(element => {
        element.picture=element.picture.split(',')
      }); 
      res.json({ success_code: 200, message: results })
    }
   
  })

});
/* 获取商品列表 */
router.get('/hot', (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 1;
  let type =req.query.type
  // console.log(count);
  let sqlStr=''
  if (type =='homehot') {
     sqlStr = "SELECT * FROM goods  limit " + (page - 1) * count + ',' + count;
  }else{
     sqlStr = "SELECT * FROM goods where type='" + type + "' limit " + (page - 1) * count + ',' + count;
  }
  console.log(sqlStr);
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        element.picture=element.picture.split(',')
      }); 
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 获取商品详细 */
router.get('/detail', (req, res) => {
  let pid = req.query.pid ;
  let type = req.query.type ;
  let userid =req.session.userId;
  let sqlStr =`SELECT * FROM goods LEFT JOIN ${type} ON goods.pid=${type}.pid WHERE goods.pid='${pid}' LIMIT 1`;
  console.log(sqlStr);
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))
      if (results[0]) {
        results[0].iscollection=0
        results.forEach(element => {
          element.picture=element.picture.split(',')
        });
        let sql=`SELECT * FROM collection WHERE collection.pid='${pid}' AND userid = '${userid}' LIMIT 1`;
        console.log(sql);
        db.query(sql,(err,result)=>{
         if (err) {
           return res.json({err_code: 0, message: '请求查询收藏失败！'})
         }else{
          if (result[0]) {
            results[0].iscollection=1
            res.json({ success_code: 200, message:results})
          }else{
            res.json({ success_code: 200, message:results})
          }
         }
        })
     }else{
       res.json({ success_code: 202, message: '请求查询商品失败！' })
     }
    }

  })
});
/* 获取收藏商品 */
router.get('/collection', (req, res) => {
  const userid=req.session.userId
  let sqlStr = `SELECT * FROM collection INNER JOIN goods ON collection.pid=goods.pid where userid ='${userid}'` ;
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      // console.log(JSON.parse(JSON.stringify(results)));
      results.forEach(element => {
        element.picture=element.picture.split(',')
      });
      res.json({ success_code: 200, message: results })
    }
    
  })
});
/* 测试*/
router.get('/test', (req, res) => {
  /* JSON格式 */
  // let sql="select * from `order`"
  // db.query(sql,(err, results) => {
  //   if (err) {
  //     console.log(err);
  //     return res.json({err_code: 0, message: '请求数据失败！'})
  //   }else{
  //      console.log(results[0].goods);
  //       let a = JSON.parse(results[0].goods )
  //       console.log('--',a);
  //     // res.json({err_code: 0, message:a});
  //   }
    
  // })
  /* 多语句执行 */
  // let sqlStr1 = `SELECT * FROM user;` ;
  // let sqlStr2 = `SELECT * FROM cpu;` ;
  // let sqlStr3 = `SELECT * FROM gpu;` ;
  // let sqlStr=sqlStr1+sqlStr2+sqlStr3
  // db.query(sqlStr,(err, results) => {
  //   if (err) {
  //     console.log(err);
  //     return res.json({err_code: 0, message: '请求数据失败！'})
  //   }else{
  //     res.json({err_code: 0, message:results});
  //     console.log('111',results[0]);       // Column1 as a result
  // 	  console.log('2222',results[1]);       // Column2 as a result
  // 	  console.log('3333',results[2]);       // Column3 as a result
  //   }
  // })
});
/* 取消收藏商品 */
router.get('/deletecollection', (req, res) => {
  let pid=req.query.pid
  let userid=req.session.userId
  let sqlStr = "DELETE FROM collection WHERE pid in ('"+pid+"') AND userid='"+userid+"'";
  db.query(sqlStr,(err, results) => {
    if (err) {
      console.log('111',err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      console.log('222',results,sqlStr);
      if (results) {
        res.json({ success_code: 200, message:'取消成功！'})
      }else{
        res.json({ success_code: 202, message:'取消失败！'})
      }
    }
    
  })
}); 
/* 添加收藏商品 */
router.get('/addcollection', (req, res) => {
  let pid= req.query.pid
  let count= parseInt(req.query.count)
  let userid=req.session.userId
  let sqlStr ='INSERT INTO collection set ?' ;
  let sqlStr1=`select * FROM collection WHERE pid='${pid}' AND userid='${userid}'`
  let sqlStr2=`UPDATE collection set count =${count} WHERE pid='${pid}' AND userid='${userid}'`;
  db.query(sqlStr1,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      if (results[0]) {
        // console.log('111',results[0],sqlStr2);
        db.query(sqlStr2,(err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求数据失败！'})
          }else{
            if (result) {
              res.json({ success_code: 200, message:'收藏成功！'})
            }else{
              res.json({ success_code: 202, message:'收藏失败！'})
            }
          }
          
        })
      }else{
        // console.log('222',results[0],sqlStr1);
        db.query(sqlStr,{userid,pid,count},(err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求数据失败！'})
          }else{
            if (result) {
              res.json({ success_code: 200, message:'收藏成功！'})
            }else{
              res.json({ success_code: 202, message:'收藏失败！'})
            }
          }
          
        })
      }
    }
    
  })
});  
/* 获取DIY全部商品列表 */
router.get('/diy', (req, res) => {
  const userid=req.session.userId
  let sqlStr = `SELECT * FROM diy INNER JOIN goods ON diy.pid=goods.pid where userid ='${userid}' order by goods.typeid asc`;
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        element.picture=element.picture.split(',')
      }); 
      res.json({ success_code: 200, message: results })
    }
  })

});
/* 获取DIY分类商品列表 */
router.get('/diytype', (req, res) => {
  let typeid =req.query.typeid
  const userid=req.session.userId
  let sqlStr = `SELECT * FROM diy INNER JOIN goods ON diy.pid=goods.pid where userid ='${userid}' AND goods.typeid=${typeid}` ;
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results.forEach(element => {
        element.picture=element.picture.split(',')
      }); 
      res.json({ success_code: 200, message: results })
    }
  })
  
});
/* 搜索 */
router.get('/search', (req, res) => {
  let value =req.query.value
  let typeid =parseInt(req.query.typeid)
  let sqlStr = ''
  if (typeid ==0) {//搜索全部商品
    sqlStr = `SELECT * FROM goods WHERE LOCATE('${value}',CONCAT(name,model,brand,type,typename))`;
  }else{//分类搜索
    sqlStr = `SELECT * FROM goods WHERE LOCATE('${value}',CONCAT(name,model,brand,type,typename)) AND typeid=${typeid}`;
  }
  console.log(sqlStr);
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      console.log(results);
      results.forEach(element => {
        element.picture=element.picture.split(',')
      }); 
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 添加搜索关键词 */
router.get('/addkeyword', (req, res) => {
  let value =req.query.value
  let sqlStr=`SELECT * FROM search WHERE keyword='${value}'`;
  let sqlStr2=`INSERT INTO search(keyword) VALUES('${value}')`;
  let sqlStr3=`UPDATE search set number =number+1 where keyword='${value}'`;
  console.log(sqlStr);
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      if (results[0]) {
        db.query(sqlStr3,(err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求数据失败！'})
          }else{
            res.json({ success_code: 200, message: '更新搜索关键词成功！' })
          }
        })
      }else{
        db.query(sqlStr2,(err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求数据失败！'})
          }else{
            res.json({ success_code: 200, message: '添加搜索关键词成功！' })
          }
        })
      }
    }
  })
  
});
/* 获取搜索关键词 */
router.get('/getkeyword', (req, res) => {
  let sqlStr=`SELECT * FROM search order by number desc`;
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      res.json({ success_code: 200, message: results })
    }
  })
});
/* 添加diy */
router.post('/adddiy', (req, res) => {
  let property=JSON.stringify(req.body.property)
  let pid=req.body.pid
  let count= parseInt(req.body.count)
  let userid=req.session.userId
  let sqlStr=`select * FROM diy WHERE pid='${pid}' AND userid='${userid}'`
  let sqlStr1 ='INSERT INTO diy set ?' ;
  let sqlStr2='';
  if (property) {
    sqlStr2=`UPDATE diy set count =count+${count} WHERE pid='${pid}' AND userid='${userid}'`;//叠加数量
  }else{
    sqlStr2=`UPDATE diy set count =${count} WHERE pid='${pid}' AND userid='${userid}'`;//覆盖数量
  }
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      if (results[0]) {
        db.query(sqlStr2,(err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求数据失败！'})
          }else{
            res.json({ success_code: 200, message: '更新DIY成功！' })
          }
        })
      }else{
        db.query(sqlStr1,{userid,pid,count,property},(err, result) => {
          if (err) {
            return res.json({err_code: 0, message: '请求数据失败！'})
          }else{
            res.json({ success_code: 200, message: '添加DIY成功！' })
          }
        })
      }
    }
    
  })
});
/* 删除diy */
router.get('/deletediy', (req, res) => {
  let pid=req.query.pid
  const userid=req.session.userId
  let sqlStr=''
  if (pid != 0) {
    sqlStr = `DELETE FROM diy WHERE pid='${pid}' AND userid='${userid}'` ;
  }else{
    sqlStr = `DELETE FROM diy WHERE userid='${userid}'` ;
  }
  console.log(sqlStr);
  db.query(sqlStr,(err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      if (results) {
        res.json({ success_code: 200, message:'删除成功！'})
      }else{
        res.json({ success_code: 202, message:'删除失败！'})
      }
    }
    
  })
}); 
/* 提交订单，扣减库存 */
router.post('/addorder', (req, res)=>{
  // 1. 获取数据
  const oid=nanoid()
  const oj=req.body.oj
  const time=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  const userid=req.session.userId
  const sqls = [];
  const goods=JSON.stringify(oj.goods)
  oj.goods.forEach(element=>{
    let sqlStr=`UPDATE goods set goods.number=goods.number-${element.count},goods.sales=goods.sales+${element.count} WHERE goods.pid='${element.pid}' AND goods.number>=${element.count}`
    sqls.push(sqlStr)
  });
  const sqlorder=`INSERT INTO \`order\` VALUES('${oid}','${userid}','${oj.address.name}','${oj.address.phone}','${oj.address.address}',${oj.allprice},${oj.price},${oj.lijian},${oj.isdiy},1,'${time}','${goods}',1)`
  sqls.push(sqlorder)
  console.log(sqls);
  // return
  transaction
  .transaction(sqls)
  .then((arrResult) => {
    console.log(arrResult);
    res.json({ success_code: 200, message:oid})
  })
  .catch((err) => {
    console.log(err);
    res.json({ err_code: 0, message:err})
  });

});

/* 获取订单列表 */
router.post('/myorder', (req, res) => {
  const status =req.body.status
  const userid=req.session.userId
  let sqlStr =''
  if (status) {
    sqlStr = `SELECT * FROM \`order\` where userid ='${userid}' AND order.status=${status} AND order.isdelete=1 order by order.time desc` ;
  }else{
    sqlStr = `SELECT * FROM \`order\` where userid ='${userid}' AND order.isdelete=1 order by order.time desc` ;
  }
  console.log(sqlStr);
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))//深拷贝！！！！！！，防止变量改变引用地址，避免引用变量报错
      results.forEach(element => {
        element.goods=JSON.parse(element.goods)
      });
      res.json({ success_code: 200, message: results })
    }
  })
  
});
/* 获取订单状态数量 */
router.get('/myordercount', (req, res) => {
  const userid=req.session.userId;
  // const userid='KLrp5vo5KQUE4DT_SYODY';
  const sqlStr1 =`SELECT count(*) AS c FROM \`order\` where userid ='${userid}' AND order.status=1;`;
  const sqlStr2 =`SELECT count(*) AS c FROM \`order\` where userid ='${userid}' AND order.status=2;`;
  const sqlStr3 =`SELECT count(*) AS c FROM \`order\` where userid ='${userid}' AND order.status=3;`;
  let sqlStr=sqlStr1+sqlStr2+sqlStr3
  db.query(sqlStr, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      results=JSON.parse(JSON.stringify(results))
      res.json({ success_code: 200, message: {daifukuan:results[0][0].c,daifahuo:results[1][0].c,daishouhuo:results[2][0].c} })
    }
  })
  
});
/* 更改订单状态 */
router.post('/orderstatus', (req, res) => {
  const oj=req.body.item
  const status=req.body.status;
  const sqlStr =`UPDATE \`order\` set status=${status} where oid ='${oj.oid}';`;
  if (status !=4) {
     db.query(sqlStr, (err, results) => {
      if (err) {
        return res.json({err_code: 0, message: '请求数据失败！'})
      }else{
        res.json({ success_code: 200, message: '更改订单状态成功！'})
      }
    })
  }else{//取消订单
    console.log(oj);
    const sqls = [];
    oj.goods.forEach(element=>{
      let sqlStr=`UPDATE goods set goods.number=goods.number+${element.count},goods.sales=goods.sales-${element.count} WHERE goods.pid='${element.pid}' AND goods.sales>=${element.count}`
      sqls.push(sqlStr)
    });
    sqls.push(sqlStr)
    console.log(sqls);
    // return
    transaction
    .transaction(sqls)
    .then((arrResult) => {
      // do anything ....
      // console.log('111',arrResult);
      res.json({ success_code: 200, message:oj.oid})
    })
    .catch((err) => {
      // error
      res.json({ err_code: 0, message:err})
    });
  }
});
/* 删除订单 */
router.post('/deleteorder', (req, res) => {
  const oid=req.body.oid
  const sqlStr =`UPDATE \`order\` set isdelete=0 where oid ='${oid}';`;
  db.query(sqlStr, (err, results) => {
    if (err) {
      return res.json({err_code: 0, message: '请求数据失败！'})
    }else{
      res.json({ success_code: 200, message: '更改订单为删除成功！'})
    }
  })
});

module.exports = router;
