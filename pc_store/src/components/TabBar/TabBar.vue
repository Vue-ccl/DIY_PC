<template>
  
    <!-- 底部 tabbar标签-->
    <van-tabbar v-model="tabbarIndex" active-color="#7232dd" inactive-color="#000" placeholder   route :safe-area-inset-bottom='true'>
      <van-tabbar-item v-for="(item,index) in this.$store.state.tabbarData" :key="index" :to="item.url" replace>
          <span>{{item.title}}</span>
      <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive"/>
      </template>
      </van-tabbar-item>
    </van-tabbar>
  
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      tabbarIndex:0,
    };
  },
  mounted(){
  },

};
</script>

<style lang="less" scoped>
/deep/.van-tabbar{
    z-index: 99
}
.van-tabbar-item{
    font-weight:600;
}
</style>