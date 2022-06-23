<template>
    <div class="media">
        <!-- 顶部栏 -->
        <van-nav-bar title="" left-text="" left-arrow @click-left="onClickLeft" fixed placeholder ></van-nav-bar>
         <publish-list :item='item' :index='index' @pre-view='preView' @player-play='playerPlay' @update-comments='updateComments' :isdetail='true' :isforum='isforum'></publish-list>
        <!-- 评论区 -->
        <div class="community" v-show="gjp">
            <div v-for="(itemc,indexc) in comments" :key="indexc">
                <com-reply :item='itemc' :index='indexc'></com-reply>
                <div style="padding-left:55px">
                    <van-button round type="info" size="mini" color="#f6f6f6" style="margin:0 0 10px 15px;color:'black'" @click="showpopup(true,indexc)" v-if="itemc.replycount==0">回复</van-button>
                    <van-button round type="info" size="mini" color="#f6f6f6" style="margin:0 0 10px 15px;color:'black'" @click="showpopup(false,indexc)" v-else>{{itemc.replycount}}条回复></van-button>
                </div>
            </div>
        </div>
        <div v-show="!gjp">
            <van-skeleton title avatar :row="3" v-for="index of 2" :key="index"/>
        </div>
        <!-- 回复评论弹窗 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '70%' }" closeable close-on-popstate class="popup" @close='closepopup' @opened='toreply'>
            <media-popup :item="comments[this.index]" :index='this.index' :isautofo="isautofo" ref='refpopup' @update-count='updateCount'></media-popup>
        </van-popup>
        <!-- 显示图片预览栏 -->
        <van-image-preview v-model="previewshow" :images="previewimgurl" :start-position="previewindex" closeable >
            <template v-slot:previewindex>{{ previewindex+1 }}/{{previewimgurl.length}}</template>
        </van-image-preview>
        <div style="text-align: center;font-size:15px;padding:5px 0;height: 70px;">没有更多内容了~</div>
    </div>

</template>

<script>
import PublishList from '@/components/PublishList/PublishList'
import ComReply from '@/components/ComReply/ComReply'
import MediaPopup from './MediaPopup.vue'
import {getComments,Reply,getReply} from '@/api'
    export default {
        name:'Media',
        data() {
            return {
                item:{},
                currentPlayer: null ,
                previewshow:false,//预览图片
                previewimgurl:[],
                previewindex:0,
                comments:[],

                show: false,
                isautofo:'',
                index:'',

                isforum:0,
                gjp:false
            }
        },
        components: {PublishList,ComReply,MediaPopup},
        created(){
            this.item=this.$route.query.item
            this.index=this.$route.query.index
        },
        mounted() {
            this.isforum=this.$route.query.isforum
            this.getcomments()
        },
        methods: {
            onClickLeft(){
                this.$router.go(-1)
            },
            //获取评论
            async getcomments(){
                let result =await getComments({fid:this.item.fid})
                if(result.success_code==200){
                  this.comments=result.message
                  this.gjp=true
                }else{
                    this.gjp=true
                  this.$toast({ message: result.message,icon: 'cross',});
                }
            },
            //预览图片
            preView(data){
                this.previewshow=true
                this.previewimgurl=data.arr
                this.previewindex=data.i
            },
            //播放
            playerPlay(data) {
                if (this.currentPlayer && this.currentPlayer!=data.player){
                    this.currentPlayer.pause()
                }
                this.currentPlayer = data.player
            },
            // 更新评论
            updateComments(data){
                data.picture=this.$store.state.userInfo.picture
                data.nickname=this.$store.state.userInfo.nickname
                data.replycount=0
                this.comments.unshift(data)
            },
            //更新评论的回复
            updateCount(data){
                this.comments[data.index].replycount +=1
            },
            //获取回复
            async getreply(){ 
                let reslut=await getReply({cid:this.comments[this.index].cid})
                console.log(reslut);
                this.reply=reslut.message
            },
            showpopup(isautofo,indexc){
                this.show=!this.show
                this.index=indexc
                this.isautofo=isautofo
            },
            //关闭弹出层后触发
            closepopup(){
                this.$refs.refpopup.back()
            },
            //打开弹出层后触发
            toreply(){
                this.$refs.refpopup.getreply()
            }
            
        },
    }
</script>

<style lang="less" scoped>
/deep/.van-nav-bar .van-icon {
    color: #f7f8fa;
}
/deep/.van-nav-bar__arrow{
    font-size: 0.5rem;
}
/deep/.van-nav-bar__left{
    background: #666;
    padding: 5px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    margin: 7px 0 0 5px;
    border-radius: 100%;
}
/deep/.van-button__text{
    color: #000;
}
.media{
    height: 100%;
    width: 100%;
}
.community{
    background: #fff;
    margin-top: 10px;
}
.popup{
    background: #f6f6f6;
    
}
/deep/.van-skeleton{
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px 20px;
}
</style>