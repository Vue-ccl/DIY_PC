<template>
<div class="order">
  <van-nav-bar fixed placeholder :title="title" left-arrow @click-left="onClickLeft"></van-nav-bar>
  <div class="wrapper">
      <!-- 订单 -->
      <div class="products"  v-for="(item,index) in list" :key="index">
        <div class="pro-top">
          <van-icon name="balance-list" color="#005bea" size="30"/>
          <span style="flex:1">创建时间：{{item.time}}</span>
          <span style="color:#f84804" v-if="item.status==0">交易完成</span>
          <span style="color:#f84804" v-if="item.status==1">等待付款</span>
          <span style="color:#f84804" v-if="item.status==2">等待发货</span>
          <span style="color:#f84804" v-if="item.status==3">等待确认</span>
          <span style="color:#f84804" v-if="item.status==4">交易关闭</span>
        </div>
        <!-- 商品 -->
        <div>
          <ul class="content">
            <li v-for="(itemgoods,indexx) in item.goods" :key="indexx" class="diy_item" >
              <card-list :item='itemgoods' :num='true' :isclick='true' :countx='true'></card-list>
            </li>
          </ul>
        </div>
        <!-- 删除，付款，确认收货 -->
        <div class="control" >
            <van-button color=" #005bea" plain v-if="item.status==1" @click="getorderstatus(item,4,index)">取消订单</van-button>
            <van-button color=" #005bea" plain v-if="item.status==0 ||item.status==4" @click="getdeleteorder(item.oid,index)">删除订单</van-button>
            <van-button color="linear-gradient(to right, #00c6fb, #005bea)" style="float:right" v-if="item.status==1" @click="getorderstatus(item,2,index)">付款</van-button>
            <van-button color="linear-gradient(to right, #00c6fb, #005bea)" style="float:right" v-if="item.status==3" @click="getorderstatus(item,0,index)">确认收货</van-button>
        </div>
       
        <!-- 价格信息 -->
        <van-collapse v-model="activeNames">
          <van-collapse-item :name="index" title="" :value="item.allprice | currency('￥')" value-class='price'>
            <van-cell title="立减" value="内容" value-class="redtext" >-￥{{item.lijian|currency('')}}</van-cell>
            <van-cell title="运费险" value="内容" >￥{{0|currency('')}}</van-cell>
            <van-cell title="运费" value="内容" >￥{{0|currency('')}}</van-cell>
            <van-cell title="商品金额" value="内容" >￥{{item.price|currency('')}}</van-cell>
            <van-cell title="组装服务" value="内容" >{{item.isdiy==0?'不组装':'组装'}}</van-cell>
            <van-cell :label="item.address">
              <template #title>
                <div>收件人 {{item.name}}   ({{item.phone}})</div>
              </template>
            </van-cell>
            <van-cell>
              <template #title>
                <div>商品编号 {{item.oid}}</div>
              </template>
            </van-cell>
          </van-collapse-item>
        </van-collapse>
          
      </div>
      <div class="other" v-show="show">
          <van-empty class="custom-image" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="没有更多了看看其它的吧！"/>
      </div>
  </div>
  
</div>
</template>

<script>
import {currency} from '@/utils/currency'
import {mapState,mapActions} from 'vuex'
import {getMyOrder,getOrderStatus,getDeleteOrder} from '@/api'
import CardList from '@/components/CardList/CardList';
    export default {
      name:'Order',
      data () {
        return {
          title:'我的订单',
          status:0,
          list:[],
          activeNames: ['1'],
          show:false
        }
      },
      components: {CardList},
      created() {
        this.status=this.$route.query.status
        this.titleInfo()
        this.getmyorderer()
      },
      mounted() {
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
        titleInfo(){
          if (this.status==1) {
            this.title='待付款订单'
          }
          if (this.status==2) {
              this.title='待发货订单'
          }
          if (this.status==3) {
              this.title='待收货订单'
          }
          if (this.status==0) {
              this.title='全部订单'
          }
        },
        //获取订单
        async getmyorderer(){
          this.loading()
          let result= await getMyOrder({status:this.status});
            if(result.success_code==200){
                this.list=result.message
                this.$toast.clear();
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
            this.show=true
        },
        //更改订单状态
        getorderstatus(item,status,index){
          let tt=''
          if (status==4) {
            tt='是否取消订单？'
          }
          if (status==2) {
              tt='是否确认付款？'
          }
          if (status==0) {
              tt='是否确认收货？'
          }
          this.$dialog.confirm({
              title:tt ,
              }).then(() => {
               this.tostatus(item,status,index)
              }).catch(() => {
                return
              });
        },
        async tostatus(item,status,index){
          this.loading()
          let result= await getOrderStatus({item,status});
          console.log('--',result);
            if(result.success_code==200){
                if (this.status==0) {
                  this.list[index].status=status
                }else{
                  this.list.splice(index,1)
                }
                this.$toast.clear();
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        //更改订单为删除//是否确认删除
        getdeleteorder(oid,index){
          this.$dialog.confirm({
              title: '是否删除订单？',
              }).then(() => {
               this.todelete(oid,index)
              }).catch(() => {
                return
              });
        },
        ///更改订单为删除
        async todelete(oid,index){
          this.loading()
          let result= await getDeleteOrder({oid});
            if(result.success_code==200){
                this.list.splice(index,1)
                this.$toast('已删除订单');
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        closePopup(){
          this.$toast('订单未支付！')
          this.$router.go(-1)
        }
      },
      beforeRouteEnter (to, from, next) {
        window.scrollTo(0,0);
        next()
      },
    }
</script>

<style lang="less" scoped>
.order{
  height: 100%;
}
.wrapper{
  height: 100%;
  padding: 0px 15px;
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
    .control{
      height: 0.9rem;
    }
    /deep/.price{
      font-size: 15px;
      font-weight: 550;
      color: rgb(236, 53, 53);
    }
    .redtext{
      color: rgb(236, 53, 53);
    }
  }
  
}
/deep/.van-button{
  height: 0.9rem;
  border-radius: 0.15rem;
}
/deep/.van-cell {
  border-radius: 12px;
}
.placeholder{
  height: 10%;
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