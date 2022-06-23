<template>
    <div class="my">
        <van-nav-bar fixed placeholder title="编辑资料" left-arrow right-text="完成" @click-right="onClickRight" @click-left="onClickLeft"></van-nav-bar>
        <div class="box">
            <van-uploader :max-count="1" :after-read="afterRead" image-fit class="vantimg">
                <van-image round width="3rem" height="3rem" :src="picture" alt="" fit="cover"/>
            </van-uploader>
            
            <span class="hint">点击头像更换</span>
            <!-- 输入任意文本 -->
            <van-form>
                <van-field v-model="nickname" label="昵称" placeholder="请输入2-12位字符！" :formatter="formatter" format-trigger="onBlur" :rules="[{ pattern:userpattern, message: '请输入2-12位字符！' }]"/>
                <!-- 输入任意文本 -->
                <van-field readonly clickable name="picker" :value="sex" label="性别" placeholder="点击选择性别" @click="showPicker = true"/>
                <!-- 输入任意文本 -->
                <!-- 允许输入数字，调起带符号的纯数字键盘 -->
                <van-field v-model="age" label="年龄" placeholder="请输入年龄！" type="number"/>
                <van-field :value="phone" type="tel" label="手机号" readonly />
            </van-form>
            <van-popup v-model="showPicker" position="bottom">
                <van-picker show-toolbar :columns="sexs" @confirm="onConfirm" @cancel="showPicker = false"/>
            </van-popup>
        </div>
    </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import {mapState, mapActions} from 'vuex';
import {getMy} from '@/api'
    export default {
        name:'My',
        data() {
            return {
                baseurl:'https://nico33.icu/',
                userpattern:/^.{2,12}$/,
                sexs: ['男', '女', '外星人'],
                picture:'',
                nickname:'',
                sex:'',
                age:0,
                showPicker: false,
            }
        },
        computed:{
            ...mapState(['userInfo','uploadtoken']),
            phone(){
                let a=this.userInfo.phone.substring(0,3)
                let c=this.userInfo.phone.substring(7,11)
                return a+'****'+c
            }
        },
        mounted() {
            this.picture=this.userInfo.picture
            this.nickname=this.userInfo.nickname
            this.sex=this.userInfo.sex
            this.age=this.userInfo.age;
            //获取七牛上传凭证
            this.reqUploadToken()
        },
        methods:{
             ...mapActions(['logOut','reqUploadToken']),
             //退出账号
            dealLogout(){
                const result=this.logOut();
                if(result.success_code==200){
                    this.$toast.success(result.message);
                }else{
                    this.$toast({ message: result.message,icon: 'cross',});
                }
            },
            //完成
            async onClickRight(){
                if (this.nickname.length<2 ||this.nickname.length>12) {
                    this.$toast('昵称长度为2-12字符！')
                    return
                }
                if (this.age.toString().length==0 || this.age.toString().length>4) {
                    this.$toast('年龄长度错误！')
                    return
                }
                this.loading()
                let result=await getMy({picture:this.picture,nickname:this.nickname,sex:this.sex,age:this.age})
                if(result.success_code==200){  
                    this.$toast.success('更新成功！');
                    this.$store.dispatch('reqUserInfo');//重新获取个人信息
                    this.onClickLeft()
                }else{
                    this.$toast({ message: result.message,icon: 'cross',});
                }
                
            },
            //回退
            onClickLeft(){
                this.$router.go(-1);
            },
            //选择性别弹窗
            onConfirm(value) {
                this.sex = value;
                this.showPicker = false;
            },
            //去除空格
            formatter(value) {
                return value.replace(/[, ]/g,'');
            },
            loading(){
            this.$toast.loading({
                duration:0,
                message: '发布中...',
                forbidClick: true,
                loadingType: 'circular',
            });
            },
            afterRead(file) {
                this.loading()
                this.uploadqiniu(file)
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
                    retryCount: 5 // 上传错误重新上传次数
                }
                let putExtra = {
                    fname: file,
                    params: {},
                    // mimeType: ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'] //可以上传的type
                }
                let observer ={
                next(res) {
                        // res.total.percent 上传进度
                        file.message = parseInt(res.total.percent)+'%'
                        if (file.message=='100%') {
                            file.status='done'
                            file.message='上传成功！';
                            _this.$toast(file.message)
                        }
                },
                error(code, message, isRequestError) {
                    //错误信息
                    console.log(code)
                    console.log(message)
                    console.log(isRequestError)
                    file.status='failed'
                    file.message='上传失败！';
                    _this.$toast(file.message)
                },
                complete(res) {
                    //上传成功
                    //json对象 有宽高，和url
                    // 视频宽高会返回null
                    file.url=_this.baseurl+res.key
                    _this.picture=file.url
                }
                }
                let observable = qiniu.upload(file.file, key, this.uploadtoken, putExtra, config) //调用七牛的上传
                let subscription = observable.subscribe(observer)//上传监听
            },
        }
    }
</script>

<style lang="less" scoped>
.my{
    background: #fff;
    height: 100%;
    width: 100%;
}
.box{
    width: 90%;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .vantimg{
        margin: 50px 0 15px;
    }
    .hint{
        color: #8c8c8c;
        margin-bottom: 15px;
    }
    
}

</style>