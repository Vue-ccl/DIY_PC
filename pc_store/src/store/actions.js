import {
    getHomeSwipe,
    getHomeHot,
    getUserInfo,
    getLogOut,
    getDiy,
    getSearch,
    getUploadToken,
    getPublishList,
    getMyForum,
    getMyTag,
    getMyComments,
    getHomeForum
} from '../api';
import {
    HOME_HOT,
    HOME_SWIPE,
    USER_INFO,
    RESET_USER_INFO,
    DIY_LIST,
    SEARCH_LIST,
    UPLOAD_TOKEN,
    PUBLISH_LIST,
    MY_FORUM,
    MY_TAG,
    MY_COMMENTS,
    HOME_FORUM
    }from './mutation-types'
export default{
    //获取全部帖子
    async reqPublishList({commit},parmas){
        // console.log('actions');
        const result=await getPublishList(parmas);
        if (result.success_code==200) {
            commit(PUBLISH_LIST,{publishlist:result.message,parmas})
        }
        parmas.callback && parmas.callback(result)
    },
    //获取首页帖子
    async reqHomeForum({commit},parmas){
        // console.log('actions');
        const result=await getHomeForum(parmas);
        if (result.success_code==200) {
            commit(HOME_FORUM,{homeforum:result.message,parmas})
        }
        parmas.callback && parmas.callback(result)
    },
    //获取我的全部帖子
    async reqMyForum({commit},parmas){
        const result=await getMyForum(parmas);
        if (result.success_code==200) {
            commit(MY_FORUM,{myforum:result.message,parmas})
        }
        parmas.callback && parmas.callback(result)
    },
    //获取我标记的帖子
    async reqMyTag({commit},parmas){
        const result=await getMyTag(parmas);
        if (result.success_code==200) {
            commit(MY_TAG,{mytag:result.message,parmas})
        }
        parmas.callback && parmas.callback(result)
    },
    //获取我的评论
    async reqMyComments({commit},parmas){
        const result=await getMyComments(parmas);
        console.log(result);
        if (result.success_code==200) {
            commit(MY_COMMENTS,{mycomments:result.message,parmas})
        }
        parmas.callback && parmas.callback(result)
    },
    //获取首页轮播图
    async reqHomeSwipe({commit}){
        const result=await getHomeSwipe();
        commit(HOME_SWIPE,{homeswipe:result.message})
    },
    //获取首页热门推荐或个分类推荐
    async reqHomeHot({commit},parmas){
        // console.log(parmas);
        const result=await getHomeHot(parmas);
        commit(HOME_HOT,{homehot:result.message,parmas})
        parmas.callback && parmas.callback()
    },
     //获取DIY全部列表
    async reqDiy({commit},parmas){
        const result=await getDiy();
        // console.log(result.message);
        commit(DIY_LIST,{diylist:result.message})
        parmas.callback && parmas.callback(result)
    },
    //获取搜索结果
    async reqSearch({commit},parmas){
        const result=await getSearch(parmas);
        commit(SEARCH_LIST,{searchlist:result.message})
        parmas.callback && parmas.callback();
    },
    //同步用户的信息
    syncUserInfo({commit}, userInfo) {
    commit(USER_INFO, {userInfo});
    },
    //请求获取用户信息,自动登录
    async reqUserInfo({commit},parmas){
        const result=await getUserInfo();
        console.log(result);
        if(result.success_code === 200){
            commit(USER_INFO,{userInfo:result.data})
        }
        parmas.callback && parmas.callback(result)
    },
    // 退出登录
    async logOut({commit},parmas) {
        const result = await getLogOut();
        if (200 === result.success_code) {
        commit(RESET_USER_INFO);
        }
        parmas.callback && parmas.callback(result)
    },
    //获取七牛上传凭证
    async reqUploadToken({commit}){
        const result=await getUploadToken();
        commit(UPLOAD_TOKEN,{uploadtoken:result.uploadToken})
    },
}