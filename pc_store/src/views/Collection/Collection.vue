<template>
  <div>
    <div v-if="this.$store.state.userInfo.id" class="collection">
      <!-- 顶部栏 -->
      <van-nav-bar fixed placeholder title="商品收藏" right-text="管理" @click-right="onClickRight" left-text="" :left-arrow="!$route.meta.showBottomTabBar " @click-left="onClickLeft"></van-nav-bar>
     
     <!-- 商品栏 -->
    
      <van-checkbox-group v-model="result" ref="checkboxGroup" class="cardground">
        <div v-for="(item,index) in collection" :key="index" class="car_item">
          <van-checkbox :name="item" :disabled="isdelete? false:item.number ==0 " ></van-checkbox>
          <card-list :item='item' :num='false' :isclick='$route.meta.showBottomTabBar' @update-count='updateCount' :countx='false'></card-list>
        </div>
        <div v-show="collection.length<3" class="other">
            <van-empty class="custom-image" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="没有更多了看看其它的吧！"/>
        </div>
      </van-checkbox-group>
      <div :style="!$route.meta.showBottomTabBar?'height: 1.3rem;':'height: 2.5rem'"></div>
      <!-- 底部提交栏 -->
      <van-submit-bar :price="price" :disabled='result.length==0' @submit="onSubmit" :button-color="result.length?'linear-gradient(to top, #00c6fb, #005bea)':'linear-gradient(to top, #a8caba, #5d4157)'" :button-text="isdelete?'删除':'提交订单'" :style="$route.meta.showBottomTabBar?'margin-bottom: 1.3rem':'' ">
        <van-button type="info" @click="checkAll">全选</van-button>
      </van-submit-bar>
    </div>
    <to-login v-else />
  </div>
</template>

<script>
import ToLogin from "@/components/ToLogin/ToLogin";
import CardList from '@/components/CardList/CardList'
import {getCollection,getDeleteCollection,getAddCollection} from '@/api'
export default {
  name: "Collection",
  data() {
    return {
      result: [],
      isdelete:false,
      collection:[],
      ischeck:true
    };
  },
  components: { ToLogin,CardList },
  computed:{
    price(){
      let sum =0
      if (this.result.length) {
        this.result.forEach(element => {
          sum +=parseInt(element.price) *element.count *100
        });
        return sum
      }else{return sum}
    }
  },
  mounted(){
    //获取收藏列表
    this.getCollect()
  },
  methods:{
    onSubmit() {
      let arrPid=[]
      if (this.isdelete) {//删除
        this.$dialog.confirm({
          title: '是否删除该商品？',
          }).then(() => {
            this.result.forEach((item,index,arr)=>{
              arrPid[index]=parseInt( item.pid)
            })
            this.deleteCollection(arrPid)
          }).catch(() => {  
            return
          });
      }else{//提交
        if (this.result.length>10) {
              this.$toast('购买商品过多！')
              return
            }else{
              if (this.result.every( (value, index) =>value.number-value.count>=0 )) {
                this.$store.commit('createorder',{goods:this.result})
                this.$router.push({name:'Pay',params:{from:1}})
              }else{
                this.$toast('库存不足！')
                return
              }
            }
        
      }
    },
    onClickRight(){this.result=[],this.isdelete =!this.isdelete},
    onClickLeft(){this.$router.go(-1) },
    loading(){
    this.$toast.loading({
        duration:0,
        message: '加载中...',
        forbidClick: true,
        loadingType: 'circular',
    });
    },
    //获取收藏列表
    async getCollect(){
      this.loading()
      const result=await getCollection();
        // console.log(result);
      if(result.success_code==200){
        this.collection=result.message
        this.$toast.clear()
        }else{
          this.$toast({ message: result.message,icon: 'cross',});
        }

    },
    //全选
    checkAll() {
      if (this.ischeck) {
        this.$refs.checkboxGroup.toggleAll({skipDisabled: true,checked: true,});
        console.log(this.result);
      }else{
        this.$refs.checkboxGroup.toggleAll(false);
        console.log(this.result);
      }
      this.ischeck =!this.ischeck
    },
    //取消收藏
    async deleteCollection(arrPid){
        this.loading()
        let result=await getDeleteCollection(arrPid);
        if(result.success_code==200){
            this.$toast.success(result.message);
            setTimeout(() => {
              this.getCollect()
            }, 500);
        }else{
            this.$toast({ message: result.message,icon: 'cross',});
        }
    },
    //收藏
    async updateCount(data){
        this.loading()
        let result=await getAddCollection(data.pid,data.count);
        console.log(result)
        if(result.success_code==200){
            this.$toast.clear()
        }else{
            this.$toast({ message: result.message,icon: 'cross',});
        }
    },
  },

};
</script>

<style lang="less" scoped>
.vanbar{
  margin-bottom: 0;
}

/deep/.van-checkbox{
  padding: 0 5px;
  overflow: visible;
  background: #fff;
}

/deep/.van-checkbox__icon{
    padding-left: 0 16px;
}
.car_item{
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.other{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /deep/.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}
}

</style>