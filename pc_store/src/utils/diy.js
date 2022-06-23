import store from '@/store'
// >>>>>>>>>>>>>>>>>>>
// 可以根据不同的需求，封装不同的请求 - 灵活
const diy = (item)=>{}
diy.type=(item)=>{
  let diylist =store.state.diylist
    let sum=0
    diylist.forEach(element => {
      if (element.typeid==item.typeid) {
        sum +=element.count  
      }
    });
    if (item.typeid==4 ||item.typeid==5 ) {
      if (item.countt+sum>2 ) {
        if (item.typeid==4) {
          return `加入DIY库后共有${item.countt+sum}件${item.typename}\nDIY建议:检查主板是否支持对应数量的内存插槽`
        }else{
          return `加入DIY库后共有${item.countt+sum}件${item.typename}\nDIY建议:检查主板是否支持对应数量的${item.interface}接口的${item.hddtype}`
        } 
      }else{
        return false
      }
    }else{
      if (item.countt+sum>1 ) {
        return `加入DIY库后共有${item.countt+sum}件${item.typename}\nDIY建议:一般1件${item.typename}！`
      }else{
        return false
      }
    }
}
diy.all=(item)=>{
  ////////          0    1        2       3/       4       5       6       7/      8/      /9//    /10/    /11/    /12//
  let TypeName= ['CPU', '显卡', '主板', '内存条', '硬盘', '电源', '散热器', '机箱', '显示器', '键盘', '鼠标', '音响', '耳机']
  let TypeName_t=[]//统计种类
  let oj =JSON.parse(JSON.stringify(item))
  let res1=[]//统计数量
  let res=[]
  oj.forEach((element,index) => {
    element.property=JSON.parse(element.property)
    TypeName_t.push(element.typename)
  });
  // console.log(oj);
  //完整度检测， 筛选出不包含的元素
  let f=[...TypeName.filter(_=>!TypeName_t.includes(_))]
  if (f.length) {
    res.push(`DIY缺少${f}`)
  }
  //统计种类数量
  for (let i = 0; i < 13; i++) {
    res1[i]=0
    oj.forEach(element => {
      if(element.typeid==i+1){
        res1[i] +=element.count
      }
    });
  }
  //同类型数量检测
  res1.forEach((element,index)=>{
    if (index==3 ||index==4) {
    }else{
      if (element>1) {
        res.push(`${TypeName[index]}大于1件，已有${element}件，DIY建议一般1件`)
      }
    }
  })
  //CPU与GPU检测
  if (res1[0]==1 && res1[1]==0) {
    let inter=oj.filter( (element, index) =>element.typeid==1 )[0].property.isgpu
    if (!inter) {
      res.push(`CPU不支持核显，请添加独立显卡`)
    }
  }
  //散热器高度与机箱检测
  if (res1[6]==1 && res1[7]==1) {
    let height=oj.filter( (element, index) =>element.typeid==7 )[0].property.height
    let maxheight=oj.filter( (element, index) =>element.typeid==8 )[0].property.maxheight
    if (height >maxheight) {
      res.push(`散热器高度(${height}mm)大于机箱限制(${maxheight}mm)`)
    }
  }
  //显卡长度与机箱检测
  if (res1[1]==1 && res1[7]==1) {
    let length=oj.filter( (element, index) =>element.typeid==2 )[0].property.length
    let maxlength=oj.filter( (element, index) =>element.typeid==8 )[0].property.maxlength
    if (length >maxlength) {
      res.push(`显卡长度(${length}cm)大于机箱限制(${maxlength}cm)`)
    }
  }
  //主板与机箱检测
  if (res1[2]==1 && res1[7]==1) {
    let mobotype=oj.filter( (element, index) =>element.typeid==3 )[0].property.mobotype
    let mobotypes=oj.filter( (element, index) =>element.typeid==8 )[0].property.mobotypes
    if (mobotypes.indexOf(mobotype)==-1) {
      res.push(`主板版型${mobotype}与机箱不匹配${mobotypes}`)
    }
  }
  //内存条数量、代数、容量与主板检测
   if (res1[3]>1 && res1[2]==1) {
    // let ddr=oj.filter( (element, index) =>element.typeid==2 )[0].property.length
    let ddrnum=oj.filter( (element, index) =>element.typeid==3 )[0].property.ddrnum
    let ddrtype=oj.filter( (element, index) =>element.typeid==3 )[0].property.ddrtype
    let ddrmax=oj.filter( (element, index) =>element.typeid==3 )[0].property.ddrmax
    let ddrs=oj.filter( (element, index) =>element.typeid==3 )[0].property.ddrs
    let ddrmax_t=0

    oj.forEach(element => {
      if (element.typeid==4) {
          if (element.property.ddrtype!=ddrtype) {
            res.push(`内存条代数(ddr${element.property.ddrtype})与主板不匹配(ddr${ddrtype})`)
          }
          ddrmax_t+=element.count*element.property.size
          if (!element.property.frequency.match(/\d+(\.\d+)?/g).some((value, index)=>ddrs.indexOf(value)!=-1)) {
            res.push(`内存条频率(${element.property.frequency})与主板不匹配(${ddrs})`)
          }
      }
      
    });
    if (ddrmax_t>ddrmax) {
      res.push(`内存条容量(${ddrmax_t}G)大于主板内存条容量(${ddrmax}G)`)
    }
    if (res1[3] >ddrnum) {
      res.push(`内存条数量(${res1[3]}件)大于主板内存条插槽(${ddrnum})`)
    }
  }
  //硬盘数量、接口与主板检测
  if (res1[4]>1 && res1[2]==1) {
    let m2=oj.filter( (element, index) =>element.typeid==3 )[0].property.m2
    let sata=oj.filter( (element, index) =>element.typeid==3 )[0].property.sata
    let m2_t=0
    let sata_t=0
    oj.forEach(element => {
      if (element.typeid==5) {
          if (element.property.interface=='SATA') {
            sata_t+=element.count
          }else{
            m2_t+=element.count
          }
      }
      
    });
    if (sata_t>sata) {
      res.push(`硬盘SATA接口数量(${sata_t})大于主板SATA接口插槽(${sata})`)
    }
    if (m2_t >m2) {
      res.push(`硬盘M.2接口数量(${m2_t})大于主板M.2接口插槽(${m2})`)
    }
  }
  //SATA接口硬盘与电源SATA接口检测
  if (res1[4]>1 && res1[5]==1) {
    let sata=oj.filter( (element, index) =>element.typeid==6 )[0].property.sata
    let sata_t=0
    oj.forEach(element => {
      if (element.typeid==5) {
          if (element.property.interface=='SATA') {
            sata_t+=element.count
          }
      }
      
    });
    if (sata_t>sata) {
      res.push(`硬盘SATA接口数量(${sata_t})大于电源SATA接口(${sata})`)
    }
  }
  //CPU与主板检测
  if (res1[0]==1 && res1[2]==1) {
    let inter=oj.filter( (element, index) =>element.typeid==1 )[0].property.interface
    let cpuinter=oj.filter( (element, index) =>element.typeid==3 )[0].property.cpuinter
    if (cpuinter.indexOf(inter)==-1) {
      res.push(`CPU接口(${inter})与主板不匹配(${cpuinter})`)
    }
  }
  //电源与主板 、显卡检测
  if (res1[5]==1 && res1[2]==1 && res1[1] ==1) {
    let power=oj.filter( (element, index) =>element.typeid==6 )[0].property
    let mobo=oj.filter( (element, index) =>element.typeid==3 )[0].property
    let gpu=oj.filter( (element, index) =>element.typeid==2 )[0].property
    //计算电源接口数量
    let all_power_pin =power.eightpin*8+power.sixpin*6
    power.powerinter.match(/\d+(\.\d+)?/g).forEach(element=>{
      all_power_pin+=parseInt(element)
    })
    // console.log(all_power_pin);
    //计算主板接口数量
    let all_mobo_pin =0
    mobo.powerinter.match(/\d+(\.\d+)?/g).forEach(element=>{
      all_mobo_pin+=parseInt(element)
    })
    //计算gpu接口数量
    let all_gpu_pin =0
    gpu.interface.match(/\d+(\.\d+)?/g).forEach(element=>{
      all_gpu_pin+=parseInt(element)
    })
    if (all_gpu_pin+all_mobo_pin >all_power_pin) {
      res.push(`主板接口(${mobo.powerinter})、显卡接口(${gpu.interface})可能与电源接口不匹配`)
    }
  }
  //显卡与电源检测
  if (res1[5]==1 && res1[1] ==1) {
    let power=oj.filter( (element, index) =>element.typeid==6 )[0].property.power
    let gpu_power=oj.filter( (element, index) =>element.typeid==2 )[0].property.power
    if (gpu_power >power) {
      res.push(`显卡推荐电源${gpu_power}W以上，大于电源额定功率${power}W`)
    }
  }
  // console.log(res);

  if (res.length) {
    return res
  }else{
    return false
  }
}
// 导出 请求函数
export default diy

