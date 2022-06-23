<template>
    <div class="publish">
        <van-nav-bar fixed :placeholder='true' title="发布到DIY论坛" right-text="发布" @click-right="onClickRight" left-text="" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div>
            <van-field v-model="message" rows="6" type="textarea" placeholder="请输入" maxlength="500" show-word-limit />
        </div>
        <div>
            <!-- 图片上传 -->
            <van-uploader v-if="isimage" v-model="fileList" multiple :max-count="9" preview-size='105px' :after-read="afterRead" :max-size="4* 1024*1024" @oversize="onOversize">
                <van-button icon="plus" color="linear-gradient(to top, #00c6fb, #005bea)">上传图片</van-button>
            </van-uploader>
            <!-- 视频上传 -->
            <div v-else>
                <van-uploader v-model="fileList" :max-count="1"  accept="video/*" :after-read="afterRead"  @click-preview="handleclicksc" :max-size="4* 1024*1024" @oversize="onOversize">
                    <van-button icon="plus" color="linear-gradient(to top, #00c6fb, #005bea)">上传视频</van-button>
                    <template #preview-cover="{}">
                        <video style="max-height:350px;max-width:350px;object-fit:cover;" :src="videourl"  v-if="videourl"></video>
                    </template>
                </van-uploader>
                
                <van-dialog
                    style="width:100%;border-radius:0;height:200px"
                    theme="default"
                    v-model="showvideoplay"
                    :show-cancel-button="false"
                    :show-confirm-button="false"
                    closeOnClickOverlay
                    @close='closeplay'
                >
                    <video
                    id="media"
                    controls
                    preload="auto"
                    style="width:100%;height:200px;object-fit: contain;"
                    :src="videourl"
                    v-if="videourl"
                    ></video>
                </van-dialog>
            </div>
            <div style="font-size:12px;color:#777">上传单个媒体文件大小不能超过4M！</div>
        </div>
    </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import {mapActions,mapState,mapMutations} from 'vuex'
import {getPublish} from '@/api'
    export default {
        name:'Publish',
        data() {
            return {
                message:'',
                fileList: [],
                carinfo: {
                videofile: "",
                ngEcoOpenNo: ""
                },
                videourl: "",
                showvideoplay: false,
                baseurl:'https://nico33.icu/',
                url:[],
                messages:''
            };
        },
        props:{
            isimage:Boolean
        },
        computed:{
            ...mapState(['uploadtoken'])
        },
        mounted(){
            this.reqUploadToken()
        },
        watch:{
            message(){
                this.messages=this.message.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
                let word = ['奸商','日内瓦','退钱']
                    word.forEach((element,index,arr) => {                    
                    if(this.message.indexOf(element) != -1){
                        this.$toast(`不能包含敏感词${'"'}${element}${'"'}`)
                        return
                    }
                });
                
            }
        },
        methods:{
            ...mapActions(['reqUploadToken']),
            //关闭
            onClickLeft(){
                if (this.message  || this.fileList.length) {
                    this.$dialog.confirm({
                    title: '内容未保存是否退出？',
                    }).then(() => {
                    this.message=''
                    this.fileList=[]
                    this.$emit('is-publish')
                    }).catch(() => {
                        return
                    });
                }else{
                    this.$emit('is-publish')
                }
            },
            //关闭后触发
            back(){
                this.message=''
                this.fileList=[]
            },
            //确认发布
            onClickRight(){
                if (this.message==''  && this.fileList.length==0) {
                    this.$toast('发布内容不能未空！')
                    return
                }
                let params={}
                this.fileList.map((element,index,arr) => {                    
                    if (element.status=='done') {
                        this.url.push(element.url)
                    }
                });
                if (this.isimage) {
                    params={message:this.messages,imgurl:this.url.toString()}
                }else{
                    params={message:this.messages,videourl:this.url.toString()}
                }
                this.$dialog.confirm({
                    title: '确认发布？',
                    }).then(() => {
                        this.loading()
                        this.getpublish(params)
                    }).catch(() => {
                        this.url=[]
                        return
                    });
            },
            //发布
            async getpublish(params){
                let result= await getPublish(params)
                if(result.success_code==200){  
                    this.$toast.success(result.message);
                    this.url=[]
                    this.message=''
                    this.fileList=[]
                    this.$emit('is-publish')
                }else{
                    this.url=[]
                    this.$toast({ message: result.message,icon: 'cross',});
                }
            },
            loading(){
            this.$toast.loading({
                duration:0,
                message: '发布中...',
                forbidClick: true,
                loadingType: 'circular',
            });
            },
            //本地上传
            afterRead(file) {
                if (file.length) {
                    file.forEach((element,index,arr) => {                    
                        this.uploadqiniu(element)
                    });
                }else{
                    if (!this.isimage) {
                        this.videourl = file.content;
                    }
                    this.uploadqiniu(file)
                }
            },
            //七牛上传
            uploadqiniu(file){
                let _this = this  
                let key = new Date().getTime() + Math.random(1000)+file.file.name; // 设置图片的名字，生产随机uid，避免重复调用名字重复
                file.status = 'uploading';
                file.message = '上传中0%';
                file.url=''
                let config = {
                    useCdnDomain: true,//cdn加速
                    retryCount: 5 ,// 上传错误重新上传次数
                    forceDirect:true,
                }
                let putExtra = {
                    fname: file,
                    params: {},
                    mimeType: ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'] //可以上传的type
                }
                let observer ={
                next(res) {
                        // res.total.percent 上传进度
                        file.message = parseInt(res.total.percent)+'%'
                        if (file.message=='100%') {
                            file.status='done'
                            file.message='上传成功！'
                        }
                },
                error(code, message, isRequestError) {
                    //错误信息
                    console.log(code)
                    console.log(message)
                    console.log(isRequestError)
                    file.status='failed'
                    file.message='上传失败！'
                },
                complete(res) {
                    //上传成功
                    //json对象 有宽高，和url
                    // 视频宽高会返回null
                    file.url=_this.baseurl+res.key
                }
                }
                let observable = qiniu.upload(file.file, key, this.uploadtoken, putExtra, config) //调用七牛的上传
                let subscription = observable.subscribe(observer)//上传监听
            },
            handleclicksc(file) {
                    this.showvideoplay = true;
            },
            handleconfirpop() {
                    if (this.fileList.length > 0) {
                        this.carinfo.videofile = this.fileList[0].content;
                    }
                //这里写提交后台代码
            },
            handleplay(item) {
                    this.show = true;
                    this.fileList = [];
                    this.carinfo.ngEcoOpenNo = item.ngEcoOpenNo;
            } ,
            onOversize(){
                this.$toast('上传文件不得大于4M！');
            },
            closeplay(){
                 let myVideo=document.getElementById("media")
                 myVideo.pause()
            }
        },
    }
</script>

<style lang="less" scoped>
/deep/.van-field__control{
    max-height: 50vh;
}
/deep/.van-uploader__file{
    width: 350px;
}
/deep/.van-uploader__file-name{
    opacity: 0;
}
.publish{
    padding: 15px;
}
</style>