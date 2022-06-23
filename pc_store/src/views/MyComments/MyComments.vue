<template>
<div class="mycomments">
    <van-nav-bar fixed placeholder title="我的评论" left-arrow @click-left="onClickLeft"></van-nav-bar>
   <div class="wrapper">
      <div class="scroll-wrapper">
        <div v-for="(item,index) in mycomments" :key="index" @click="todetail(item.fid,index)">
            <com-reply :index='index' :item='item' :isreply='false'></com-reply>
              <div class="touser">
                <div class="tousercontent">
                  {{item.tonickname}}：
                  <span v-html="item.tocontent" class="tocontent"></span>
                  <span v-if="item.toimgurl[0]">//图片 </span>
                  <span v-if="item.tovideourl">//视频 </span>
                  <div class="media">
                    <van-image width="100%" height="100%" :src="item.toimgurl[0]" alt="" fit="cover" v-if="item.toimgurl[0]"/>
                    <video :src="item.tovideourl" v-if="item.tovideourl"></video>
                    <van-icon name="play-circle-o"  size="25" v-if="item.tovideourl"/>
                  </div>
                </div>
                
              </div>
        </div>
          
      </div>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)
import {mapState,mapActions} from 'vuex'
import {getMyPublishList} from "@/api";
import ComReply from '@/components/ComReply/ComReply'
    export default {
      name:'MyComments',
      data () {
        return {
          page:1,
          count:10,
          ismore:true,
          xiala:'',
          showreplay:true
        }
      },
      components: {ComReply},
      mounted() {
        if (this.$route.params.state) {
          this.getmycomments()
        }
      },
      
      computed:{
        ...mapState(['mycomments']),
      },
      watch:{
        mycomments(){
          if(this.mycomments.length<this.page*this.count){
          this.ismore=false
          }else{this.ismore=true}
          this.$nextTick(()=>{
            this.init()
          })
        }
      },
      methods: {
        ...mapActions(['reqMyComments']),
        onClickLeft(){
          this.$router.go(-1);
        },
        loading(){
          this.$toast.loading({
              duration:0,
              message: '加载中...',
              forbidClick: true,
              loadingType: 'circular',
          });
        },
        //请求获取列表
        getmycomments(){
          this.loading()
          this.reqMyComments({page:this.page,count:this.count,
            callback:(result)=>{
              if(result.success_code==200){
                    this.$toast.clear();
              }else{
                    this.$toast({ message: result.message,icon: 'cross',});
              }
            }
          })
        },
        async todetail(fid,index){ 
            this.loading()
            let item={
                fid,
                nickname:this.mycomments[index].tonickname,
                picture:this.mycomments[index].topicture,                   
                videourl:this.mycomments[index].tovideourl,
                imgurl:this.mycomments[index].toimgurl,
                content:this.mycomments[index].tocontent,
                playerOptions:this.mycomments[index].playerOptions,
            }
            let result=await getMyPublishList({fid})
            if(result.success_code==200){
                item=Object.assign(item,result.message[0])
                this.$toast.clear()
            }else{
                this.$toast({ message: '请求失败！',icon: 'cross',});
            }
            console.log(item);
            this.$router.push({name:'Media',query:{item:item,isforum:4}})
        },
        init() {
          this.listScroll =new BScroll('.wrapper',{
            pullUpLoad: true,
                probeType: 3,
                startY:true,
                click:true,
                mouseWheel: true,//开启鼠标滚轮
                disableMouse: false,//启用鼠标拖动
                disableTouch: false//启用手指触摸
          })
          if (this.xiala==1) {
            this.listScroll.stop()//初始化禁止滚动----
          }
          this.listScroll.on('pullingUp', () => {
            console.log('触发上拉');
              if (this.ismore) {
                this.xiala=1
                this.page +=1
                this.getmycomments()
              }else{
                this.$toast('没有更多了！')
              }
            this.listScroll.finishPullUp()
          })
        },

      },
      beforeRouteLeave (to, from, next) {
        if (to.name=='Me') {
          this.$store.commit('into')
        }
        next()
      }
    }
</script>

<style lang="less" scoped>
.mycomments{
  height: 100%;
}
.wrapper{
  height: 100%;
  .scroll-wrapper{
    padding-bottom: 40px;
  }
}
.touser{
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
  .tousercontent{
    background: #f6f6f6;
    // height: 45px;
    border-radius: 6px;
    padding: 2px;
    display: flex;
    font-size: 15px;
    justify-content: center;
    align-items: center;
    .tocontent{
      letter-spacing:1px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      flex: 1;
    }   
    .media{
      height: 50px;
      width: 50px;
      margin-left: 5px;
      overflow: hidden;
      border-radius: 6px;
      position: relative;
      video{
        height: 100%;
        width: 100%;
      }
    }
  }
}
/deep/.van-icon{
    z-index: 1;
    position: absolute;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%) ;
    background: #fff;
    border-radius: 50%;
}
</style>