<template>
<div class="myforum">
    <van-nav-bar fixed placeholder title="我的标记" left-arrow @click-left="onClickLeft"></van-nav-bar>
   <div class="wrapper">
      <div class="scroll-wrapper">
          <publish-list v-for="(item,index) in mytag" :key="index" :index='index' :item='item' @pre-view='preView' @player-play='playerPlay' :isforum=3></publish-list>
      </div>
  </div>
  <!-- 显示图片预览栏 -->
    <van-image-preview v-model="previewshow" :images="previewimgurl" :start-position="previewindex" closeable >
        <template v-slot:previewindex>{{ previewindex+1 }}/{{previewimgurl.length}}</template>
    </van-image-preview>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)
import {mapState,mapActions} from 'vuex'
import PublishList from '@/components/PublishList/PublishList'
    export default {
      name:'MyTag',
      data () {
        return {
          list:[],
          previewshow:false,//预览图片
          previewimgurl:[],
          previewindex:0,

          currentPlayer: null ,
          page:1,
          count:10,
          ismore:true,
          xiala:'',
          showreplay:true
        }
      },
      components: {PublishList},
      mounted() {
        // this.init()
        if (this.$route.params.state) {
          this.reqpublishlist()
        }
      },
      
      computed:{
        ...mapState(['mytag']),
      },
      watch:{
        mytag(){
          if(this.mytag.length<this.page*this.count){
          this.ismore=false
          }else{this.ismore=true}
          this.$nextTick(()=>{
            this.init()
          })
        }
      },
      methods: {
        ...mapActions(['reqMyTag']),
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
        reqpublishlist(){
          this.loading()
          this.reqMyTag({page:this.page,count:this.count,
            callback:(result)=>{
              if(result.success_code==200){
                    this.$toast.clear();
              }else{
                    this.$toast({ message: result.message,icon: 'cross',});
              }
            }
          })
        },
        //播放,只允许播放一个视频
        playerPlay(data) {
            if (this.currentPlayer && this.currentPlayer!=data.player){
                  this.currentPlayer.pause()  
            }
          this.currentPlayer = data.player
        },
        //预览图片
        preView(data){
          this.previewshow=true
          this.previewimgurl=data.arr
          this.previewindex=data.i
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
                this.reqpublishlist()
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
.myforum{
  height: 100%;
}
.wrapper{
  height: 100%;
  .scroll-wrapper{
    padding-bottom: 40px;
  }
}

</style>