<template>
    <div class="comreply" :style="isreply?'background: transparent;':''">
    <!-- 头像名字区 -->
        <div class="top">
        <div class="top_img">
            <van-image round width="1rem" height="1rem" :src="item.picture" alt="" fit="cover"/>
        </div>
        <div class="top_name">
            {{item.nickname}}<br><span class="time">{{item.time}} <span v-if="!isreply">评论</span> <span v-else>回复</span> </span>
        </div>
        </div>
        <!-- 文字区 -->
        <div class="content" v-html="item.content" v-if="item.content !=''">
        </div>
    </div>
</template>

<script>
    export default {
        name:'PublishList',
        data() {
            return {
            }
        },
        props:{ 
          item:Object,
          isdetail:Boolean,
          isreply:Boolean,
          index:Number,
        },
        mounted() {
        },
        computed:{
        },
        methods:{

        },
    }
</script>

<style lang="less" scoped>
.comreply{
    background: #fff;
}

.top{
  width: 100%;
  height: 50px;
  // background: rgb(147, 91, 202);
  display: flex;
  .top_img{
    margin: auto 15px;
    overflow:hidden;
  }
  .top_name{
    font-size: 1.3em;
    font-weight: 500;
    margin: auto 5px;
    .time{
      font-size: 0.8em;
      font-weight: 500;
      color: #9b9b9b;
    }
  }
}
.content{
  padding: 0 20px 0 70px;
  font-size: 15px;
  line-height: 1.7;
}

</style>