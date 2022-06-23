<template>
    <div class="my">
        <van-nav-bar fixed placeholder title="地址管理" left-arrow @click-left="onClickLeft"></van-nav-bar>
        <div class="box">
            <van-address-list
                switchable
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
                @select='onselect'
            />
            
            <!-- 地址编辑 -->
            <van-popup v-model="show" position="bottom" round close-on-popstate closeable @close='closepopup'>
                <van-nav-bar title="编辑地址" ></van-nav-bar>
                <van-address-edit
                    :address-info='AddressInfo'
                    :area-list="areaList"
                    :show-delete='state!=1'
                    show-set-default
                    :area-columns-placeholder="['请选择', '请选择', '请选择']"
                    @save="onSave"
                    @delete="onDelete"
                    ref="refarea"
                />
            </van-popup>
        </div>
    </div>
</template>

<script>
import areaList from '@/utils/area'
import {mapState, mapActions} from 'vuex';
import {getAddress,getAddressInfo} from '@/api'
    export default {
        name:'My',
        data() {
            return {
                list:[],
                show:false,
                areaList,
                AddressInfo:{
                },
                state:0
            }
        },
        computed:{
            ...mapState(['userInfo','uploadtoken']),
        },
        mounted() {
            console.log(this.$route.query);
            this.getaddressinfo()
        },
        methods:{
             ...mapActions(['logOut','reqUploadToken']),
            async getaddressinfo(){
                this.loading()
                let result= await getAddressInfo();
                if(result.success_code==200){
                    result.message.forEach(element => {
                        element.tel=element.phone;
                        element.isDefault=element.isdefault?true:false;
                        if (element.province=='北京市' || element.province=='天津市' || element.province=='重庆市' || element.province=='上海市') {
                            element.address=element.province+element.county+element.lastaddress
                        }else{
                             element.address=element.province+element.city+element.county+element.lastaddress
                        }
                       
                    });
                    this.list=result.message
                    this.$toast.clear();
                }else{
                    this.$toast({ message: result.message,icon: 'cross',});
                }
            },
            onAdd() {
                this.show=true
                this.state=1
            },
            onEdit(item, index) {
                this.AddressInfo=item
                this.AddressInfo.areaCode=item.areacode
                this.AddressInfo.addressDetail=item.lastaddress
                this.show=true
                this.state=2
            },
            //回退
            onClickLeft(){
                this.$router.go(-1);
            },
            loading(){
            this.$toast.loading({
                duration:0,
                message: '加载中...',
                forbidClick: true,
                loadingType: 'circular',
            });
            },
            //关闭弹窗时触发
            closepopup(){
                this.state=0;
                this.AddressInfo={}
            },
            //
            async onSave(address){
                this.loading()
                let result=await getAddress({address,state:this.state})
                this.handle(result)
            },
            async onDelete(address){
                this.loading()
                let result=await getAddress({address,state:3})
                this.handle(result)
            },
            //处理添加，删除，修改结果
            handle(result){
                if(result.success_code==200){
                    this.$toast(result.message);
                    setTimeout(() => {
                        this.show=false;
                        this.getaddressinfo()
                    }, 500);
                }else{
                    this.$toast({ message: result.message,icon: 'cross',});
                }
            },
            onselect(item,index){
                if (this.$route.query.from) {
                    this.$store.commit('createorder',{address:item})
                    this.onClickLeft()
                }
                
            }
        }
    }
</script>

<style lang="less" scoped>
.myaddress{
    height: 100%;
    width: 100%;
}
/deep/.van-radio__icon .van-icon{
    display:none
}
/deep/.van-address-edit{
    background: #f6f6f6;
}
/deep/.van-address-list__bottom{
    background: transparent;
}
/deep/.van-button--danger {
    background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
    border: #00c6fb;
}
/deep/.van-tag--danger {
    background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
    border: #00c6fb;
}
</style>