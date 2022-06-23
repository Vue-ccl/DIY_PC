<template>
  <div @touchmove.prevent>
      <div v-if="this.$store.state.userInfo.id">
        <!-- 顶部栏 -->
        <van-nav-bar fixed placeholder title="DIY定制" right-text="清空" @click-right="onClickRight" left-text="" :left-arrow="!$route.meta.showBottomTabBar" @click-left="onClickLeft"></van-nav-bar>
        <!-- 中间 -->
        <div class="diy_list">
          <!-- 左边菜单导航栏 -->
          <div class="menu-wrapper" :style="!$route.meta.showBottomTabBar?'height: 86vh;':''">
            <van-sidebar v-model="activeKey" @change="onChange">
              <van-sidebar-item :title="item.title" v-for="(item,index) in tab" :key="index" />
            </van-sidebar>
          </div>
          <!-- 右边列表栏 -->
          <div class="list-wrapper" :style="!$route.meta.showBottomTabBar?'height: 86vh;':''">
            <!-- 全部商品 -->
            <div  class="diy_item_all">
              <div v-for="(item,index) in list" :key="index" class="diy_item" >
                <van-swipe-cell >
                  <card-list :item='item' :num='false' :isclick='$route.meta.showBottomTabBar' @update-count='updateCount' :countx='false'></card-list>
                  <template #right>
                    <van-button square text="删除" type="danger" class="delete-button" @click="isdeletediy(item.pid)" />
                  </template>
                </van-swipe-cell>
              </div>
              <div v-show="list.length<3" class="other">
                <van-empty class="custom-image" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="没有更多了看看其它的吧！"/>
              </div>
            </div>
          </div> 
        </div>
        <!-- 底部提交栏 -->
        <van-submit-bar :price="price"  @submit="onSubmit" button-color="linear-gradient(to top, #00c6fb, #005bea)" button-text="开始DIY" :style="$route.meta.showBottomTabBar?'margin-bottom: 1.3rem':'' ">    
        </van-submit-bar>
      </div>
      <!-- 登录页面 -->
      <to-login v-else />
  </div>
</template>

