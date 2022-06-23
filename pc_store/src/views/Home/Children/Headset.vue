<template>
    <div>
        <goods :type='goods'></goods>
        <van-button color="linear-gradient(to top, #00c6fb, #005bea)" block @click="pagecount" v-if="ismore" class="ismore">加载更多</van-button>
    <div v-else class="ismore nomore" >没有更多</div>
    </div>
</template>

<script>
import {
  mapState
} from 'vuex'
import Goods from '@/components/Goods/Goods'
export default {
    name:'Headset',
    data() {
        return {
            loadshow:false,
            page:1,
            count:6,
            goods:[] ,
      ismore:true
        }
    },
    components:{Goods},
    computed:{...mapState(['headset'])},
    mounted() {
    this.reqhomehot()
    },
    watch:{
        headset(){
        this.goods= [].concat(...(Array.from(this.headset.reduce((total, cur, index) => {
        total[index % 2].push(cur)
        return total
        }, { 0: [], 1: [], length: 2 }))))
        if(this.headset.length<this.page*this.count){
        this.ismore=false
      }else{this.ismore=true}
    },
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
    reqhomehot(){
        this.loading()
        this.$store.dispatch('reqHomeHot',{page:this.page,count:this.count,type:'headset',callback:()=>{this.$toast.clear()}})
    },
    pagecount(){
        this.page +=1
        this.reqhomehot()
    },
}
}
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
</style>