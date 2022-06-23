<template>
<div class="pay">
  <van-nav-bar fixed placeholder title="订单支付" left-arrow @click-left="onClickLeft"></van-nav-bar>
  <div class="wrapper">
      <!-- 地址 -->
      <van-cell is-link :to="{name:'MyAddress',query:{from:1}}" icon="location-o">
        <template #title v-if="address">
          <span class="custom-title">收件人：{{address.name}} </span><van-tag v-if="address.isDefault" round color="linear-gradient(to top, #00c6fb, #005bea)">默认</van-tag><br>
          <span class="custom-title">收件号码：{{address.tel}} </span><br>
          <span class="custom-title">收件地址：{{address.address}} </span>
        </template>
        <template #title v-else>
          <span class="custom-title">暂未添加收件人信息，快去添加吧！</span>
        </template>
      </van-cell>
      <!-- 订单 -->
      <div class="products">
        <div class="pro-top">
          <van-icon name="balance-list" color="#005bea" size="30"/>
          <span>订单详细</span>
        </div>

        <div>
          <ul class="content">
            <li v-for="(item,index) in order.goods" :key="index" class="diy_item" >
              <card-list :item='item' :num='true' :isclick='false' :countx='true'></card-list>
            </li>
          </ul>
        </div>

      </div>
      <div class="products">
          <van-cell center title="一键装机" label="本服务提供免费装机！(仅支持DIY)">
            <template #right-icon>
              <van-switch v-model="order.isdiy" size="24" inactive-color="#dcdee0"  />
            </template>
          </van-cell>
      </div>
      <div class="products ">
        <van-cell title="商品金额" value="内容" >￥{{price|currency('')}}</van-cell>
        <van-cell title="运费险" value="内容" >￥{{yunfeixian|currency('')}}</van-cell>
        <van-cell title="运费" value="内容" >￥{{yunfei|currency('')}}</van-cell>
        <van-cell title="立减" value="内容" value-class="redtext" label="最后一天，全场九折">-￥{{lijian|currency('')}}</van-cell>
        <van-cell title="优惠券" value="无" is-link ></van-cell>
        <van-cell title="合计" value="" value-class="redtext">￥{{allprice|currency('')}}</van-cell>
      </div>
      <div class="placeholder"></div>
  </div>
  <!-- 提交 -->

  <van-submit-bar :price="allprice*100" button-text="支付订单" @submit="goInOrder" button-color="linear-gradient(to top, #00c6fb, #005bea)" placeholder></van-submit-bar>
  
</div>
</template>

<script>
import {currency} from '@/utils/currency'
import {mapState,mapActions} from 'vuex'
import {getAddressInfo,getOrder,getOrderStatus} from '@/api'
import CardList from '@/components/CardList/CardList';
    export default {
      name:'Pay',
      data () {
        return {
          show:false,
          orderID:'',
          address:'',
          price:0,
          yunfei:0,
          yunfeixian:0,
          lijian:0,
          allprice:0,
        }
      },
      components: {CardList},
      created() {
        if (this.$route.params.from) {
            this.getaddressinfo()
        }
      },
      mounted() {
       if (this.order.address) {
         this.address=this.order.address
       }
       if (this.order.goods) {
          this.order.goods.forEach((element)=>{
            this.price =this.price+(element.count*element.price)
          })
          this.lijian=this.price*0.1
          this.allprice=this.price*0.9
        }
      },
      filters:{
        currency:currency
      },
      computed:{
        ...mapState(['order']),
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
        //请求地址
        async getaddressinfo(){
            this.loading()
            let result= await getAddressInfo();
            if(result.success_code==200){
                result.message.forEach(element => {
                    element.tel=element.phone;
                    element.isDefault=element.isdefault?true:false;
                    if (element.province=='北京市' || element.province=='天津市' || element.province=='重庆市' || element.province=='上海市') {
                        element.address=element.province+element.county+element.lastaddress
                    }else{
                          element.address=element.province+element.city+element.county+element.lastaddress
                    }
                    
                });
                this.address=result.message[0]
                this.$store.commit('createorder',{address:result.message[0]})
  
                this.$toast.clear();
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        //提交订单，支付
        async goInOrder(){
          if (this.address==null) {
            this.$toast('地址不能为空！')
            return
          }
          this.loading()
          let oj={
            price:this.price,
            yunfeixian:this.yunfeixian,
            yunfei:this.yunfei,
            lijian:this.lijian,
            allprice:this.allprice
          }
          //商品信息json化存储
          oj=Object.assign(oj,this.order)
          oj.isdiy=oj.isdiy?1:0
          console.log('++',oj);
          let result= await getOrder({oj});
          console.log(result);
            if(result.success_code==200){
                this.orderID=result.message
                this.$toast.clear();
                this.closePay()
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        //确认支付与放弃
        closePay(){
          this.$dialog.confirm({
              title: '是否确认付款？',
              cancelButtonText:'暂时放弃'
              }).then(() => {
                this.pay()
              }).catch(() => {
                this.$toast('订单未支付！')
                  setTimeout(() => {
                    this.$router.go(-1)
                  }, 500);
              });       
        },
        //支付
        async pay(item,status,index){
          this.loading()
          let i={oid:this.orderID}
          let result= await getOrderStatus({item:i,status: 2});
          console.log('--',result);
            if(result.success_code==200){
                this.$toast('订单支付成功！')
            }else{
               this.$toast('订单支付失败！')
            }
            setTimeout(() => {
              this.$router.go(-1)
            }, 500);
        },
      },
      beforeRouteEnter (to, from, next) {
        window.scrollTo(0,0);
        next()
      },
      beforeRouteLeave (to, from, next) {
        if(to.name!='MyAddress'){
          this.$store.commit('into')
        }
        next()
      }
    }
</script>

<style lang="less" scoped>
.pay{
  height: 100%;
}
.wrapper{
  height: 100%;
  padding: 10px 15px;
  .products{
    margin-top: 10px;
    border-radius: 12px;
    padding: 10px ;
    background: #fff;
    .pro-top{
      display: flex;
      font-size: 15px;
      align-items: center;
    }
  }
  
}
/deep/.van-cell {
  border-radius: 12px;
}
.redtext{
  color: rgb(236, 53, 53);
}
.placeholder{
  height: 10%;
}
</style>