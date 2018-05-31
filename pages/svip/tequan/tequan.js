var app = getApp();
Page({
  /** 
   * 页面的初始数据 
   */
  data: {
    goods_button:false,
    orientationList: [
      { 
        id: "01", 
        region: "高额返佣",
        img1: "img/unselected_btn_fl.png", 
        img2:"img/selected_btn_fl.png",
        src:"img/selected_btn_fl.png", 
        style:"color:#EAC37D"
      },
      {
        id: "02", 
        region: "两级推荐奖励",
        img1: "img/unselected_btn_jl.png",
        img2: "img/selected_btn_jl.png",
        src: "img/unselected_btn_jl.png", 
        style: ""
      },
      { 
        id: "03", 
        region: "专属客户返佣",
        img1: "img/unselected_btn_fy.png",
        img2: "img/selected_btn_fy.png",
        src:"img/unselected_btn_fy.png",
        style: ""
      },
      { id: "04", 
        region: "极速返佣", 
        img1: "img/unselected_btn_js.png", 
        img2: "img/selected_btn_js.png",
        src:"img/unselected_btn_js.png", 
        style: ""
      },
      { id: "05",
        region: "专属客服", 
        img1: "img/unselected_btn_kf.png", 
        img2: "img/selected_btn_kf.png", 
        src: "img/unselected_btn_kf.png",
        style: ""
      },
      { 
       id: "06",
       region: "尊贵标识",
       img1: "img/unselected_btn_svip.png",
       img2: "img/selected_btn_svip.png",
       src:"img/unselected_btn_svip.png",
       style: ""
       }
    ],
    act_addList: [
      {
        id: "01", region: "专享高额返佣",
        infos: [
          { info: "SVIP可享受商品高额返佣的专属福利，SVIP自购商品的返佣是普通VIP的1.5倍"},
          { info: "例如，商品A普通VIP购买获得10元返佣，SVIP购买则可获得15元的返佣"}
              ],
      },
      {
        id: "02", region: "两级推荐奖励",
        infos: [
          { info: "SVIP邀约一级客户或vip申请成为SVIP，得100元的奖励；邀约二级客户或vip申请成为SVIP，得20元的奖励" },
          { info: "SVIP拥有自己专属的二维码，通过分享智淘助手小程序链接或者二维码锁定两级客户关系" },
          { info: "例如，小李是SVIP，小李的朋友小红扫了他的二维码成为他的一级客户；小红申请成为SVIP时，小李可得100元的奖励(小红升级为SVIP后，小红是属于自己的一级客户，是小李的二级客户）；小张扫了小红的二维码，则小张成为小红的一级客户，成为小李的二级客户；小张申请成为SVIP时，小李得20元的奖励（小红得100元奖励）"}
        ]
      },
      {
        id: "03", region: "专属客户返佣",
        infos: [
          { info: "SVIP享受二级客户的返佣，获得直属客户或vip购物时省钱金额的50%返佣，获得二级客户或vip购物时省钱金额的12.5%" },
          { info: "例如，小李是SVIP，其一级客户小张通过智淘助手淘宝购物省了20元，则小李得10元的返佣；小李的二级客户小红通过智淘助手淘宝购物省了20元，则小李得2.5元的返佣" }
        ],
      },
      {
        id: "04", region: "极速返佣",
        infos: [
          { info: "SVIP通过智淘助手淘宝购物享有确认收货后返佣立即到账的特权，极速返佣额度30元/月；普通VIP确认收货后一般需要7天左右才到账" },
        
        ],
      },
      {
         id: "05", region: "专属客服",
         infos: [
           { info: "智淘助手推出专属微信(微信号：zhitaofuwu）为SVIP提供优先处理，专业解答、专属通道的极速客服服务" },
         ],
      },
      {
        id: "06", region: "尊贵标识",
        infos: [
          { info: "智淘SVIP标识将会实现多平台共享（后续智淘将会推出智淘手机APP），随时随地彰显尊贵身份，点亮SVIP图标，就是那么不一样！" },
        ],
      },
      
    ],
    toView: 'inToView01',
  },
  scrollToViewFn: function (e) {
    var _id = e.target.dataset.id;
    this.setData({
      toView: 'inToView' + _id,
    })
    let orientationList = this.data.orientationList
    for (var i = 0; i < orientationList.length;i++){
      if(orientationList[i].id == _id){
        orientationList[i].style = "color:#EAC37D";
        orientationList[i].src = orientationList[i].img2;
      }else{
        orientationList[i].style = "";
        orientationList[i].src = orientationList[i].img1;
      }
    }
    this.setData({
      orientationList: orientationList,
    })
  },
  onLoad: function (options) {
    this.setData({
      islogin: app.globalData.islogin
    }) 
    try {
      that.setData({
        goods_button: app.globalData.config.system.goods_button
      })
    } catch (e) {
    }      
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  //取消事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.dialog.hideDialog();
  }
})