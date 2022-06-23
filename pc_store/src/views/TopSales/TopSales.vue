<template>
  <div class="topsales">
    <van-nav-bar fixed placeholder title="销量排行榜" left-arrow @click-left="onClickLeft"></van-nav-bar>
    <div class="wrapper" > 
      <div class="top"><img src="@/assets/hometop/top.png" alt=""><strong>DIY硬件销量排行榜前十</strong> </div>
      <hr>
      <ul class="content">
        <li v-for="(item,index) in goods" :key="index" class="diy_item" >
            <span>{{index+1}}.</span>
          <card-list :item='item' :num='true' :isclick='true' :countx='false' :sales='true'></card-list>
        </li>
      </ul>
    </div>
   
  </div>
</template>

<script>
import CardList from "@/components/CardList/CardList";
import {getTopSales} from '@/api'
export default {
  name: "Search",
  data() {
    return {
      goods:[]
    };
  },
  components: { CardList },

  mounted() {
    this.gettopsales()
  },
  methods: {
    //加载状态
    loading() {
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true,
        loadingType: "circular",
      });
    },
    onClickLeft(){
      this.$router.go(-1);
    },
    //请求获取热门搜索关键词
    async gettopsales(){
      let result =await getTopSales()
      console.log(result);
      if(result.success_code==200){
        this.goods=result.message
        this.$toast.clear()
        }else{
          this.$toast({ message: result.message,icon: 'cross',});
        }
    },
  
  },

};
</script>

<style lang="less" scoped>
.wrapper{
  background: #fff;
  overflow: hidden;
  border-radius: 12px;
  border: solid 1px silver;
  box-shadow: 10px 10px 5px #888888;
  width: 92%;
  margin: 5px auto;
  padding-left: 5px;
  font-size: 15px;

  .top{
    display: flex;
    align-items: center;
    color: #0065e0;
    img{
    width: 10%;
    }
  }
  .topnumber{
    width: 7%;
    display: flex;
    img{
      width: 100%;
    }
  }
}
li{
  display: flex;
  align-items: center;
  span{
    font-size: 18px;
    font-style: oblique;
  }
  
}
li:first-child{
  span{
    font-size: 20px;
    color: red;
  }
}
li:nth-child(2){
  span{
    font-size: 19px;
    color: rgb(14, 90, 255);
  }
}
li:nth-child(3){
  span{
    font-size: 19px;
    color: rgb(236, 135, 95);
  }
}
</style>