<template>
    <div class="publishlist">
    <!-- 头像名字区 -->
        <div class="top">
        <div class="top_img">
            <van-image round width="1rem" height="1rem" :src="item.picture" alt="" fit="cover"/>
        </div>
        <div class="top_name">
            {{item.nickname}}<br><span class="time">{{item.time}}</span>
        </div>
        </div>
        <!-- 文字区 -->
        <div class="content" v-html="item.content" v-if="item.content !=''" @click="todetail">
        </div>
          <!-- 图片视频区 -->
          <div class="media" :class="isdetail?'jiagao':''">
          <!-- 图片 -->
          <div class="player" v-if="item.imgurl !=''">
              <div v-for="(imgitem,index2) in item.imgurl" :key="index2" :class="setClass(item.imgurl.length,index2+1)" @click="preview(item.imgurl,index2)">
              <img :src="imgitem" alt="">
              </div>
          </div>
          <!-- 视频 -->
              <div v-if="item.videourl!=''">
              <video-player
                  class="video-player vjs-custom-skin "
                      ref="videoPlayer"
                      :playsinline="true"
                      :options="item.playerOptions" 
                      @play="onPlayerPlay($event)"
                      @pause="onPlayerPause($event)"
                      @ended="onPlayerEnded($event)"
              />
              </div>
          </div>

          <!-- 点赞评论区 -->
            <div class="communication" :class="isdetail?'sticky':''">
              <van-cell-group v-if="isdetail">
                <van-form @submit="onSubmit">
                <van-field v-model="value" placeholder="请输入" />
                </van-form>
              </van-cell-group>

              <div :class="isdetail?'three1':'three'">
              <img src="@/assets/Communication/cheers.png" v-show="!item.ischeers" alt="" @click="handleCheers(1)">
              <img src="@/assets/Communication/cheers_in.png" v-show="item.ischeers" alt="" @click="handleCheers(0)">
              <span v-if="item.zancount > 0" class="count" :class="item.ischeers?'isok':''">{{item.zancount}}</span>
              <span v-else class="count">点赞</span>
              </div>
              <div :class="isdetail?'three1':'three'" @click="todetail">
              <img src="@/assets/Communication/allcommunity.png" alt="">
              <div v-if="item.replycount > 0" class="count">{{item.replycount}}</div>
              <span v-else class="count">评论</span>
              </div>
              <div :class="isdetail?'three1':'three'">
              <img src="@/assets/Communication/tag.png" v-show="!item.istag" alt="" @click="handleTag(1)">
              <img src="@/assets/Communication/tag_in.png" v-show="item.istag" alt="" @click="handleTag(0)">
              <span v-if="item.tagcount > 0" class="count" :class="item.istag?'isok':''">{{item.tagcount}}</span>
              <span v-else class="count">标记</span>
              </div>
            </div>   
    </div>
</template>

