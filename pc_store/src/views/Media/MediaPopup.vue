<template>
    <div class="mediapopup">
        <div>
            <com-reply :item='item'></com-reply>
            <van-cell-group>
                <van-form @submit="onSubmit">
                <van-field v-model="replyvalue" :placeholder="placeholder" :autofocus="isautofo?'true':'false'" ref="reference" @blur='huifucomments' :label='placeholder'/>
                </van-form>
            </van-cell-group>
        </div>
        <div class="reply">
            <p></p>
            <div v-for="(itemr,indexr) in reply" :key="indexr" v-show="gjp">
                    <com-reply :item='itemr' :isreply='true'></com-reply>
                    <div class="touser" v-if="itemr.replytype==0">
                        <span style="color:#0986fe;font-size:15px">{{itemr.tonickname}}:</span>
                        <span style="font-size:15px">{{itemr.tocontent}}</span>
                    </div>
                    <van-button round type="info" size="mini" color="#fff" style="margin:0 0 10px 70px;color:'black';background:'#fff'" @click="replys(itemr.rid,itemr.userid,itemr.nickname)">回复</van-button>
            </div>
            <div v-show="!gjp">
                <van-skeleton title avatar :row="3" v-for="index of 2" :key="index"/>
            </div>
            <div style="text-align: center;font-size:15px;padding:5px 0;">没有更多内容了~</div>
        </div>
    </div>
</template>

<script>
import ComReply from '@/components/ComReply/ComReply'
import {Reply,getReply} from '@/api'
    export default {
        name:'MediaPopup',
        data() {
            return {
                placeholder:'说点什么吧',
                reply:[],
                replyvalue:'',
                replytype:1,
                torid:'',
                touserid:'',
                gjp:false
            }
        },
        props:{ 
          item:Object,
          isautofo:Boolean,
          index:Number
        },
        components: {ComReply},
        created(){
        },
        mounted() {
            // this.getreply()
        },
        methods: {
            loading(){
              this.$toast.loading({
                  duration:0,
                  message: '加载中...',
                  forbidClick: true,
                  loadingType: 'circular',
              });
            },
            //获取回复列表
            async getreply(){
                this.loading()
                let result=await getReply({cid:this.item.cid})
                console.log(result);
                if(result.success_code==200){
                  this.reply=result.message;
                  this.$toast.clear()
                }else{
                  this.$toast({ message: '请求失败！',icon: 'cross',});
                }
                this.gjp=true
            },
            //退出触发
            back(){
                Object.assign(this.$data, this.$options.data())
            },
            //提交回复
            async onSubmit(){
                let result =await Reply({replytype:this.replytype,content:this.replyvalue,cid:this.item.cid,fid:this.item.fid,touserid:this.touserid,torid:this.torid})
                if(result.success_code==200){
                    this.$emit('update-count',{index:this.index})
                    this.replyvalue=''
                    this.$toast('回复成功！')
                    this.getreply()
                }else{
                  this.$toast({ message: '请求失败！',icon: 'cross',});
                }

            },
            //失去焦点触发
            huifucomments(){
                this.replytype=1;
                this.placeholder='说点什么吧';
                this.touserid=this.item.userid
            },
            // 回复触发
            replys(torid,touserid,tonickname){
                this.replytype=0;
                this.torid=torid;
                this.touserid=touserid;
                this.placeholder='回复'+tonickname;
                this.$refs.reference.focus()
            }
        },
    }
</script>

<style lang="less" scoped>
/deep/.van-button__text{
    color: #000;
}
.touser{
    border-left:solid 3px ;
    margin: 10px 70px;
    padding: 2px;
}
</style>