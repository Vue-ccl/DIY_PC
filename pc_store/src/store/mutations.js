import {
HOME_SWIPE,
HOME_HOT,USER_INFO ,
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
    [HOME_SWIPE](state,{homeswipe}){
        state.homeswipe=homeswipe
    },
    [HOME_HOT](state,{homehot,parmas}){//请求的数据拼接到原有的数据中
        if (parmas.type =='homehot') {
            state.homehot=state.homehot.concat(homehot) 
        }
        if (parmas.type =='cpu') {
            state.cpu=state.cpu.concat(homehot) 
        }
        if (parmas.type =='gpu') {
            state.gpu=state.gpu.concat(homehot) 
        }
        if (parmas.type =='mobo') {
            state.mobo=state.mobo.concat(homehot) 
        }
        if (parmas.type =='ddr') {
            state.ddr=state.ddr.concat(homehot) 
        }
        if (parmas.type =='hdd') {
            state.hdd=state.hdd.concat(homehot) 
        }
        if (parmas.type =='mouse') {
            state.mouse=state.mouse.concat(homehot) 
        }
        if (parmas.type =='radiator') {
            state.radiator=state.radiator.concat(homehot) 
        }
        if (parmas.type =='monitor') {
            state.monitor=state.monitor.concat(homehot) 
        }
        if (parmas.type =='sound') {
            state.sound=state.sound.concat(homehot) 
        }
        if (parmas.type =='keyboard') {
            state.keyboard=state.keyboard.concat(homehot) 
        }
        if (parmas.type =='headset') {
            state.headset=state.headset.concat(homehot) 
        }
        if (parmas.type =='power') {
            state.power=state.power.concat(homehot) 
        }
        if (parmas.type =='pc') {
            state.pc=state.pc.concat(homehot) 
        }
    },
    [USER_INFO](state,{userInfo}){//请求的用户信息
        state.userInfo=userInfo
    },
    [RESET_USER_INFO](state){//退出登录请求的用户信息
        state.userInfo={}
    },
    [DIY_LIST](state,{diylist}){
        state.diylist=diylist
    },
    [SEARCH_LIST](state,{searchlist}){
        state.searchlist=searchlist
    },
    [UPLOAD_TOKEN](state,{uploadtoken}){
        state.uploadtoken=uploadtoken
    },
    [PUBLISH_LIST](state,{publishlist,parmas}){
        if (parmas.page==1 || !parmas.page) {
            state.publishlist=[]
        }
        publishlist.forEach(element => {
            if (element.videourl!='') {
              element.playerOptions = {
              playbackRates: [1.0, 2.0, 3.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "4:3", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  type: "video/mp4",
                  type: "video/ogg",
                  src: element.videourl //url地址
                }
              ],
              poster: "", //封面地址
              notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
              }
              };
              // element.playerOptions='111'
            }else{
              element.playerOptions={}
            }
        });
        state.publishlist=state.publishlist.concat(publishlist)
    },
    [MY_FORUM](state,{myforum,parmas}){
        if (parmas.page==1 || !parmas.page) {
            state.myforum=[]
        }
        myforum.forEach(element => {
            if (element.videourl!='') {
              element.playerOptions = {
              playbackRates: [1.0, 2.0, 3.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "4:3", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  type: "video/mp4",
                  type: "video/ogg",
                  src: element.videourl //url地址
                }
              ],
              poster: "", //封面地址
              notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
              }
              };
              // element.playerOptions='111'
            }else{
              element.playerOptions={}
            }
        });
        state.myforum=state.myforum.concat(myforum)
    },
    [MY_TAG](state,{mytag,parmas}){
        if (parmas.page==1 || !parmas.page) {
            state.mytag=[]
        }
        mytag.forEach(element => {
            element=Object.assign(element,state.userInfo)
            if (element.videourl!='') {
              element.playerOptions = {
              playbackRates: [1.0, 2.0, 3.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "4:3", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  type: "video/mp4",
                  type: "video/ogg",
                  src: element.videourl //url地址
                }
              ],
              poster: "", //封面地址
              notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
              }
              };
              // element.playerOptions='111'
            }else{
              element.playerOptions={}
            }
        });
        console.log(mytag);
        state.mytag=state.mytag.concat(mytag)
    },
    [MY_COMMENTS](state,{mycomments,parmas}){
        if (parmas.page==1 || !parmas.page) {
            state.mycomments=[]
        }
        mycomments.forEach(element => {
            element=Object.assign(element,state.userInfo)
            if (element.tovideourl!='') {
              element.playerOptions = {
              playbackRates: [1.0, 2.0, 3.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "4:3", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  type: "video/mp4",
                  type: "video/ogg",
                  src: element.tovideourl //url地址
                }
              ],
              poster: "", //封面地址
              notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
              }
              };
              // element.playerOptions='111'
            }else{
              element.playerOptions={}
            }
        });
        state.mycomments=state.mycomments.concat(mycomments)
    },
    [HOME_FORUM](state,{homeforum,parmas}){
        homeforum.forEach(element => {
            element=Object.assign(element,state.userInfo)
            if (element.tovideourl!='') {
              element.playerOptions = {
              playbackRates: [1.0, 2.0, 3.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "4:3", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  type: "video/mp4",
                  type: "video/ogg",
                  src: element.tovideourl //url地址
                }
              ],
              poster: "", //封面地址
              notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true //全屏按钮
              }
              };
              // element.playerOptions='111'
            }else{
              element.playerOptions={}
            }
        });
        state.homeforum=homeforum
    },
    //更新点赞
    cheers(state,parmas){
        console.log('++++',parmas);
        if (parmas.status) {
            if (parmas.isforum==1) {
               state.publishlist[parmas.index].ischeers=1
               state.publishlist[parmas.index].zancount +=1
            }
            if (parmas.isforum==2) {
                state.myforum[parmas.index].ischeers=1
                state.myforum[parmas.index].zancount +=1
             }
             if (parmas.isforum==3) {
                state.mytag[parmas.index].ischeers=1
                state.mytag[parmas.index].zancount +=1
             }
             if (parmas.isforum==4) {
                state.homeforum[parmas.index].ischeers=1
                state.homeforum[parmas.index].zancount +=1
             }
        }else{
            if (parmas.isforum==1) {
                state.publishlist[parmas.index].ischeers=0
                state.publishlist[parmas.index].zancount -=1
             }
             if (parmas.isforum==2) {
                 state.myforum[parmas.index].ischeers=0
                 state.myforum[parmas.index].zancount -=1
              }
              if (parmas.isforum==3) {
                state.mytag[parmas.index].ischeers=0
                state.mytag[parmas.index].zancount -=1
             }
             if (parmas.isforum==4) {
                state.homeforum[parmas.index].ischeers=0
                state.homeforum[parmas.index].zancount -=1
             }
        }
    },
    //更新标记
    tag(state,parmas){
        if (parmas.status) {
            if (parmas.isforum==1) {
                state.publishlist[parmas.index].istag=1
                state.publishlist[parmas.index].tagcount +=1   
             }
             if (parmas.isforum==2) {
                state.myforum[parmas.index].istag=1
                state.myforum[parmas.index].tagcount +=1  
            }
            if (parmas.isforum==4) {
                state.homeforum[parmas.index].istag=1
                state.homeforum[parmas.index].tagcount +=1  
            }
        }else{
            if (parmas.isforum==1) {
                state.publishlist[parmas.index].istag=0
                state.publishlist[parmas.index].tagcount -=1   
             }
             if (parmas.isforum==2) {
                state.myforum[parmas.index].istag=0
                state.myforum[parmas.index].tagcount -=1  
             }
             if (parmas.isforum==3) {
                state.mytag.splice(parmas.idnex,1)
             }
             if (parmas.isforum==4) {
                state.homeforum[parmas.index].istag=0
                state.homeforum[parmas.index].tagcount -=1  
             }
        }
    },
    //更新评论
    comments(state,parmas){
        if (parmas.isforum==1) {
            state.publishlist[parmas.index].replycount +=1
         }
         if (parmas.isforum==2) {
            state.myforum[parmas.index].replycount +=1 
         }
         if (parmas.isforum==3) {
            state.mytag[parmas.index].replycount +=1 
         }
         if (parmas.isforum==4) {
            state.homeforum[parmas.index].replycount +=1 
         }
    },
    //清空vuex
    into(state,parmas){
        state.myforum=[]
        state.mytag=[] 
        state.mycomments=[]
        state.order={
            isdiy:false
        }
        state.searchlist=[]
        state.searchvalue=''
    },
    //
    createorder(state,parmas){
        if(parmas.address){        
            state.order.address=parmas.address
        }
        if (parmas.goods) {
            state.order.goods=parmas.goods
        }
    },
}