<script>
import {getCheers,getTag,Comments} from '@/api'
import {mapState} from 'vuex'
import _ from "lodash"
    export default {
        name:'PublishList',
        data() {
            return {
              value: '',
              currentPlayer: null ,
            }
        },
        props:{ 
          item:Object,
          isdetail:Boolean,
          isforum:Number,
          index:Number,
        },
        mounted() {
          // console.log('111',this.index);
        },
        computed:{
          ...mapState(['publishlist'])
        },
        methods:{
            loading(){
              this.$toast.loading({
                  duration:0,
                  message: '加载中...',
                  forbidClick: true,
                  loadingType: 'circular',
              });
            },
            setClass(length,index){
                if (length==1) {
                return 'player-w1'
                }
                if (length==2 ||length==4) {
                return 'player-w2'
                }
                if (length==3) {
                if (index==1) {return 'player-w1-1'}else{return 'player-w2'}
                }
                if (length==5 ||length==8) {
                if (index==1 ||index==2) {return 'player-w2'}else{return 'player-w3'}
                }
                if (length==6 ||length==9) {
                return 'player-w3'
                }
                if (length==7) {
                if (index==1) {return 'player-w1-1'}else{return 'player-w3'}
                }
            },
            preview(arr,i){
                this.$emit('pre-view',{arr,i})
            },
            onPlayerPlay(player) {
                this.$emit('player-play',{status:1,player})
            },
            onPlayerPause(player){
              player.pause()
            },
            onPlayerEnded(player) {
                console.log(player)
            },
            //进入帖子
            todetail(){
                this.$router.push({name:'Media',query:{item:this.item,index:this.index,isforum:this.isforum}})
            },
            //点赞防抖
            handleCheers:_.debounce(function(status) {
                this.getcheers(status)//你的业务逻辑
            }, 500, {
                'leading': true, //在延迟开始前立即调用事件
                'trailing': false, //在延时结束后不调用,保证事件只被触发一次
            }),
            //点赞业务逻辑
            async getcheers(status){
              this.loading()
              let result=await getCheers({fid:this.item.fid,status})
              if(result.success_code==200){
                if (this.isforum) {
                  this.$store.commit('cheers',{status,index:this.index,isforum:this.isforum})
                }
                if (status) {
                  if (this.isdetail) {
                    this.item.ischeers=1
                    this.item.zancount +=1
                  }
                  this.$toast('点赞成功！')
                }else{
                  if (this.isdetail) {
                    this.item.ischeers=0
                    this.item.zancount -=1
                  }
                  this.$toast('已取消点赞！')
                }
              }else{
                  this.$toast({ message: '请求失败！',icon: 'cross',});
                }
            },
            //标记防抖
            handleTag:_.debounce(function(status) {
                //你的业务逻辑
                this.gettag(status)
            }, 500, {
                'leading': true, //在延迟开始前立即调用事件
                'trailing': false, //在延时结束后不调用,保证事件只被触发一次
            }),
            async gettag(status){
              this.loading()
              let result=await getTag({fid:this.item.fid,status})
              console.log(result);
              if(result.success_code==200){
                if (this.isforum) {
                  this.$store.commit('tag',{status,index:this.index,isforum:this.isforum})
                }
                if (status) {
                  if (this.isdetail) {
                    this.item.istag=1
                    this.item.tagcount +=1 
                  }  
                  this.$toast('标记成功！')
                }else{
                  if (this.isdetail) {
                    this.item.istag=0
                    this.item.tagcount -=1
                  }
                  this.$toast('已取消标记！')
                }
              }else{
                  this.$toast({ message: '请求失败！',icon: 'cross',});
                }
            },
            //评论
            async onSubmit(){
              this.loading()
              let result=await Comments({fid:this.item.fid,content:this.value})
              console.log(result);
              if(result.success_code==200){
                if (this.isforum) {
                  this.$store.commit('comments',{index:this.index,isforum:this.isforum})
                }
                if (this.isdetail) {
                  this.item.replycount+=1
                }          
                this.value=''
                this.$toast('评论成功！')
                this.$emit('update-comments',result.message)
              }else{
                  this.$toast({ message: '请求失败！',icon: 'cross',});
                }
            }
        },
    }
</script>

<style lang="less" scoped>
.publishlist{
    background: #fff;
    margin-bottom: 10px;
}
.communication{
  display: flex;
  justify-content: space-around;
  background: #fff;
  width: 100%;
  font-size: 1.1em;
  .three{
    width: 30%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    color: #777474;
    .count{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .van-cell-group{
    flex: 6;
  }
  .three1{
    flex: 1;
    padding: 5px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: #777474;
    .count{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  img{
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}
/deep/.van-field__control{
  background: #f5f6f7;
}
/deep/.van-cell{
  line-height: 1.0rem;
  background: #fff;
  padding: 0.15rem 0.2rem;
}
.top{
  width: 100%;
  height: 50px;
  // background: rgb(147, 91, 202);
  display: flex;
  .top_img{
    margin: auto 15px;
    overflow:hidden;
  }
  .top_name{
    font-size: 1.4em;
    font-weight: 550;
    margin: auto 5px;
    .time{
      font-size: 0.8em;
      font-weight: 500;
      color: #9b9b9b;
    }
  }
}
.content{
  padding: 10px 16px;
  font-size: 15px;
  line-height: 1.2;
}
.media{
  width: 100%;
  overflow: hidden;
  .player {
    width: 100%;
    max-height: 65vh;
    display: flex;
    flex-wrap: wrap;
    img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .player-w1 {
      margin: 0 auto;
      box-sizing: border-box;
  }
  .player-w2 {
    width: 50%;
    height:23vh;
    padding: 2px;
    box-sizing: border-box;
  }
  .player-w1-1 {
    width: 100%;
    max-height: 27vh;
    padding-bottom: 2px;
    box-sizing: border-box;
    img{
      object-fit: contain;
    }
  }
  .player-w3 {
    width: 33%;
    height: 18vh;
    padding: 2px;
    box-sizing: border-box;
  }
}
.sticky{
    position: fixed;
    bottom: 0;
    z-index: 1;
}
.isok{
  font-size: 16px;
  font-weight: 550;
  font-style: oblique;
  color: #005bea;
}
.jiagao{
  padding-bottom: 8px;
}
</style>