<template>
  <div class="home">
    <!-- 搜索框 -->
    <van-search shape="round" background='linear-gradient(to top, #00c6fb 0%, #005bea 100%)' placeholder="请输入搜索关键词" label="商品名称" @focus='toSearch'></van-search>
    <!-- Tar顶部导航栏 -->
    <van-sticky>
      <van-tabs v-model="activeName"   sticky color="#7232dd" > 
      <van-tab v-for="(item,index) in tab" :key="index" :to="item.url" :title="item.title" :name='item.name'> 
      </van-tab>
    </van-tabs>
    </van-sticky>
    <keep-alive >
      <router-view ></router-view>
    </keep-alive>
    <div style="height:50px"></div>
  </div>
</template>

<script>

export default {
  name: "Home",
  data() {
    return {
      activeName: 'hot',
      tab:[
        {title:'推荐',url:'/home/hot',name:'hot'},
        {title:'CPU',url:'/home/cpu',name:'cpu'},
        {title:'显卡',url:'/home/gpu',name:'gpu'},
        {title:'主板',url:'/home/mobo',name:'mobo'},
        {title:'内存条',url:'/home/ddr',name:'ddr'},
        {title:'硬盘',url:'/home/hdd',name:'hdd'},
        {title:'电源',url:'/home/power',name:'power'},
        {title:'散热器',url:'/home/radiator',name:'radiator'},
        {title:'机箱',url:'/home/pc',name:'pc'},
        {title:'显示器',url:'/home/monitor',name:'monitor'},
        {title:'键盘',url:'/home/keyboard',name:'keyboard'},
        {title:'鼠标',url:'/home/mouse',name:'mouse'},
        {title:'音响',url:'/home/sound',name:'sound'},
        {title:'耳机',url:'/home/headset',name:'headset'},
      ]
    };
  },
  components: {},
  mounted(){
    window.onscroll = this.justifyPos;
    if(!this.$store.state.userInfo.id) {
      this.$router.push('/login')
    }
    this.activeName= this.$route.name.toLowerCase()
  },
  methods:{
     toSearch(){
      this.$router.push('/search')
    },
    justifyPos() {
      // 节流；
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      this.timerId = setTimeout(() => {
        // 滚动停止的时候记录当前组件的滚动位置信息，并且存储到对应组件的路由 meta 这个对象中
        this.$route.meta.y = window.pageYOffset;
      }, 300);
     }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.state.tabbarData[0].url.params.fullpath=from.fullPath
    next()
  },
 
};
</script>

