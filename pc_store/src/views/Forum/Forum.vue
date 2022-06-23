<template>
<div class="forum">
   <div class="wrapper">
      <div class="scroll-wrapper" v-show="publishlist.length">
          <publish-list v-for="(item,index) in publishlist" :key="index" :index='index' :item='item' @pre-view='preView' @player-play='playerPlay' :isforum=1></publish-list>
      </div>
      <div v-show="!publishlist.length">
        <van-skeleton title avatar :row="4" v-for="index of 4" :key="index"/>
      </div>
  </div>
  <!-- 显示图片预览栏 -->
    <van-image-preview v-model="previewshow" :images="previewimgurl" :start-position="previewindex" closeable >
        <template v-slot:previewindex>{{ previewindex+1 }}/{{previewimgurl.length}}</template>
    </van-image-preview>

  <!-- 刷新 -->
  <div class="replay" @click="test">
    <van-icon name="replay" size="35"  color="#fff" :class="{go:showreplay , aa:!showreplay}"/>
  </div>
  <!-- 选择发布弹窗 -->
  <van-popover v-model="showPopover" trigger="click" :actions="actions" class="selectitem"  placement="left-end" @select="isShow">
    <template #reference>
      <van-icon name="plus" size="35"  color="#fff" :class="{go:showPopover , aa:!showPopover}"/>
    </template>
  </van-popover>
  <!-- 发布弹窗 -->
  <van-popup v-model="show" position="right" :style="{ width: '100%',height:'100%' }" @close='closepopup'>
    <publish @is-publish='isPublish' :isimage='isimage' ref="refpopup"></publish>
  </van-popup>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)
import Publish from './Publish.vue'
import {mapState,mapActions} from 'vuex'
import PublishList from '@/components/PublishList/PublishList'
    export default {
    name:'Forum',
    data () {
      return {
        show:false,
        showPopover: false,
        isimage:true,

        previewshow:false,//预览图片
        previewimgurl:[],
        previewindex:0,

        actions: [
          { text: '图片/文字', icon: 'photo-o' },
          { text: '视频/文字', icon: 'video-o' },
        ],
        currentPlayer: null ,
        page:1,
        count:10,
        ismore:true,
        xiala:'',
        showreplay:true
      }
    },
    components: {Publish,PublishList},
    mounted() {
      // this.init()
      this.reqpublishlist()
    },
    
    computed:{
      ...mapState(['publishlist']),
      
    },
    watch:{
      publishlist(){
        if(this.publishlist.length<this.page*this.count){
        this.ismore=false
        }else{this.ismore=true}
        this.$nextTick(()=>{
          this.init()
        })
      }
    },
    methods: {
      ...mapActions(['reqPublishList']),
      //开关
      isShow(action,index){
        if (index !=0) {
          this.isimage=false
        }
        this.show=!this.show
      },
      isPublish(){
        this.isimage=true
        this.show=false
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
        this.reqPublishList({page:this.page,count:this.count,
          callback:(result)=>{
            if(result.success_code==200){
                  this.$toast.clear();
            }else{
                  this.$toast({ message: result.message,icon: 'cross',});
            }
          }
        })
      },
      test(){
        this.page=1
        this.listScroll.scrollTo(0,0)
        // this.listScroll.destroy()
        this.showreplay=!this.showreplay
        this.reqpublishlist()
        this.xiala=0
        setTimeout(() => {
          this.showreplay=!this.showreplay
        }, 500);

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
      //关闭弹出层后触发
      closepopup(){
        this.$refs.refpopup.onClickLeft()
        this.$refs.refpopup.back()
        this.isPublish()
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
        console.log('max++++',this.listScroll.maxScrollY);
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
      }
    }
    }
</script>

<style lang="less" scoped>
.forum{
  height: 100%;
}
.wrapper{
  height: 72vh;
  // overflow: hidden;
  .scroll-wrapper{
    padding-bottom: 40px;
  }
}
.replay{
  position: fixed;
  top: 65vh;
  right: 2vh;
  padding: 5px;
  border-radius: 50% ;
  background-image: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);
  .go {
    transform: rotate(-360deg);
    transition: all .5s;
  }
  .aa {
    transition: all .5s;
  }
}
.selectitem{
  position: fixed;
  top: 75vh;
  right: 2vh;
  padding: 5px;
  border-radius: 50% ;
  background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  .aa {
    transition: all .5s;
  }
  .go {
    transform: rotate(222.5deg);
    transition: all .5s;
  }
}
/deep/.van-skeleton{
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px 20px;
}
</style>