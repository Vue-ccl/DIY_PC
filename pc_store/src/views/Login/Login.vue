<template>
  <div class="select-login">
    <logo class="logo" />
    <div class="login-content">
      <van-tabs v-model="active" background="transparent" animated swipeable line-width="65px" >
        <!-- 验证码登录 -->
        <van-tab title="验证码登录">
          <van-form @submit="onSubmit" label-width="3.5em" colon >
           <div for="" class="inform" >
             <van-field
              v-model="phone"
              name="phone"
              label="手机"
              placeholder="请输入手机号码！"
              :rules="[{ pattern:phonepattern, message: '手机号码错误！' }]"
              />
              <button
                class="get-verification"
                v-if="!countDown"
                :disabled="!phoneRight"
                :class="{phone_right:phoneRight}"
                @click.prevent="getVerifyCode(1)"
              >
                获取验证码
              </button>
              <button
                v-else
                disabled="disabled"
                class="get-verification"
              >
                已发送({{countDown}}s)
              </button>
           </div> 
            <van-field
              v-model="code"
              type="text"
              name="code"
              label="验证码"
              placeholder="验证码"
              :rules="[{ pattern, message: '请填写4位验证码！' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" color="linear-gradient(to top, #00c6fb, #005bea)" native-type="submit">登录</van-button>
            </div>
          </van-form>
        </van-tab>
        <!-- 密码登录-->
        <van-tab title="密码登录">
         <van-form @submit="onSubmit" label-width="3.5em" colon >
             <van-field
              v-model="phone"
              name="phone"
              label="手机"
              placeholder="请输入手机号码！"
              :rules="[{ pattern:phonepattern, message: '手机号码错误！' }]"
              />
            <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入字母开头的6-18位密码！"
              :rules="[{ validator, message: '请输入字母开头的6-18位密码！' }]"
            />
            <div class="inform">
              <van-field
              v-model="captcha"
              type="text"
              name="captcha"
              label="验证码"
              placeholder="请输入！"
              :rules="[{ required:true, message: '' }]"
              />
              <div class="get-captcha">
                <div v-html="svgcode" @click.prevent="getCaptcha()"></div>
              </div>
              
              </div>
            <div style="margin: 16px;">
              <van-button round block type="info" color="linear-gradient(to top, #00c6fb, #005bea)" native-type="submit">登录</van-button>
            </div>
          </van-form>
        </van-tab>
        <!-- 账号注册-->
        <van-tab title="账号注册">
          <van-form @submit="onSubmit" label-width="4.7em" colon >
            <van-field
              v-model="nickname"
              type="text"
              name="nickname"
              label="昵称"
              placeholder="请输入2-12位字符！"
              :rules="[{ pattern:userpattern, message: '请输入2-12位字符！' }]"
              :formatter="formatter"
              format-trigger="onBlur"
            />
           <div for="" class="inform" >
             <van-field
              v-model="phone"
              name="手机"
              label="手机"
              placeholder="请输入手机号码！"
              :rules="[{ pattern:phonepattern, message: '手机号码错误！' }]"
              />
              <button
                class="get-verification "
                v-if="!countDown"
                :disabled="!phoneRight"
                :class="{phone_right:phoneRight}"
                @click.prevent="getVerifyCode(0)"
              >
                获取验证码
              </button>
              <button
                v-else
                disabled="disabled"
                class="get-verification "
              >
                已发送({{countDown}}s)
              </button>
           </div>
           <van-field
              v-model="paw"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入字母开头的6-18位密码！"
              :rules="[{ validator, message: '请输入字母开头的6-18位密码！' }]"
            />
           <van-field
              v-model="password"
              type="password"
              name="password"
              label="确认密码"
              placeholder="请输入字母开头的6-18位密码！"
              :rules="[{ validator, message: '请输入字母开头的6-18位密码！' }]"
            />
            <van-field
              v-model="code"
              type="text"
              name="code"
              label="验证码"
              placeholder="验证码"
              :rules="[{ pattern, message: '请填写4位验证码！' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" color="linear-gradient(to top, #00c6fb, #005bea)" native-type="submit">注册</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import {getPhoneCode,getPhoneCodeLogin,getPwdCodeLogin,getRegister,getSvgCode} from '@/api'
