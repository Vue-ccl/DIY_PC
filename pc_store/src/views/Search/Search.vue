<template>
  <div class="search">
    <van-sticky >
      <form action="/">
        <van-search v-model.trim="value"  show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel"  autofocus @focus='showtishi(1)'  @blur='showtishi(0)'/>
      </form>
        <div v-show="value && isshowtishi" class="tishilist">
            <ul>
                <li v-for="(item,index) in tishiList" :key="index" @click="gosearch(item)">
                    <van-cell :title="item"  />
                </li>
            </ul>
        </div>
      <!-- 下拉菜单栏 -->
      <van-dropdown-menu v-show="goods.length" active-color="#7232dd">
          <van-dropdown-item v-model="value1" :options="option1" @change="goodsmenu"/>
          <van-dropdown-item v-model="value2" :options="option2" @change="pricemenu"/>
          <van-dropdown-item v-model="value3" :options="option3" @change="salesmenu"/>
      </van-dropdown-menu>
    </van-sticky>
    <!-- 搜索结果 -->
    <div class="wrapper" ref="wrapper"> 
      <ul class="content">
        <li v-for="(item,index) in goods" :key="index" class="diy_item" >
          <card-list :item='item' :num='true' :countx='false' :sales='true' :isclick='true'></card-list>
        </li>
      </ul>
    </div>
    <!-- 热门关键词 -->
    <div class="hot_key" v-if="goods.length<2">
        <div class="hottitle">热门搜索</div>
          <div class="itemkey">
            <div class="item" v-for="(item, index) in keyword" :key="index" @click="gosearch(item.keyword)" >
              <span class="sapn1"> {{ index + 1 }}.</span>
              <span class="sapn2">{{ item.keyword }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import CardList from "@/components/CardList/CardList";
import {mapState,mapActions} from 'vuex'
import {getKeyword,addKeyword} from '@/api'
const delay = (function () {
    let timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback.ms)
    }
})()
export default {
  name: "Search",
  data() {
    return {
      tishiList: [],
      timer: null,
      jsonData: [],
      isshowtishi:0,

      value: "",
      isShow: true,
      keyword: [],
      goods: [],
      value1: 0,
      value2: 0,
      value3:0,
      option1: [
        { text: "全部商品", value: 0 },
        { text: "CPU", value: 1 },
        { text: "显卡", value: 2 },
        { text: "主板", value: 3 },
        { text: "内存条", value: 4 },
        { text: "硬盘", value: 5 },
        { text: "电源", value: 6 },
        { text: "散热器", value: 7 },
        { text: "机箱", value: 8 },
        { text: "显示器", value: 9 },
        { text: "键盘", value: 10 },
        { text: "鼠标", value: 11 },
        { text: "音响", value: 12 },
        { text: "耳机", value: 13 },
      ],
      option2: [
        { text: "价格", value: 0 },
        { text: "价格升序", value: 1},
        { text: "价格降序", value: 2 },
      ],
      option3: [
        { text: "销量", value: 0 },
        { text: "销量最高", value: 1 },
        { text: "销量最低", value: 2 },
      ],
    };
  },
  components: { CardList },
  computed:{
    ...mapState(['searchlist','searchvalue'])
  },
  mounted() {
    this.getKeyWord()
    this.goods=this.searchlist
    this.value=this.searchvalue
  },
  methods: {
    ...mapActions(['reqSearch']),
    showtishi(i){
        if (!i) {
          setTimeout(() => {
            this.isshowtishi=i
          }, 200);
        }else{this.isshowtishi=i}
        
    },
    // 开始搜索
    onSearch(val) {
      if(!this.value){
        this.$toast('请输入关键词！')
        return
      }
      this.isShow = false;
      this.loading();
      this.reqSearch({ value: this.value,typeid:this.value1,callback:()=>{this.$toast.clear()}});
      this.value2=0
      this.value3=0
      addKeyword({value: val})
      this.$store.state.searchvalue=this.value
    },
    onCancel() {
      this.$router.go(-1);
    },
    //加载状态
    loading() {
      this.$toast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true,
        loadingType: "circular",
      });
    },
    //点击关键词搜索
    gosearch(val) {
      this.isshowtishi=0
      this.value = val;
      this.value1=0
      this.onSearch(val);

    },
    //请求获取热门搜索关键词
    async getKeyWord(){
      let result =await getKeyword()
      for (let i = 0; i < 10; i++) {
        this.keyword.push(result.message[i])
      }
      this.jsonData=result.message
    },
    //分类商品
    goodsmenu(val){
      this.onSearch()
    },
    //价格排序
    pricemenu(val){
      if (val) {
        if (val==1) {//价格升序  
          this.goods=this.searchlist.sort(function(a, b){return a.price - b.price})
        }else{//价格降序
           this.goods=this.searchlist.sort(function(b, a){return a.price - b.price})
        }
      }else{//默认价格
         this.goods=this.searchlist
      }
    },
    //销量排序
    salesmenu(val){
            if (val) {
        if (val==1) {//价格升序  
          this.goods=this.searchlist.sort(function(b, a){return a.sales - b.sales})
        }else{//价格降序
           this.goods=this.searchlist.sort(function(a, b){return a.sales - b.sales})
        }
      }else{//默认价格
         this.goods=this.searchlist
      }
    },
    
  },
  watch:{
    searchlist(){
      if (this.searchlist.length >0 && this.searchlist.length < 2) {
        this.$toast('此产品较少，试其它或热门搜索')
      }
      if(this.searchlist.length ==0){
        this.$toast('查无此产品，试试其它或热门搜索')
      }
      this.goods=this.searchlist;
    },
    value (){
        //函数防抖
        if (this.timer) {
            clearTimeout(this.timer)
        }
        //删除文字  清零
        if (!this.value) {
            this.tishiList = []
            return
        }
        this.timer = setTimeout(() => {
            const result = []
            this.jsonData.forEach(val => {
                if (val.keyword.indexOf(this.value) > -1) {
                    result.push(val.keyword)
                }
            });
            this.tishiList = result
            console.log(this.tishiList)
        }, 100)
    }
  },
  beforeRouteLeave (to, from, next) {
    if(to.name!='Detail'){
      console.log('a');
      this.$store.commit('into')
    }
    next()
  }
};
</script>

<style lang="less" scoped>

.hot_key {
  width: 80%;
  margin: 20px auto;
  padding: 10px;
  border-radius: 12px;
  border: solid 1px silver;
  box-shadow: 10px 10px 5px #888888;
  .hottitle {
    font-size: 1.5em;
    font-weight: 600;
  }
  .itemkey {
    margin-top: 10px;
    .item {
      line-height: 2.2em;
      font-size: 1.3em;
      font-weight: 500;
      letter-spacing: 1px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      .sapn1 {
        font-size: 1.2em;
        font-weight: 600;
        color: #7232dd;
        font-style: oblique;
      }
    }
  }
}
.wrapper{
  overflow: hidden;
  border-radius: 0 0 15px 15px;
}
.tishilist{
  background: #fff;
  padding-left: 7%;
  font-size: 15px;
}
</style>