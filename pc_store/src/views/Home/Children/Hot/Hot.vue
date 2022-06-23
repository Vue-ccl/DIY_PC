<template>
  <div class="hot">
    <div class="up">
      <div class="swipe">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color='#005bea'>
          <van-swipe-item v-for="(item,index) in homeswipe" :key="index">
             <img v-lazy="item.picture[0]" @click="ToDetail(item.pid,item.type)"/>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="limit">
        <router-link class="limit1" :to="{ name: 'TopSales'}"><img width="100%" height="100%" src="@/assets/hometop/topsales.png" alt="" fit="cover"/></router-link>
        <router-link class="limit1" :to="{name:'Media',query:{item:homeforum[0],index:0,isforum:4}}"><img width="100%" height="100%" src="@/assets/hometop/topforum.png" alt="" fit="cover"/></router-link>
      </div>
    </div>
     <goods :type='goods'></goods>
    <van-button color="linear-gradient(to top, #00c6fb, #005bea)" block @click="pagecount" v-if="ismore" class="ismore">加载更多</van-button>
    <div v-else class="ismore nomore" >没有更多了~</div>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import Goods from '@/components/Goods/Goods'
export default {
  name:'Hot',
  data() {
    return {
      loadshow:false,
      page:1,
      count:6,
      goods:[],
      ismore:true
    };
  },
  components:{Goods},
  computed:{
    ...mapState(['homeswipe','homehot','homeforum'])
  },
  mounted() {
      this.$store.dispatch('reqHomeSwipe')
      this.reqhomehot()
  },
  
  watch:{
    homehot(){
      this.goods= [].concat(...(Array.from(this.homehot.reduce((total, cur, index) => {
        total[index % 2].push(cur)
        return total
      }, { 0: [], 1: [], length: 2 }))))
      if(this.homehot.length<this.page*this.count){
        this.ismore=false
      }else{this.ismore=true}
    }
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
      //请求列表
      reqhomehot(){
           this.loading()
            this.$store.dispatch('reqHomeHot',{page:this.page,count:this.count,type:'homehot',callback:()=>{this.$toast.clear()}})
      },
      //加载更多
      pagecount(){
        this.page +=1
        this.reqhomehot()
      },
      ToDetail(pid,type){
          this.$router.push({name:'Detail',query:{pid,type}})
      },
      //去//首页帖子
      toforum(){
          this.$router.push({name:'Media',query:{item:homeforum[0],index:0,isforum:4}})
      },
  }

};
</script>

<style lang="less" scoped>
.ismore{
  font-size: 1.5em;
}
.nomore{
  color: #c6c6c6;
  background: transparent;
  text-align: center;
}
.hot {
  padding: 5px 0;
}
.up {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.swipe {
  width: 47%;
  border-radius: 15px;
  overflow: hidden;
}
.my-swipe .van-swipe-item {
  img {
    width: 100%;
    height: 235px;
  }
}

.limit {
  width: 47%;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1px 0 2px;
}
.limit1 {
  width: 100%;
  height: 48%;
  background-color: rgb(23, 167, 136);
  border-radius: 15px;
  overflow: hidden;
}




</style>