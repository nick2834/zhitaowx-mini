let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
const CUSTOME = 'api/user/mycustomer'
Page({
  data: {
    tabs: ["全部", "SVIP", "VIP","客户"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scrollheight:0,
    normal:false,
    customeList:[],
    type:'all',
    userInfo:{},
    token:null,
    identityCode:0
  },
  getCostome(data){
    let that = this
    app.showLoading()
    app.request({
      url: CUSTOME, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          that.setData({
            customeList: res.data.result
          })
        }
      }
    })
  },
  onLoad: function () {
    let that = this;
    let windowHeight = wx.getStorageSync('systemInfo').windowHeight;
    that.setData({
      islogin: app.globalData.islogin
    })    
    that.setData({
      scrollheight:windowHeight,
      userInfo:app.globalData.userInfo,
      token: app.globalData.token,
      identityCode: app.globalData.identityCode
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    let data = {
      type: that.data.type,
      token:that.data.token
    }
    that.getCostome(data)
  },
  tabClick: function (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let type = ""
    switch (id) {
      case 0:
        type='all'
        break;
      case 1:
        type= 'svip'
        break;
      case 2:
        type='vip'
        break;
      case 3:
        type='kehu'
        break
      default : type='all'
    }
    let data = {
      type: type,
      token: that.data.token
    }
    that.getCostome(data)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
});