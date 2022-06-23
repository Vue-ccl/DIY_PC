<template>
    <div class="me">
        <div v-if="this.$store.state.userInfo.id">
            <!-- 个人设置 -->
            <div class="person">
                <div class="person-top">
                    <div class="top-photo">
                        <van-image round width="2.5rem" height="2.5rem" :src="userInfo.picture" alt="" fit="cover" class="vantimg"/>
                    </div>
                    <div class="top-name">{{phone}}</div>
                    <div class="top-name">你好，{{userInfo.nickname}}!</div>
                </div>
            </div>
            <!-- 我的论坛 -->
            <div class="box">
                    <span class="title">我的论坛</span>
                    <div class="box-content">
                        <router-link class="three" :to="{ name: 'MyForum', params: { state: 1 }}">帖子
                            <div class="threee">我发布的</div>
                        </router-link>
                        <router-link class="three" :to="{ name: 'MyComments', params: { state: 2 }}">评论
                            <div class="threee" >我发出的</div>
                        </router-link>
                        <router-link class="three" :to="{ name: 'MyTag', params: { state: 3 }}">标记
                            <div class="threee">我钟意的</div>
                        </router-link>
                    </div>
            </div>
            <!-- 我的订单 -->
            <div class="box">
                <span class="title">我的订单</span>
                <div class="box-content">
                    <router-link class="order" :to="{ name: 'Order', query: { status: 0 }}">
                        <img src="@/assets/home/allorder.png" alt="">
                        <div>全部订单</div>
                    </router-link>
                    <router-link class="order" :to="{ name: 'Order', query: { status: 1 }}">
                        <van-badge :content="count.daifukuan?count.daifukuan:''" max="99">
                        <img src="@/assets/home/okorder.png" alt="">
                        </van-badge>
                        <div>待付款</div>
                    </router-link>
                    <router-link class="order" :to="{ name: 'Order', query: { status: 2 }}">
                        <van-badge :content="count.daifahuo?count.daifahuo:''" max="99">
                        <img src="@/assets/home/daifahuo.png" alt="">
                        </van-badge>
                        <div>待发货</div>
                    </router-link>
                    <router-link class="order" :to="{ name: 'Order', query: { status: 3 }}">
                        <van-badge :content="count.daishouhuo?count.daishouhuo:''" max="99">
                        <img src="@/assets/home/daishouhuo.png" alt="">
                        </van-badge>
                        <div>待收货</div>
                    </router-link>
                </div>
            </div>
            <!-- 我的更多 -->
            <div class="box">
                <span class="title">我的更多</span>
                <div class="box-more">
                    <van-cell title="个人资料" is-link :to="{name:'My'}"/>     
                    <van-cell title="地址管理" is-link :to="{name:'MyAddress'}"/> 
                    <van-cell title="关于我们" @click="show = true" is-link/>
                    <van-button color="linear-gradient(to top, #00c6fb, #005bea)"  round  @click="dealLogout()" >退出账号</van-button>
                </div>
                
            </div>
            <!-- 遮罩层 -->
            <van-overlay :show="show" @click="show = false" z-index='999'>
                <div class="wrapper">
                    <div class="block">
                        <span>DIY电脑工作室</span><br>       
                        <span>提供DIY论坛和DIY商城</span><br>
                        <span>专为DIY爱好者和电脑需求者服务</span>
                    </div>
                </div>
            </van-overlay>
        </div>
         <to-login v-else />
    </div>
</template>

<script>
import ToLogin from '@/components/ToLogin/ToLogin';
import {mapState, mapActions} from 'vuex';
import {getMyOrderCount} from '@/api'
    export default {
        name:'Me',
        data() {
            return {
                count:[],
                show:false
            }
        },
        mounted() {
           this.getmyordercount()
        },
        components:{ ToLogin },
        computed:{
            ...mapState(['userInfo']),
            phone(){
                let a=this.userInfo.phone.substring(0,3)
                let c=this.userInfo.phone.substring(7,11)
                return a+'****'+c
            }
        },
        methods:{
             ...mapActions(['logOut']),
            // 退出
            dealLogout(){
                this.$dialog.confirm({
                title: '是否退出账号？',
                }).then(() => {
                    this.logOut({
                        callback:(result)=>{
                            console.log(result);
                        if(result.success_code==200){
                                this.$toast('已退出账号！');
                        }else{
                                this.$toast({ message: result.message,icon: 'cross',});
                        }
                        }
                    })
                }).catch(() => {
                    return
                });
                
            },
            //获取数量
            async getmyordercount(){
                let result= await getMyOrderCount();
                console.log(result);
                if(result.success_code==200){
                    this.count=result.message
                }else{
                    this.$toast({ message: result.message,icon: 'cross',});
                }
            },
            //关于我们
            about(){

            }
        }
    }
</script>

<style lang="less" scoped>
.me{
    background:url('./../../assets/home/me.png');
    background-size: 100% 100%;
    height: 80%;
    // position: fixed;
    width: 100%;
}
.person{
    width: 90%;
    margin: 0 auto;
    padding-top: 1.6rem;
    .person-top{
        display: flex;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);;
        border-radius: 10px;
        padding-bottom: 10px;
        .top-photo{
            position: relative;
            margin-bottom: 60px;
            .vantimg{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
        .top-name{
            font-size: 20px;
            font-weight: 550;
            text-align: center;       
        }
    }
}
.box{
    background: #fff;
    margin: 5px auto;
    width: 90%;
    border-radius: 10px;
    padding: 3px;
    .title{
        margin-left: 5px;
        font-size: 15px;
        font-weight: 550;
    }
    
}
.box-content{
        display: flex;
        justify-content: space-around;
        padding: 6px 0;
        background: #fff;
        .three{
            width: 30%;
            height: 60px;
            background-image: linear-gradient(120deg, #ebedee 0%, #fdfbfb 100%);
            border-radius: 10px;
            font-size: 17px;
            font-weight: 550;
            padding: 5px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .threee{
                font-size: 0.7em;
                font-weight: 500;
                color: #8c8c8c;
            }
        }
        .order{
            width: 20%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            img{
                width: 80%;
            }
        }
}
.box-more{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        background: #fff;   
}
.van-button--normal {
    padding: 0 1rem;
    font-size: 0.37333rem;
}
/deep/.van-badge--fixed{
    transform: translate(-30%,-10%);
}
.wrapper {
display: flex;
align-items: center;
justify-content: center;
height: 100%;
}

.block {
width: 250px;
height: 130px;
background-color: #fff;
border-radius: 15px;
text-align: center;
font-size: 16px;
padding: 10px 0;
line-height: 1.1rem;
 span:first-child{
     font-size: 18px;
     color: #005bea;
 }
}
</style>