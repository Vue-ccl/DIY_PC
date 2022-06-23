<template>
      <div class="container">
        <div class="circle">
        </div>
        <img src="@/assets/login/logo.png" alt="">
      </div> 
</template>

<script>
    export default {
        name: "Logo"
    }
</script>

<style scoped lang="less" >
img{
        width: 140px;
        z-index: 1;
    }
.container {
    position: relative;
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f7f7;
}
.circle {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-image: linear-gradient(0deg,
    rgb(47,102,255),
    rgb(153,64,255) 30%,
    rgb(238,55,255) 60%,
    rgb(255,0,76) 100%);
    animation: rotate 1s linear infinite;
}
.circle::before {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-image: linear-gradient(0deg,
    rgb(47,102,255),
    rgb(153,64,255) 30%,
    rgb(238,55,255) 60%,
    rgb(255,0,76) 100%);
    filter: blur(35px);
}
.circle::after {
    content: "";
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgb(255, 255, 255);}
button {
    background: #7232dd;
    position: absolute;
    color: #fff
}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }   
    100% {
        transform: rotate(360deg);
    }
}  
 
      
</style>
