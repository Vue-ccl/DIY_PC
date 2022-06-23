import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
Vue.config.devtools = true
Vue.config.productionTip = false

import waterfall from 'vue-waterfall2'
Vue.use(waterfall)

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(VueVideoPlayer);

import { Tabbar, TabbarItem } from 'vant';
import { Tab, Tabs } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import { Search } from 'vant';
import { Sticky  } from 'vant';
import { Toast  } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
import { Button } from 'vant';
import { SubmitBar } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import { NavBar } from 'vant';
import { Sidebar, SidebarItem } from 'vant';
import { Popover } from 'vant';
import { Card } from 'vant';
import { Tag } from 'vant';
import { Stepper } from 'vant';
import { GoodsAction, GoodsActionIcon, GoodsActionButton } from 'vant';
import { ImagePreview } from 'vant';
import { Icon } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Divider } from 'vant';
import { SwipeCell } from 'vant';
import { Lazyload } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
import { Dialog } from 'vant';
import { Popup } from 'vant';
import { Uploader } from 'vant';
import { Picker } from 'vant';
import { Image as VanImage } from 'vant';
import { AddressList } from 'vant';
import { AddressEdit } from 'vant';
import { Switch } from 'vant';
import { Collapse, CollapseItem } from 'vant';
import { Badge } from 'vant';
import { Overlay } from 'vant';
import { Skeleton } from 'vant';
import { Empty } from 'vant';
import { Loading } from 'vant';

Vue.use(Loading);
Vue.use(Empty);
Vue.use(Skeleton);
Vue.use(Overlay);
Vue.use(Badge);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Switch);
Vue.use(AddressEdit);
Vue.use(AddressList);
Vue.use(VanImage);
Vue.use(Picker);
Vue.use(Uploader);
Vue.use(Popup);
// 全局注册
Vue.use(Dialog);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Lazyload,{ lazyComponent: true,});
Vue.use(SwipeCell);
Vue.use(Divider)
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Icon);
// 全局注册
Vue.use(ImagePreview);
Vue.use(GoodsAction);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon);
Vue.use(Stepper);
Vue.use(Tag);
Vue.use(Card);
Vue.use(Popover);
Vue.use(Sidebar);
Vue.use(SidebarItem);
Vue.use(NavBar);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(SubmitBar);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(Search);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Sticky )
Vue.use(Toast )

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