import Logo from "@/components/Logo/Logo.vue";
import {mapActions} from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      svgcode:'',
      active: 0,
      phone:'',
      nickname:'',
      password: '',
      paw:'',
      code:'',
      captcha:'',
      pattern: /\d{4}/,
      phonepattern:/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
      pawpattern:/^[a-zA-Z]\w{5,17}$/,
      userpattern:/^.{2,12}$/,
      countDown:0,
      userInfo: {}
    };
  },
  components: { Logo },
  computed:{
    phoneRight(){
      return this.phonepattern.test(this.phone)
    },
  },
  methods:{
     ...mapActions(['syncUserInfo']),
    //表单提交
    async onSubmit(values) {
      clearInterval(this.intervalId);//清除定时器
      this.countDown=0;
      // this.captcha='';
      this.$toast.loading({//提交状态
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      if(!this.active){//验证码登录
          const result=await getPhoneCodeLogin(this.phone,this.code);
          // console.log(result);
          this.code='';
          if(result.success_code==200){
              this.userInfo=result.data//登录成功后保存用户信息
              console.log(this.userInfo);
              this.$toast.success(result.message);
              // this.$router.push('/')
            }else{
              this.$toast({ message: result.message,icon: 'cross',});
            }
      }else if(this.active ===1){//密码登录
          const result=await getPwdCodeLogin(this.phone,this.password,this.captcha);
          console.log(result);
          this.captcha='';
          if(result.success_code==200){
              this.userInfo=result.data//登录成功后保存用户信息
              this.$toast.success(result.message);
              // this.$router.push('/')
            }else {
            this.getCaptcha()
            this.$toast({ message: result.message,icon: 'cross',});
           }
      }else{//注册账号
        //确认密码
        if(this.password != this.paw){
          this.$toast.fail('密码不一致！');
          return
        }
        const result=await getRegister(this.nickname,this.phone,this.password,this.code);
        console.log(result);
        this.code='';
        this.password='';
        if(result.success_code==200){
              this.active=1;
              this.$toast.success(result.message);
            }else{
              this.$toast({ message: result.message,icon: 'cross',});
            }
      }
      if (this.userInfo.id) {
        this.syncUserInfo(this.userInfo)
        this.gogo()
      }
    },
    //去除空格
    formatter(value) {
      return value.replace(/[, ]/g,'');
    },
    //密码格式校验
    validator(val){
      let ispwd=this.pawpattern.test(val)
      if(!ispwd){
        this.$toast({ message: '密码格式错误！',icon: 'cross',});
      }
      return ispwd
    },
    //获取短信验证码
    async getVerifyCode(isregister){
      if(this.phoneRight){
        this.countDown=60
        this.intervalId=setInterval(()=>{
          this.countDown-- 
          if(this.countDown===0){
            clearInterval(this.intervalId)
          }
          },1000)
      }
      let result=await getPhoneCode(this.phone,isregister)
      // console.log(result);
      if(result.success_code !== 200){
        //测试
        this.code=result.code
        this.$toast({
          message: result.message,
          position: 'center',
          duration: 3000
        });
        setTimeout(()=>{
            clearInterval(this.intervalId);
            this.countDown = 0;
        }, 1);
      }else{
        this.$toast('短信已发送！')
        // console.log(result.code);
        this.code=result.code
      }
    },
    //获取图形验证码
    async getCaptcha(){
      // this.$refs.capt.src ='http://node.nico33.icu/users/captcha?time=' + new Date()
      let result= await getSvgCode()
      // console.log(result);
      this.svgcode=result
    },
    //判断跳转地址
    gogo(){
      if (this.$route.query.Rurl) {
        this.$router.replace(this.$route.query.Rurl)
      }else{
        this.$router.replace('/home/hot')
      }
    }
  },
  mounted() {
    if(this.$store.state.userInfo.id) {
      this.gogo()
    }
    this.getCaptcha()
  },
  created(){
    
  },

};
</script>

<style scoped lang="less" >
.select-login {
  width: 100%;
  height: 100vh;
  align-items: center;
  .logo {
    padding: 65px 0;
  }
  .login-content {
    width: 85%;
    background: rgba(168, 164, 164, 0.1);
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    position: absolute;
    left: 0;
    right: 0;
    top: 210px;
    bottom: 0;
    margin: 0 auto;
    /deep/ .van-tab__text{
          font-size: 17px;
    }
  }

}
.inform{
  display: flex;
  flex-direction: row;
  background: #fff;
}
.get-verification{
    position :relative;
    padding: 0 1px;
    top :2px;
    right :15px;
    height: 2.4em;          
    border :0;
    color: #ccc;
    font-size :14px;
    background :transparent;
    margin: 2px;
    width: 45%;
    text-align: center;
    border-radius: 5px;
    &.phone_right{
      color :rgb(110, 45, 110);
      background-color:#ccc ;
      font-weight: 550;
    }
}
.get-captcha{
  width: 45%;
}
/deep/.van-form{
  margin: 10px;
  padding: 5px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  border: solid 1px silver;
}
/deep/.van-cell{
  padding: 10px 11.25px;
}
/deep/.van-field__label{
  margin: 0px;
}
</style>
