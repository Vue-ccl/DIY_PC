<template>
    <van-card :price="price"  :title="item.name" :thumb="item.picture[0]" @click="ToDetail(item.pid,item.type)" >
        <template #tags>
            <van-tag color="#7232dd">{{item.typename}}</van-tag>
            <van-tag color="#7232dd">{{item.brand}}</van-tag>
            <van-tag color="#7232dd">{{item.model}}</van-tag>
            <div v-if="!countx">
                <van-tag  type="danger" v-if="(item.number <=10) && (item.number >0)">库存剩余{{item.number}}件！</van-tag>
                <van-tag  type="danger" v-if="item.number ==0 ">缺货！</van-tag>
            </div>
        </template>
        <template #footer>
            <div @click.stop v-if="!num">
                <van-stepper v-model="item.count"  @change="onChange(item.pid,item.count)" integer  min="1" max="99"  disable-input />
            </div>
            <div v-if="countx" class="count">
                数量：x<span>{{item.count}}</span>
            </div>
            <div v-if="sales" class="count sales">
                销量：<span>{{item.sales}}</span>
            </div>
        </template>
        
    </van-card>  
</template>

<script>
import {currency} from '@/utils/currency'
    export default {
        name:'Cardlist',
        data() {
            return {
                
            }
        },
        props:{
             item: Object,
             num:Boolean,
             isclick:Boolean,
             countx:Boolean,
             sales:Boolean
        },
        computed: {
            price(){
                return currency(this.item.price,'')
            }
        },
        methods:{
            onChange(pid,count){
                // console.log(pid,count);
                this.$emit('update-count',{pid,count})
            },
            ToDetail(pid,type){
                if (this.isclick) {
                    this.$router.push({name:'Detail',query:{pid,type}})
                }else{return }
            
            }
        },
        mounted(){
            // console.log(this.isclick);
            
        }
    }

</script>

<style lang="less" scoped>

.van-tag{
  margin: 0 10px 5px 0;
}
.van-card:not(:first-child) {
    margin-top: 0rem;
}
.van-card{
  width: 100%;
  background: #fff;
}
.van-card__price {
    color: #ee0a24;
}
.van-stepper{
    position: relative;
    top: -25px;
}
.van-card__footer{
  height: 0.1px;
}
/deep/.van-multi-ellipsis--l2 {
    font-size: 1.1em;
}
.count{
    font-size: 15px;
    position: relative;
    top: -20px;
    span{
        font-size: 16px;
    }
}
.sales{
    font-size: 14px;
    color: #a69a9a;
}
</style>