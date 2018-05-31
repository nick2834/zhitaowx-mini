const app = getApp()
const USERCENTER = 'api/users/index'
Page({
  data: {
    userInfo: {},
    identityCode:-1,
    isFirstIn:false,
    goods_button: false,//是否显示底部导航,新手指引
    showToast: false,
    islogin: false,
    isLoading:false
  },
  //用户中心接口
  getUserInfo() {
    let that = this
    wx.showNavigationBarLoading()
    app.request({
      url: USERCENTER, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            userInfo: res.data.result.data,
            identityCode: res.data.result.data.type
          })
        }
        wx.hideNavigationBarLoading()
      },
      complete:function(res){
        setTimeout(() =>{
          that.setData({
            isLoading: true
          })
        },1000)
      }
    })
  },
  bindgetuserinfo(res) {
    let that = this
    let resultData = res.detail
    if (resultData.errMsg == "getUserInfo:fail auth deny") {
      //授权失败
    } else {
      //授权成功
      wx.request({
        method: 'post',
        url: app.globalData.serviceUrl + 'api/login/wxuserinfo',
        data: {
          token: app.globalData.token,
          rawData: res.detail.rawData,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        success: function (res) {
          if (res.data.code == 0) {
            app.globalData.token = res.data.result.data.token;
            app.globalData.userid = res.data.result.data.uid;
            app.data.pageFunction();
            wx.setStorageSync('token', res.data.result.data.token);
          }
        }
      });
    }
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      islogin: app.globalData.islogin,
      goods_button: app.globalData.config.system.goods_button,
      identityCode: app.globalData.identityCode
    })
    that.getUserInfo()
    app.pageLoad({
      fun:function(){
        that.check_identity();
        that.getUserInfo()
        try {
          that.setData({
            userInfo: app.globalData.userInfo
          })
        } catch (e) {
        } 
      }
    })
  },
  gotoCount(e){
    wx.navigateTo({
      url: '/pages/mycount/index',
    })
  },
  showToastBox(e){
    wx.navigateTo({
      url: '/pages/mycount/normalindex',
    })
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  onShow: function () {
    var that = this
    that.setData({
      islogin: app.globalData.islogin
    })    
    app.pageLoad({
      fun: function () {
        that.getUserInfo()
      }
    })
  },
  onShareAppMessage(res){
    return app.ShareAppMessage();
  },
  //检测身份状态变化
  check_identity() {
    var that = this;
    setInterval(function () {
      if (app.globalData.userInfo != null) {
        if (app.globalData.identityCode != that.data.identityCode) {
          that.setData({
            identityCode: app.globalData.identityCode
          })
        }
      }
    }, 1000);
  },
  showToast(e) {
    let that = this
    that.setData({
      showToast: true
    })
  },
  closeToast(e) {
    let that = this
    that.setData({
      showToast: false
    })
  },
  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      that.getUserInfo()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
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