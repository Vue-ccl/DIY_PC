<template>
<div>
    <ul class="waterfall-container" >
        <li class="waterfall-item" v-for="(item,index) in type" :item="item" :key="index" @click="ToDetail(item.pid,item.type)">
            <div  class="king_png" v-if="item.ishot"><img src="@/assets/HotIcon/king.png" alt="" ></div>
            <div class="product_png">
                <!-- <img :class="item.ishot?'img_hot':'img_cood'" :src="item.picture[0]" alt="" v-if="item.picture[0]" /> -->
                <van-image :class="item.ishot?'img_hot':'img_cood'" :src="item.picture[0]" alt="" v-if="item.picture[0]"  >
                    <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                    </template>
                </van-image>
            </div>
            <div class="context_price">
                <div class="context">{{item.name}}</div>
                <div class="price_hot">
                    <img src="@/assets/HotIcon/hot.png" alt="" v-if="item.ishot">
                    <span class="price">￥{{price(item.price)}}</span>
                </div>
            </div>
        </li>
    </ul>
</div>
    
</template>

<script>
import {currency} from '@/utils/currency'
export default {
    name:'Goods',
    data() {
        return {
            
        }
    },
    props:{ type:Array },
    computed:{
        // price(){
        //     return currency(this.type.price,'')
        // }
    },
    methods:{
        ToDetail(pid,type){
            this.$router.push({name:'Detail',query:{pid,type}})
        },
        price(price){
            return currency(price,'')
        }
    }

}

</script>

<style lang="less" scoped>
.waterfall-container {
  /*分几列*/
  column-count: 2;
  width: 96%;
  margin: 5px auto ;
}
.waterfall-item {
    border-radius: 8px;
    overflow: hidden;
    break-inside: avoid;
    margin: 0px 0px 6px 0px;
    background: #fff;
    .king_png{
        img{
            width: 17%;
        }  
    }
    .product_png{
        text-align: center;
    }
    .product_png img{
        overflow: hidden;
    }
    .img_cood {
        width: 100%;
    }
    .img_hot {
        border-radius: 8px;
        width: 94%;
    }
    .context_price{
        padding: 5px;
        .context{
            font-size: 14px;
            letter-spacing:1px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .price_hot{
            align-items: center;
            display: flex;
            img{
                width: 15%;
            }
            .price{
                color: #ff4142;
                font-size: 17px;                 
            }
        }
    }
}
button{
  background-color: #7232dd;
  width: 100%;
  height: 40px;
  color: #fff;
  font-size: 1.5em;
}
</style>