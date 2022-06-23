export default{
    userInfo:{},//用户信息
    //tabbar导航栏路径，动态更新首页路径
    tabbarData:[
          {
              title:"首页",
              icon:{
                   active:require("@/assets/Tabbar/index_act.png"),
                   inactive:require("@/assets/Tabbar/index_inact.png"),
              },
              url:{
                  name:'Home',
                  params:{fullpath:'/home/hot'}
              } , 
                  
          },
          {
              title:"论坛",
              icon:{
                  active:require("@/assets/Tabbar/search_act.png"),
                  inactive:require("@/assets/Tabbar/search_inact.png"),
              },
              url:{
                  name:"Forum"
              }            
          },      
          {
              title:"DIY",
              icon:{
                  active:require("@/assets/Tabbar/diy_act.png"),
                  inactive:require("@/assets/Tabbar/diy_inact.png"),
              },
              url:{
                  name:"Diy"
              }            
          },
          {
              title:"收藏",
              icon:{
                  active:require("@/assets/Tabbar/cart_act.png"),
                  inactive:require("@/assets/Tabbar/cart_inact.png"),
              },
              url:{
                  name:"Collection"
              }            
          },
          {
              title:"我的",
              icon:{
                  active:require("@/assets/Tabbar/my_act.png"),
                  inactive:require("@/assets/Tabbar/my_inact.png"),
              },
              url:{
                  name:"Me"
              }            
          },
          
          
      ],
    homeswipe:[],//首页轮播图
    homehot:[],//首页热门推荐
    cpu:[],//首页CPU
    gpu:[],//首页显卡
    mobo:[],//首页主板
    sound:[],//首页音响
    radiator:[],//首页散热器
    monitor:[],//首页显示器
    keyboard:[],//首页键盘
    headset:[],//首页耳机
    pc:[],//首页机箱
    power:[],//首页电源
    hdd:[],//首页硬盘
    ddr:[],//首页内存条
    mouse:[],//首页鼠标,
    diylist:[],//DIY列表
    searchlist:[],//搜索结果
    searchvalue:'',//搜索关键词
    uploadtoken:'',//七牛上传凭证
    homeforum:[],//首页帖子
    publishlist:[],//全部帖子列表
    myforum:[],
    mytag:[],
    mycomments:[],
    order:{
        isdiy:false
    }
}