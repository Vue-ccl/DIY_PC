const express = require('express');
const router = express.Router();
const db = require('../db')

const { nanoid } = require('nanoid')

/* 添加CPU */
router.get('/addcpu', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='AMD 锐龙 R5 2600CPU处理器 16核24线程'
    var model='锐龙R5'
    var brand='AMD'      //品牌
    var number = 99;     //库存
    var typeid=1     //种类id
    var typename='CPU'    //种类名字
    var type='cpu'     //种类
    var price=599     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t19765/46/1305986126/221842/57b7f448/5ac46408N8ed0d0cd.jpg,https://img14.360buyimg.com/n0/jfs/t16843/313/1309639154/153500/89e0d17d/5ac46415Naf71cb4f.jpg,https://img14.360buyimg.com/n0/jfs/t17674/122/1274437583/262851/8f6699d2/5ac46426N043d705b.jpg,https://img14.360buyimg.com/n0/jfs/t18727/111/1282779032/190962/be8dd71b/5ac4641bN7cc27726.jpg'
    var frequency='3.7GHz';     //频率
    var power=65;     //功率
    var interface='AMD AM4';     //接口
    var make='6核12线程';     //线程
    var isgpu=0;
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2=`INSERT INTO cpu VALUES('${id}','${pid}','${frequency}',${power},'${interface}','${make}',${isgpu})`
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加GPU */
  router.get('/addgpu', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='讯景（XFX））AMD RADEON R9 380 4GB 深红进化版 猴年限定 一键超频'
    var model='R9 380'
    var brand='讯景（XFX）'      //品牌
    var number = 99;     //库存
    var typeid=2     //种类id
    var typename='显卡'    //种类名字
    var type='gpu'     //种类
    var price=459     //价格
    var ishot=0    //是否推荐
    var sales=99     //销量
    var picture='http://www.xfx.com.cn/wp-content/uploads/2016/01/21.jpg,http://www.xfx.com.cn/wp-content/uploads/2016/01/31.jpg,http://www.xfx.com.cn/wp-content/uploads/2016/01/41.jpg'
    var frequency='1040MHz';     //频率
    var power=500;     //功率
    var interface='6';     //接口
    var size=4;     //容量
    var length=23.4   //长度 
    var cpu='AMD 芯片'      //核心芯片组  
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO gpu set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,size,power,interface,frequency,length,cpu},(err, result) => {
            if (err) {
              console.log(err);
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加mobo */
  router.get('/addmobo', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='微星(MSI)MAG B550M BAZOOKA火箭炮电脑主板 支持5600X/5800X/3700X/3600X CPU（AMD B550/Socket AM4）'
    var model='H610M BOMBER DDR4'
    var brand='微星（MSI）'      //品牌
    var number = 99;     //库存
    var typeid=3     //种类id
    var typename='主板'    //种类名字
    var type='mobo'     //种类
    var price=649     //价格
    var ishot=0    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/221130/32/13023/670026/623412f3Edd553d95/c445fb0bbf00f696.jpg,https://img14.360buyimg.com/n0/jfs/t1/159716/2/9612/228953/603df2fbE7e12791a/6ec7447852ad6e12.jpg,https://img14.360buyimg.com/n0/jfs/t1/131507/10/2331/346296/5ee73dc5E7c6cd8f3/bfc8111c1d2f7525.jpg,https://img14.360buyimg.com/n0/jfs/t1/131163/33/3849/272831/5f0403b3Ee7346df3/2cf216c31def96e3.jpg,https://img14.360buyimg.com/n0/jfs/t1/125923/35/5018/355789/5ee73dc5E8987bebc/b43b247efae6b6f7.jpg'
    var ddrnum=2;     //ddr插槽数
    var ddrmax=128;     //ddr最大
    var ddrtype=4;     //ddr代数
    var ddrs='DDR4 2133；DDR4 2200';     //ddr标准
    var powerinter='24+8'   //电源接口
    var cpuinter='AMD AM4'      //适用CPU接口：INTEL LGA1700
    var m2=2;     //M.2接口数量：4个
    var sata=6   //sata接口 
    var mobotype='M-ATX（紧凑型）'      //板型：ATX（标准型） 
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO mobo set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,ddrnum,ddrmax,ddrtype,ddrs,powerinter,cpuinter,m2,sata,mobotype},(err, result) => {
            if (err) {
              console.log(err);
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加内存条 */
  router.get('/addddr', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='芝奇（G.SKILL）16GB 3000频率 DDR4 台式机内存条 幻光戟RGB灯条(C16)'
    var model='F4-3000C16S-16GTZR'
    var brand='G.SKILL'      //品牌
    var number = 99;     //库存
    var typeid=4     //种类id
    var typename='内存条'    //种类名字
    var type='ddr'     //种类
    var price= 699     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/201852/38/2271/113719/611f7cd8Edde6018b/ac8809b25f3ba0bf.jpg,https://img14.360buyimg.com/n0/jfs/t1/41665/2/15161/180310/5d849a74E36c91e91/722415387381ecb4.jpg,https://img14.360buyimg.com/n0/jfs/t1/47368/25/11498/185952/5d849a75Ef9881558/ad31760b5d72ac3b.jpg,https://img14.360buyimg.com/n0/jfs/t21133/346/267727242/76887/4016848a/5b07a877Nab5adbae.jpg'
    var frequency='2933/3000MHz'
    var size=16;     //容量
    var ddrtype=4;     //接口
    var like='RGB灯条';     //线程
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO ddr set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,frequency,size,ddrtype,like},(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加硬盘 */
  router.get('/addhdd', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='金士顿(Kingston) 256GB  SATA3 SSD固态硬盘 KC600系列'
    var model='SKC600/1024G'
    var brand='金士顿（Kingston）'      //品牌
    var number = 99;     //库存
    var typeid=5     //种类id
    var typename='硬盘'    //种类名字
    var type='hdd'     //种类
    var price= 329     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/94795/37/20379/94049/61d40339Ec61038de/e2864ede30fe2bcf.jpg,https://img14.360buyimg.com/n0/jfs/t1/215177/1/9913/69019/61d40344E31af0cbe/268cf1e7dcc4c5c7.jpg'
    var read='550MB/s'     //读
    var write='520MB/s'    //写
    var size='256GB ';     //容量
    var interface='M.2';     //接口
    var speed='';     //转速
    var hddtype='SSD固态硬盘'        //硬盘类型
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO hdd set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,read,write,size,speed,interface,hddtype},(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加电源 */
  router.get('/addpower', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='安钛克 Antec NE750金牌 白色 全模组/7年换新/全日系电容/支持风扇启停/双8pin电脑主机机箱电源750W'
    var model='X7000A081-20'
    var brand='安钛克（Antec）'      //品牌
    var number = 99;     //库存
    var typeid=6     //种类id
    var typename='电源'    //种类名字
    var type='power'     //种类
    var price= 659     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/139150/19/22354/94397/6164e326E6de6f360/d4c5d1cb9bf40f74.jpg,https://img14.360buyimg.com/n0/jfs/t1/158823/9/25823/103674/617a448bE5cf99762/e005dc53a432be8f.jpg,https://img14.360buyimg.com/n0/jfs/t1/207623/26/5012/83864/6164e319E5cdcb5a1/2f49078adffb8a11.jpg,https://img14.360buyimg.com/n0/jfs/t1/200503/10/12732/152960/6164e319Ef172b2a6/fa26c5a40dd7ce66.jpg'
    
    var powerinter='20+4'     //主电源接口
    var sata=4          //sata接口
    var eightpin=2;     //8pin
    var sixpin=2;     //6pin
    var power=850;     //额定功率
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO power set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,powerinter,sata,eightpin,sixpin,power},(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加散热器 */
  router.get('/addradiator', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='酷冷至尊(Cooler Master)暴雪T620M 黑武士 CPU风冷散热器(I10 1200、AM4/ARGB灯效/6热管/镀镍底座/5年质保)'
    var model='暴雪T620M'
    var brand='酷冷至尊（CoolerMaster）'      //品牌
    var number = 99;     //库存
    var typeid=7     //种类id
    var typename='散热器'    //种类名字
    var type='radiator'     //种类
    var price=599     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/73475/24/9136/234032/5d6f12afEd745aac5/cab45084dd7fd9b3.jpg,https://img14.360buyimg.com/n0/jfs/t1/67774/22/9159/237765/5d6f12b0E29829368/7a233f4cbdb1ef19.jpg,https://img14.360buyimg.com/n0/jfs/t1/62884/10/9128/271183/5d6f12b0Eef5d5eec/cb2d0fbcf366ba08.jpghttps://img14.360buyimg.com/n0/jfs/t1/83775/19/9214/225989/5d6f12b0Ea91639c1/342e0aa6360dc7f1.jpg'
    var height=165         //高度
    var radtype='风冷'     //散热方式
   
  
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO radiator set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,height,radtype},(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加机箱 */
  router.get('/addpc', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='骨伽 小开拓者S 开放式电竞水冷中塔台式电脑游戏主机箱'
    var model='骨伽小开拓者S'
    var brand='骨伽'      //品牌
    var number = 99;     //库存
    var typeid=8     //种类id
    var typename='机箱'    //种类名字
    var type='pc'     //种类
    var price= 839     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/116510/40/5267/274967/5eb28861E06c89ce2/f6a72ca5b926c35d.jpg,https://img14.360buyimg.com/n0/jfs/t1/107850/26/16477/209317/5eb28861E3b6c0d1d/57375bcdea650736.jpg,https://img14.360buyimg.com/n0/jfs/t1/117494/29/5277/187433/5eb28860Ef8bd5136/9c7d423c327c0fb4.jpg,https://img14.360buyimg.com/n0/jfs/t1/171417/39/8850/120514/603d9846E849f2fae/9fff697f0eaa44df.jpg,https://img14.360buyimg.com/n0/jfs/t1/152034/25/20796/69500/603d9828E08a4be5d/33033d0401693dad.jpg'
    
    var maxheight=131   //限高
    var mobotypes='ATX（标准型），M-ATX（紧凑型），MINI-ITX（迷你型）'   //主板支持 E-ATX（加强型），ATX（标准型），M-ATX（紧凑型），MINI-ITX（迷你型）
    var maxlength=31 //限长
    var hddm=3;     //机械硬盘位
    var hdds=7;     //固态硬盘位
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO pc set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,maxheight,mobotypes,maxlength,hddm,hdds},(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加显示器 */
  router.get('/addmonitor', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='三星 (SAMSUNG )玄龙骑士 48.8英寸带鱼屏 DQHD HDR 量子点 120Hz 可升降 曲面电竞显示器（C49RG90SSC）'
    var model='C49RG90SSC'
    var brand='三星（SAMSUNG）'      //品牌
    var number = 99;     //库存
    var typeid=9     //种类id
    var typename='显示器'    //种类名字
    var type='monitor'     //种类
    var price=8499     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/67499/39/10522/576831/5d7ee7f1Ed4ab153d/78a4876e2685fd81.jpg,https://img14.360buyimg.com/n0/jfs/t1/122649/2/15833/158498/5f8eacdfEe5adf98b/22f6268508cefda1.jpg,https://img14.360buyimg.com/n0/jfs/t1/58388/22/10663/457390/5d7ee7f1Ee5f17309/2804b96bf679aaa1.jpg,https://img14.360buyimg.com/n0/jfs/t1/120588/33/15541/138365/5f8eacb7E675dc5ca/9b7df337fd7429f7.jpg,https://img14.360buyimg.com/n0/jfs/t1/135145/1/13031/241095/5f8eacccE07130828/89e7131029747e9b.jpg'
   
  
    var monitorsize='48.8-49英寸'         //尺寸
    var bili='32:9'           //比例
    var fenbianlv='5120*1440'     //分辨率
    var interface='DP，HDMI，USB扩展/充电，音频/耳机输出'     //接口
    var hz='120HZ'     //刷新率
  
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO monitor set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,monitorsize,bili,fenbianlv,interface,hz},(err, result) => {
            if (err) {
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加键盘 */
  router.get('/addkeyboard', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='飞利浦(PHILIPS)机械键盘鼠标套装 有线键盘 游戏办公键盘台式机笔记本电脑键盘104键打字键盘 深蓝白红三色经典版（茶轴）'
    var model='SPK8404'
    var brand='飞利浦（philips）'      //品牌
    var number = 99;     //库存
    var typeid=10     //种类id
    var typename='键盘'    //种类名字
    var type='keyboard'     //种类
    var price=159     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/148330/2/26825/305445/62384724E7b3f6d1c/460cad9853d41cfd.jpg,https://img14.360buyimg.com/n0/jfs/t1/90816/5/25465/263687/6247f3ceE31a81b29/bd7c64930d88ed1d.jpg,https://img14.360buyimg.com/n0/jfs/t1/126649/32/25310/167071/62384ed3Eeac5e077/55033a700928e9df.jpg,https://img14.360buyimg.com/n0/jfs/t1/223144/35/9259/189063/61e522f3E5942c3c1/b3ec1527a37d241a.jpg,https://img14.360buyimg.com/n0/jfs/t1/223144/35/9259/189063/61e522f3E5942c3c1/b3ec1527a37d241a.jpg,https://img14.360buyimg.com/n0/jfs/t1/165056/19/7996/184756/603e1509E1b199732/5c00ab86c28aea23.jpg'
   
  
    var keys='＞98键'         //键盘数    ≤87键       ＞98键
    var keytype='机械键盘'           //键盘类型
    var interface='USB'     //接口
    var intertype='有线连接'     //连接方式
    var buttom='茶轴'                //轴体
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO keyboard set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,keys,keytype,intertype,interface,buttom},(err, result) => {
            if (err) {
              console.log(err);
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加鼠标 */
  router.get('/addmouse', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name=' 多彩(DELUX)M618Plus有线鼠标 人体工学鼠标 有线办公鼠标笔记本电脑鼠标'
    var model='M618Plus幻彩版'
    var brand='多彩（Delux）'      //品牌
    var number = 99;     //库存
    var typeid=11     //种类id
    var typename='鼠标'    //种类名字
    var type='mouse'     //种类
    var price=159     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量h
    var picture='https://img14.360buyimg.com/n0/jfs/t1/221211/16/10246/191888/62037d80E5f4805f9/ecf58a15bcede3e3.jpg,https://img14.360buyimg.com/n0/jfs/t1/180090/38/20892/43362/6125a901Ee908bf74/f8d5a5bd6de923b4.jpg,https://img14.360buyimg.com/n0/jfs/t1/180090/38/20892/43362/6125a901Ee908bf74/f8d5a5bd6de923b4.jpg,https://img14.360buyimg.com/n0/jfs/t5827/150/890617326/90831/8e8bd139/59227cc4Na1f13851.jpg'
   
  
    var dpi='1600'         //
    var interface='USB'     //接口
    var intertype='有线连接'     //连接方式
  
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO mouse set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,dpi,intertype,interface},(err, result) => {
            if (err) {
              console.log(err);
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加音响 */
  router.get('/addsound', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='漫步者（EDIFIER）R12U 外观时尚、音质纯正的入门级微型2.0桌面音响 笔记本音箱 电脑音箱 白色'
    var model='R12U'
    var brand='漫步者（EDIFIER） '      //品牌
    var number = 99;     //库存
    var typeid=12     //种类id
    var typename='音响'    //种类名字
    var type='sound'     //种类
    var price=159.9     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/128682/11/23114/49513/62159ebfEf0043451/458afa2fb1d639e3.jpg,https://img14.360buyimg.com/n0/jfs/t1/138095/25/4658/73503/5f2a6738Ec5e29f29/b536767608c79a49.jpg,https://img14.360buyimg.com/n0/jfs/t1/134242/5/5989/88153/5f2a673eE01241e06/f80bd79f69146d71.jpg,https://img14.360buyimg.com/n0/jfs/t1/149174/11/4054/73176/5f20e4c3E13373d17/535f8977bc48555d.jpg,https://img14.360buyimg.com/n0/jfs/t1/114082/39/13106/46868/5f20e4c1E0deb8c5b/6a80e0e8d8f3597a.jpg,https://img14.360buyimg.com/n0/jfs/t1/114540/19/13507/28701/5f20e4c3E6a961dcc/374020c4a0ebe478.jpg'
   
    var interface='USB+3.5毫米音频接口'     //接口
    var intertype='有线连接'     //连接方式
    var soundcount=2        //扬声器数量
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO sound set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,soundcount,intertype,interface},(err, result) => {
            if (err) {
              console.log(err);
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  /* 添加耳机 */
  router.get('/addheadset', (req, res)=>{
    // 1. 获取数据
    var pid=nanoid() //商品pid
    var id=nanoid() //id
    var name='西伯利亚（XIBERIA）V13游戏耳机头戴式 电脑手机耳机带麦 电竞耳机耳麦有线 黑色'
    var model='V13（单3.5mm）'
    var brand='  西伯利亚（XIBERIA） '      //品牌
    var number = 99;     //库存
    var typeid=13     //种类id
    var typename='耳机'    //种类名字
    var type='headset'     //种类
    var price=99.9     //价格
    var ishot=1    //是否推荐
    var sales=99     //销量
    var picture='https://img14.360buyimg.com/n0/jfs/t1/108156/29/1377/102165/5dfccd68Ea44f7c05/988b4df555accaaa.jpg,https://img14.360buyimg.com/n0/jfs/t1/98358/40/7539/47272/5dfccd71Efae26e67/312c3bf8e51edf48.jpg,https://img14.360buyimg.com/n0/jfs/t1/110141/7/1422/78374/5dfccd71E80ad1bd1/ac30939366d59b88.jpg,https://img14.360buyimg.com/n0/jfs/t1/102824/2/7591/95098/5dfccd72E7301c3dc/61afdbbfa3d8ed3a.jpg,https://img14.360buyimg.com/n0/jfs/t1/92832/40/7631/64908/5dfccd73Ebadaa66c/5fdc9bf6bad84f38.jpg'
   
    var interface='USB'     //接口
    var intertype='3.5毫米音频接口'     //连接方式
    var wear='头戴式'        //扬声器数量
    picture=picture.replace(/\/n0\//g,'/n12/')
    const sqlStr1=`INSERT INTO goods VALUES('${pid}','${name}','${model}','${brand}',${number},${typeid},'${typename}','${type}',${price},'${picture}',${ishot},${sales})`
    const sqlStr2='INSERT INTO headset set ?'
    db.query(sqlStr1,(err, results) => {
      if (err) {
        console.log(err);
        return res.json({err_code: 0, message: '请求goods失败！'})
      }else{
        if (results) {
          db.query(sqlStr2,{id,pid,wear,intertype,interface},(err, result) => {
            if (err) {
              console.log(err);
              return res.json({err_code: 0, message: '请求属性失败！'})
            }else{
              if (result) {
                res.json({ success_code: 200, message:'2个都成功！'})
              }else{
                res.json({ success_code: 202, message:'第2失败！'})
              }
            }
            
          })
        }
      }
      
    })
    
   
  });
  module.exports = router;