<script>
import ToLogin from '@/components/ToLogin/ToLogin';
import CardList from '@/components/CardList/CardList';
import {getDiyType,deleteDiy,addDiy} from '@/api'
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import diy from '@/utils/diy'
    export default {
        name:'Diy',
        data() {
            return {
                activeKey: 0,
                alist:[],
                list:[],
                tab:[
                {title:'全部'},
                {title:'CPU'},
                {title:'显卡'},
                {title:'主板'},
                {title:'内存条'},
                {title:'硬盘'},
                {title:'电源'},
                {title:'散热器'},
                {title:'机箱',},
                {title:'显示器'},
                {title:'键盘'},
                {title:'鼠标'},
                {title:'音响'},
                {title:'耳机'},
              ]
            }
        },
        components: { ToLogin,CardList },
        computed:{
          ...mapState(['diylist']),
          price(){
            let sum =0
            if (this.diylist.length>0) {
              this.diylist.forEach(element => {
                sum +=element.price*element.count *100
              });
              return sum
            }else{return sum}
          }

        },
        watch:{
          list(){
            this.$nextTick(()=>{
              this.init()
            })
          },
        },
        created() {
          this.getdiy(0)
        },
        mounted() {
        },
        methods:{
          //开始DIY
          onSubmit() {
            if (this.diylist.length>11) {
              this.$toast('购买商品过多！')
              return
            }else {
              if (this.diylist.every( (value, index) =>value.number-value.count>=0 )) {
              let res=diy.all(this.diylist)//DIY检测
              // console.log(res);
              if (res) {
                  res.forEach((element,index,arr)=>{
                    arr[index]=`${index+1}.${element}\n`
                  })
                    this.$dialog.confirm({
                        title: 'DIY提示是否继续？',
                        message: '以下为DIY基础检测，仅供参考，请已实际情况为准！\n'+res.join(''),
                        confirmButtonColor:'#005bea',
                        confirmButtonText:'继续',
                        messageAlign:'left '
                    }).then(() => {//有DIY提示仍继续提交订单
                        this.goOrderpay()
                    }).catch(() => {
                        return
                    });
                }else{//没DIY提示时，直接提交订单 
                    this.goOrderpay()
                }
              }else{
                this.$toast('库存不足！')
                return
              }
            }
            
          },
          //去提交订单页面
          goOrderpay(){
            // console.log('---',this.diylist);
            let oj=[]
            oj=Object.assign(oj,this.diylist)
            oj.forEach( (value,index,array)=> {
              array[index].property='null'
            });
            this.$store.commit('createorder',{goods:oj})
            this.$router.push({name:'Pay',params:{from:2}})
          },
          //是否清空
          async onClickRight(){
            this.$dialog.confirm({
              title: '是否清空DIY？',
              }).then(() => {
               this.deleteAll()
              }).catch(() => {
                return
              });
          },
          //清空
          async deleteAll(){
            this.loading()
            let result= await deleteDiy({pid:0})
              if(result.success_code==200){
              this.$toast('清空成功！')
              setTimeout(() => {
                this.activeKey=0
                this.getdiy(0) 
              }, 500);
              }else{
                this.$toast({ message: '请求数据失败！',icon: 'cross',});
              }
          },
          //是否删除
          isdeletediy(pid){
            this.$dialog.confirm({
              title: '是否删除该商品？',
              }).then(() => {
                this.deletediy(pid)
              }).catch(() => {  
                return
              });
          },
          //删除
          async deletediy(pid){
            this.loading()
            let result =await deleteDiy({pid})
            if(result.success_code==200){
                this.$toast('删除成功！')
                setTimeout(() => {
                  if (this.activeKey) {
                  this.getdiytype()
                  this.getdiy(1)
                  }else{this.getdiy(0) }
                }, 500);
                }else{
                  this.$toast({ message: '请求数据失败！',icon: 'cross',});
                }
          },
          onClickLeft(){this.$router.go(-1) },
          //加载状态
          loading(){
            this.$toast.loading({
                duration:0,
                message: '加载中...',
                forbidClick: true,
                loadingType: 'circular',
            });
          },
          //切换分类菜单
          onChange(index) {
            if (index) {
              this.getdiytype()
            }else{ this.getdiy(0)}
          },
          //请求diy全部列表
          getdiy(isfirst){
            this.loading()
            this.$store.dispatch('reqDiy',{
              callback:(result)=>{
                console.log('===',result);
                if(result.success_code==200){
                  this.$toast.clear();
                  if (isfirst==0) {
                    this.list=this.diylist
                  }
                }else{
                  this.$toast({ message: result.message,icon: 'cross',});
                }
              }
            })
          },
          //请求diy分类列表
          async getdiytype(){
            this.loading()
              let result=await getDiyType(this.activeKey)
              // console.log(result);
              if(result.success_code==200){
                this.list=result.message
                this.$toast.clear()
                }else{
                  this.$toast({ message: result.message,icon: 'cross',});
                }
          },
          //请求更新diy数量
          async updateCount(data){
              this.loading()
              let result=await addDiy({pid:data.pid,count:data.count});
              if(result.success_code==200){
                  this.$toast.clear()
                  if (this.activeKey) {
                    this.getdiytype()
                    this.getdiy(1)
                  }else{this.getdiy(0)}
              }else{
                  this.$toast({ message: '请求失败！',icon: 'cross',});
              }
          },
          //初始化better-scroll
          init() {
            let leftScroll =new BScroll('.menu-wrapper',{
              startY:true,
              click:true,
              mouseWheel: true,//开启鼠标滚轮
              disableMouse: false,//启用鼠标拖动
              disableTouch: false//启用手指触摸
            })
            let rightScroll =new BScroll('.list-wrapper',{
              startY:true,
              click:true,mouseWheel: true,//开启鼠标滚轮
              disableMouse: false,//启用鼠标拖动
              disableTouch: false//启用手指触摸
            })
          }

        },
        beforeRouteEnter (to, from, next) {
           window.scrollTo(0,0);
           next()
        }
    }
</script>

<style lang="less" scoped>
.menu-wrapper{
  height: 80vh;
}
.diy_list{
  display: flex;
  flex-direction: row;
  height: 80vh;
  .diy_item_all{
    flex:1;
  }
  .diy_item{
    display: flex;
    flex-direction: column;
  }
}
.delete-button {
  height: 100%;
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