<template>
  <div class="select-login">
    <div class="bottom">
      <img src="@/assets/login/logo.png" alt="" width="200">
      
    </div>
    <!-- <h4>选择登录方式</h4> -->
    <router-link tag="button" :to="{name:'Login'}">手机登录</router-link>
  </div>
</template>

<script>
    export default {
        name: "ToLogin"
    }
</script>

<style scoped lang="less" >
  .select-login{
    width :100%;
    height: 90vh;
    display :flex;
    flex-direction: column;
    justify-content: space-around;
    align-items :center;
  }
    button{
      width :80%;
      height :8%;
      background-color :#7232dd;
      border :none;
      border-radius: 5px;
      font-size :20px;
      color :#fff;
      margin-top :30px;
    }
      
    .bottom{
      width: 40%;
      img{
        width: 100%;
      }
    }
      
</style>
