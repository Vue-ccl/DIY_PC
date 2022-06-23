<template>
    <div>
        <!-- 顶部栏 -->
        <van-nav-bar title="" left-text="" left-arrow @click-left="onClickLeft" fixed :border=false>
        </van-nav-bar>
        <!-- 中间商品栏 -->
        <div>
            <!-- 轮播图 -->
            <div class="picture">
                <van-swipe @change="onChange">
                    <van-swipe-item v-for="(item,i) in detail.picture" :key="i">
                        <img v-lazy="item" alt="" @click="preview(i)" loading='https://img01.yzcdn.cn/vant/apple-1.jpg'>
                    </van-swipe-item>
                    <template #indicator>
                        <div class="custom-indicator">{{ current + 1 }}/{{piclength}}</div>
                    </template>
                </van-swipe>
            </div>
            <!-- 价格数量栏 -->
            <div class="price-count" :class=" detail.ishot? 'ishot':'' " v-if="detail.price">
                <div class="price">¥<em>{{price}}</em></div>
                <div class="count"><van-stepper v-model="count" integer  min="1" max="99"  disable-input/></div>
            </div>
            <!-- 商品名称 -->
            <div class="name"> <div>{{detail.name}}</div> </div>
            <!-- 商品条例 -->
            <div class="comonun">
                <van-cell title="D I Y："  label="支持DIY免费装机"/>
                <van-cell title="运 费："  label="免运费" />
                <div>
                    <ul>
                        <li v-for="(item,indexxx) in service" :key="indexxx">
                            <van-icon name="certificate" color="#FF3300" size="0.5rem" />{{item}}
                        </li>
                    </ul>
                </div> 
            </div>
            <!-- 商品参数栏 -->
            <div class="parameter" v-if="detail.picture">
                <van-divider>产品规格参数</van-divider>
                <table cellpadding="0" cellspacing="1" width="100%" border="0" class="Ptable param_table">
                    <tbody>
                        <tr>
                            <th colspan="2">主体</th>
                        </tr>
                        <tr>
                            <th>产品类别</th>
                            <td>{{detail.typename}}</td>
                        </tr>
                        <tr>
                            <th>品牌</th>
                            <td>{{detail.brand}}</td>
                        </tr>
                        <tr>
                            <th>型号</th>
                            <td>{{detail.model}}</td>
                        </tr>
                        <tr>
                            <th colspan="2">规格</th>
                        </tr>                       
                        <tr v-if="detail.frequency">
                            <th v-if="detail.type == 'cpu'">主频</th>
                            <th v-if="detail.type == 'ddr'">内存频率</th>
                            <th v-if="detail.type == 'gpu'">核心频率</th>
                            <td>{{detail.frequency}}</td>
                        </tr>
                        <tr v-if="detail.power">
                            <th v-if="detail.type == 'gpu'">推荐电源</th>
                            <th v-else>额定功率</th>
                            <td>{{detail.power}}W</td>
                        </tr>
                        <tr v-if="detail.make">
                            <th>核心线程</th>
                            <td>{{detail.make}}</td>
                        </tr>
                        <tr v-if="detail.interface">
                            <th>接口</th>
                            <td>{{detail.interface}}</td>
                        </tr>
                        <tr v-if="detail.intertype">
                            <th>连接方式</th>
                            <td>{{detail.intertype}}</td>
                        </tr>
                        <tr v-if="detail.isgpu==0 || detail.isgpu==1">
                            <th>是否支持核显</th>
                            <td >{{detail.isgpu==0?'不支持核显':'支持核显'}}</td>
                        </tr>
                        <tr v-if="detail.length">
                            <th>显卡长度</th>
                            <td>{{detail.length}}cm</td>
                        </tr>
                        <tr v-if="detail.size">
                            <th v-if="detail.type == 'gpu'">显存容量</th>
                            <th v-if="detail.type == 'ddr'">内存容量</th>
                            <th v-if="detail.type == 'hdd'">存储容量</th>
                            <td v-if="detail.type == 'hdd'">{{detail.size}}</td>
                            <td v-else>{{detail.size}}GB</td>
                        </tr>
                        <tr v-if="detail.cpu">
                            <th>芯片组</th>
                            <td>{{detail.cpu}}</td>
                        </tr>
                        <tr v-if="detail.ddrtype">
                            <th>内存代数</th>
                            <td>{{detail.ddrtype}}</td>
                        </tr>
                        <tr v-if="detail.hddtype">
                            <th>硬盘类型</th>
                            <td>{{detail.hddtype}}</td>
                        </tr>
                        <tr v-if="detail.like">
                            <th>外观特征</th>
                            <td>{{detail.like}}</td>
                        </tr>
                        <tr v-if="detail.read">
                            <th>顺序读取速度</th>
                            <td>{{detail.read}}</td>
                        </tr>
                        <tr v-if="detail.write">
                            <th>顺序写入速度</th>
                            <td>{{detail.write}}</td>
                        </tr>
                        <tr v-if="detail.speed ">
                            <th>转速</th>
                            <td>{{detail.speed}}</td>
                        </tr>
                        <tr v-if="detail.wear">
                            <th>佩戴方式</th>
                            <td>{{detail.wear}}</td>
                        </tr>
                        <tr v-if="detail.keys">
                            <th>按键数</th>
                            <td>{{detail.keys}}</td>
                        </tr>
                        <tr v-if="detail.keytype">
                            <th>键盘类型</th>
                            <td>{{detail.keytype}}</td>
                        </tr>
                        <tr v-if="detail.buttom">
                            <th>键盘轴体</th>
                            <td>{{detail.buttom}}</td>
                        </tr>
                        <tr v-if="detail.monitorsize">
                            <th>屏幕尺寸</th>
                            <td>{{detail.monitorsize}}</td>
                        </tr>
                        <tr v-if="detail.bili">
                            <th>屏幕比例</th>
                            <td>{{detail.bili}}</td>
                        </tr>
                        <tr v-if="detail.hz">
                            <th>刷新率</th>
                            <td>{{detail.hz}}</td>
                        </tr>
                        <tr v-if="detail.fenbianlv">
                            <th>分辨率</th>
                            <td>{{detail.fenbianlv}}</td>
                        </tr>
                        <tr v-if="detail.dpi">
                            <th>DPI</th>
                            <td>{{detail.dpi}}</td>
                        </tr>
                        <tr v-if="detail.maxlength">
                            <th>显卡限长</th>
                            <td>≤{{detail.maxlength}}cm</td>
                        </tr>
                        <tr v-if="detail.maxheight">
                            <th>CPU散热器限高</th>
                            <td>≤{{detail.maxheight}}mm</td>
                        </tr>
                        <tr v-if="detail.mobotypes">
                            <th>支持板型</th>
                            <td>{{detail.mobotypes}}</td>
                        </tr>
                        <tr v-if="detail.hddm">
                            <th>固态硬盘位</th>
                            <td>{{detail.hddm}}</td>
                        </tr>
                        <tr v-if="detail.hdds">
                            <th>机械硬盘位</th>
                            <td>{{detail.hdds}}</td>
                        </tr>
                        <tr v-if="detail.powerinter">
                            <th>主电源接口</th>
                            <td>{{detail.powerinter}}</td>
                        </tr>
                        <tr v-if="detail.sata">
                            <th>SATA接口数量</th>
                            <td>{{detail.sata}}</td>
                        </tr>
                        <tr v-if="detail.eightpin">
                            <th>8pin接口数量</th>
                            <td>{{detail.eightpin}}</td>
                        </tr>
                        <tr v-if="detail.sixpin">
                            <th>6pin接口数量</th>
                            <td>{{detail.sixpin}}</td>
                        </tr>
                        <tr v-if="detail.height">
                            <th>散热器高度</th>
                            <td>{{detail.height}}mm</td>
                        </tr>
                        <tr v-if="detail.radtype">
                            <th>散热方式</th>
                            <td>{{detail.radtype}}</td>
                        </tr>
                        <tr v-if="detail.ddrnum">
                            <th>内存插槽数量</th>
                            <td>{{detail.ddrnum}}</td>
                        </tr>
                        <tr v-if="detail.ddrmax">
                            <th>最大内存容量</th>
                            <td>{{detail.ddrmax}}GB</td>
                        </tr>
                        <tr v-if="detail.ddrs">
                            <th>内存标准</th>
                            <td>{{detail.ddrs}}</td>
                        </tr>
                        <tr v-if="detail.cpuinter">
                            <th>适用CPU接口</th>
                            <td>{{detail.cpuinter}}</td>
                        </tr>
                        <tr v-if="detail.m2">
                            <th>M.2接口数量</th>
                            <td>{{detail.m2}}</td>
                        </tr>
                        <tr v-if="detail.mobotype">
                            <th>板型</th>
                            <td>{{detail.mobotype}}</td>
                        </tr>
                        <tr v-if="detail.soundcount">
                            <th>扬声器数量</th>
                            <td>{{detail.soundcount}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <logo class="logo" />
            <div style="height:40px"></div>
        </div>
        <!-- 显示图片预览栏 -->
        <van-image-preview v-model="show" :images="detail.picture" @change="preview_change" :start-position='index' closeable >
            <template v-slot:index>{{ indexx+1 }}/{{piclength}}</template>
        </van-image-preview>
        <!-- 底部栏 -->
        <van-goods-action >
        <van-goods-action-icon :icon='require("@/assets/Tabbar/cart_act.png")' text="" @click="ToCollection"/>
        <van-goods-action-icon :icon='require("@/assets/Tabbar/diy_act.png")' text="" @click="ToDiy"/>
        <van-goods-action-icon icon="star" text="" color="#ff5000" v-show="detail.iscollection" @click="deleteCollection"/>
        <van-goods-action-icon icon="star" text="" v-show="!detail.iscollection" @click="addcollection"/>
        <van-goods-action-button color="#be99ff" type="warning" text="加入DIY" @click="diy"/>
        <van-goods-action-button color="#7232dd" type="danger" text="立即购买" @click="topay"/>
        </van-goods-action>
    </div>

</template>

<script>
import {getDetail,getAddCollection,getDeleteCollection,addDiy} from '@/api'
import Logo from "@/components/Logo/Logo.vue";
import {currency} from '@/utils/currency'
import diy from '@/utils/diy'
export default {
    name:'Detail',
    data() {
        return {
            current: 0,
            detail:[],
            show: false,
            index: 0,
            indexx:0,
            count:1,
            bgimage:{
                is_hot:require("@/assets/HotIcon/is_hot.png"),
                is_cood:require("@/assets/HotIcon/is_cood.png"),
            },
            service:['7天无理由退货','送货上门','自提','7天价保','闪电退款','24H发货','可配送港澳台','闪电退款','送运费险']
        }
    },
    components: { Logo },
    computed:{
        piclength(){
            if (this.detail.picture !==undefined && this.detail.picture .length>0) {
                return this.detail.picture .length
            }else{
                return 0
            }
        },
        price(){
            return currency(this.detail.price,'')
        }
    },
    created() {
        this.GetDetail()
    },
    mounted() {
    },
    methods:{
        loading() {
            this.$toast.loading({
                duration: 0,
                message: "加载中...",
                forbidClick: true,
                loadingType: "circular",
            });
        },
        //预览图片
        preview(i){
            this.show=true
            this.index=i
        },
        //滑动预览
        preview_change(index) {
            this.indexx = index;
        },
        //异步请求获取产品详细信息
        async GetDetail(){
            let result=await getDetail({pid:this.$route.query.pid,type:this.$route.query.type});
            console.log(result);
            if(result.success_code==200){
                this.detail=result.message[0]
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        onClickLeft(){
            this.$router.go(-1)
        },
        ToDiy(){
            this.$router.push({name:'Diy',query:{dt:1}})
        },
        ToCollection(){
            this.$router.push({name:'Collection',query:{dt:1}})
        },
        onChange(index) {
            this.current = index;
        },
        //收藏
        async addcollection(){
            this.loading()
            let result=await getAddCollection(this.$route.query.pid,this.count);
            console.log(result)
            if(result.success_code==200){
                this.detail.iscollection=1
                this.$toast.success(result.message);
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        //取消收藏
        async deleteCollection(){
            this.loading()
            let result=await getDeleteCollection(this.$route.query.pid);
            if(result.success_code==200){
                this.detail.iscollection=0
                this.$toast.success(result.message);
            }else{
                this.$toast({ message: result.message,icon: 'cross',});
            }
        },
        //是否加入DIY
        diy(){
            this.detail.countt=this.count
            let res=diy.type(this.detail)
            console.log(res);
            if (res) {
                this.$dialog.confirm({
                    title: 'DIY提示是否继续？',
                    message: '以下为DIY基础检测，仅供参考，请已实际情况为准！\n\n'+res,
                    confirmButtonColor:'#005bea',
                    confirmButtonText:'继续',
                    messageAlign:'left'
                }).then(() => {
                    this.adddiy()
                }).catch(() => {
                    return
                });
            }else{
                this.adddiy()
            }
        },
        //加入diy
        async adddiy(){
            this.loading()
            let result=await addDiy({pid:this.$route.query.pid,count:this.count,property:this.detail});
            console.log(result);
            if(result.success_code==200){
                this.$toast('添加DIY成功！');
                setTimeout(() => {
                    this.$store.dispatch('reqDiy',{callback:(result)=>{}})
                }, 500);
                
            }else{
                this.$toast({ message: '添加DIY失败！',icon: 'cross',});
            }
        },
        //提交
        topay(){
            let goods=[]
            goods.push(this.detail)
            goods[0].count=this.count
            if (goods.every( (value, index) =>value.number-value.count>=0 )) {
               this.$store.commit('createorder',{goods})
                this.$router.push({name:'Pay',params:{from:1}})
            }else{
                this.$toast('库存不足！')
                return
            }
            
        }
    },

  
}
</script>

<style lang="less" scoped>
//vant css
.van-nav-bar{
    background: transparent;
}
/deep/.van-nav-bar .van-icon {
    color: #f7f8fa;
}
/deep/.van-nav-bar__arrow{
    font-size: 0.5rem;
}
/deep/.van-nav-bar__left{
    background: #666;
    padding: 5px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    margin: 7px 0 0 5px;
    border-radius: 100%;
}
/deep/.van-cell__title{
    display: flex;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    align-items: center
}
/deep/.van-cell__label{
    margin: 0 10px ;
    color: #262626;
    font-size: 13px;
    font-weight: 500;
}
//self css
.comonun{
    margin: 10px 0;
    border-radius: 15px;
    overflow: hidden;
    background: #ffdfdf;
    ul{
        padding: 12px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        li{
            margin-right: 5px;
            line-height: 2em;
            font-size: 1em;
            color: #8c8c8c;
        }
    }
}
.custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
}
.picture{
    width: 100%;
    img{
        width: 100%;
    }
}
.price-count{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: url('~@/assets/HotIcon/is_cood.png') no-repeat;
    background-size: 100%;
    padding: 12px 10px;
    .price {
        line-height: 1;
        color: #fff;
        font-size:20px;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        margin-left: 50px;
        padding: 3px 0;
    }
}
.ishot{
     background: url('~@/assets/HotIcon/is_hot.png') no-repeat;
     background-size: 100%;
}
.name{
    background: #fff;
    padding: 12px 18px;
    border-radius: 0 0 15px 15px ;
    div{
        font-weight: 700;
        line-height: 21px;
        font-size: 16px;
        font-family: inherit;
        color: #262626;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
    }
}
.parameter{
    margin: 10px 0;
    border-radius: 15px;
    overflow: hidden;
    background: #fff;
    padding: 12px 18px;
    // caption{
    //     display: flex;
    // }   
    table{
        border-collapse: collapse;
    }
    th,td,table {
        padding: 8px;
        border: 1px solid #dadada;
        text-align: left;
    }
    th{
        width: 30%;
    }
}
.logo{
    margin: 30px 0 ;
}
.van-goods-action{
    z-index: 2;
}
</style>