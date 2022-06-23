import ajax from "./ajax";
const base_url='/api'   //跨域时开启
// const base_url='http://node.nico33.icu'   //打包
export const getSvgCode =()=>ajax(base_url+'/users/captcha')
//请求获取短信验证码
export const getPhoneCode =(phone,isregister)=>ajax(base_url+'/users/send_code',{phone,isregister})
//请求短信验证码登录
export const getPhoneCodeLogin =(phone,code)=>ajax(base_url+'/users/login_code',{phone,code},'POST')
//请求密码登录
export const getPwdCodeLogin =(phone,password,captcha)=>ajax(base_url+'/users/login_pwd',{phone,password,captcha},'POST')
//实现自动登录，请求保存在session里的用户信息
export const getUserInfo = () => ajax(base_url + '/api/user_info');
//账号注册
export const getRegister = (nickname,phone,password,code) => ajax(base_url + '/users/register',{nickname,phone,password,code},'POST');
//退出登录
export const getLogOut = () => ajax(base_url + '/users/logout');
//编辑资料
export const getMy = (parmas) => ajax(base_url + '/api/my',parmas,'POST');
//地址：添加、修改、删除
export const getAddress = (parmas) => ajax(base_url + '/api/address',parmas,'POST');
//请求获取地址
export const getAddressInfo = (parmas) => ajax(base_url + '/api/addressinfo',parmas,'POST');
//请求创建订单
export const getOrder = (parmas) => ajax(base_url + '/api/addorder',parmas,'POST');
//请求我的订单
export const getMyOrder = (parmas) => ajax(base_url + '/api/myorder',parmas,'POST');
//请求我的订单状态数量
export const getMyOrderCount = (parmas) => ajax(base_url + '/api/myordercount',parmas,);
//请求更改订单状态
export const getOrderStatus = (parmas) => ajax(base_url + '/api/orderstatus',parmas,'POST');
//请求删除订单状态
export const getDeleteOrder = (parmas) => ajax(base_url + '/api/deleteorder',parmas,'POST');

//请求首页帖子
export const getHomeForum =()=>ajax(base_url+'/api/gethomeforum')
//请求首页轮播图
export const getHomeSwipe =()=>ajax(base_url+'/api/homeswipe')
//请求销量排行
export const getTopSales =()=>ajax(base_url+'/api/topsales')
//请求 商品列表
export const getHomeHot =(parmas)=>ajax(base_url+'/api/hot',parmas)
//请求 商品详细
export const getDetail =(parmas)=>ajax(base_url+'/api/detail',parmas)
//请求收藏商品列表
export const getCollection =()=>ajax(base_url+'/api/collection')
//请求添加收藏商品
export const getAddCollection =(pid,count)=>ajax(base_url+'/api/addcollection',{pid,count})
//请求取消收藏商品
export const getDeleteCollection =(pid)=>ajax(base_url+'/api/deletecollection',{pid})
//请求DIY全部商品列表
export const getDiy =(parmas)=>ajax(base_url+'/api/diy',parmas)
//请求DIY分类商品列表
export const getDiyType =(typeid)=>ajax(base_url+'/api/diytype',{typeid})
//请求搜索列表
export const getSearch =(parmas)=>ajax(base_url+'/api/search',parmas)
//请求热门搜索关键词
export const getKeyword =()=>ajax(base_url+'/api/getkeyword',)
//请求添加更新搜索关键词
export const addKeyword =(parmas)=>ajax(base_url+'/api/addkeyword',parmas)
//请求添加更新diy
export const addDiy =(parmas)=>ajax(base_url+'/api/adddiy',parmas,'POST')
//请求删除diy
export const deleteDiy =(parmas)=>ajax(base_url+'/api/deletediy',parmas)


//请求七牛上传uploadToken
export const getUploadToken =()=>ajax(base_url+'/api/uploadtoken')
//请求发布
export const getPublish =(parmas)=>ajax(base_url+'/api/publish',parmas,'POST')
//获取全部帖子
export const getPublishList =(parmas)=>ajax(base_url+'/api/getpublishlist',parmas)
//获取我评论的帖子
export const getMyPublishList =(parmas)=>ajax(base_url+'/api/getMypublishlist',parmas)
//获取我发布的帖子或标记的帖子
export const getMyForum =(parmas)=>ajax(base_url+'/api/getmyforum',parmas)
//获取我标记的帖子
export const getMyTag =(parmas)=>ajax(base_url+'/api/getmytag',parmas)
//点赞与取消点赞
export const getCheers =(parmas)=>ajax(base_url+'/api/cheers',parmas)
//标记与取消标记
export const getTag =(parmas)=>ajax(base_url+'/api/tag',parmas)
//评论
export const Comments =(parmas)=>ajax(base_url+'/api/comments',parmas)
//获取评论
export const getComments =(parmas)=>ajax(base_url+'/api/getcomments',parmas)
//获取我的评论
export const getMyComments =(parmas)=>ajax(base_url+'/api/getMycomments',parmas)
//回复
export const Reply =(parmas)=>ajax(base_url+'/api/reply',parmas)
//获取回复
export const getReply =(parmas)=>ajax(base_url+'/api/getreply',parmas)