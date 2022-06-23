<template>
  <div id="app">
    <keep-alive include="Home,Forum">
      <router-view></router-view>
    </keep-alive>
    <tab-bar v-show="$route.meta.showBottomTabBar && this.$store.state.userInfo.id"></tab-bar>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar/TabBar'
export default {
  data() {
    return {
      
    }
  },
  components: {TabBar},
  created(){
    this.$store.dispatch('reqUserInfo',{callback:(result)=>{
      if (result.success_code === 200) {
        this.$router.replace('/home/hot')
      }
    }})
    this.$store.dispatch('reqDiy',{callback:(result)=>{}})
    this.$store.dispatch('reqHomeForum',{callback:(result)=>{}})
  },
  mounted(){
    document.addEventListener('plusready', function() {
        var webview = plus.webview.currentWebview();
        plus.key.addEventListener('backbutton', function() {
            webview.canBack(function(e) {
                if(e.canBack) {
                    webview.back();
                } else {
                    //webview.close(); //hide,quit
                    //plus.runtime.quit();
                    //首页返回键处理
                    //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                    var first = null;
                    plus.key.addEventListener('backbutton', function() {
                        //首次按键，提示‘再按一次退出应用’
                        if (!first) {
                            first = new Date().getTime();
                            this.$toast('再按一次退出应用');
                            setTimeout(function() {
                                first = null;
                            }, 1000);
                        } else {
                            if (new Date().getTime() - first < 1500) {
                                plus.runtime.quit();
                            }
                        }
                    }, false);
                }
            })
        });
    });
  },
}
</script>

<style lang="less">
html,body,#app {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
}
</style>
