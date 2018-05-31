var app = getApp()
const ACCOUNT = 'api/users/account'
Page({
  data: {
    goods_button:false,
    account:{},
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    }) 
    console.log(app.globalData.islogin)     
    app.pageLoad({
      fun:function(){
        that.check_identity();
        try {
          that.setData({
            goods_button: app.globalData.config.system.goods_button
          })
        } catch (e) {
        } 
        app.getUserCenter(app.globalData.token)
        that.getAccount()
      }
    })
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
  },
  getAccount(){
    let that = this
    app.request({
      url: ACCOUNT, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            account: res.data.result.data
          })
        }
      }
    })
  },
  onShow: function () {
    let that = this
    that.getAccount()
  },
  //检测身份状态变化
  check_identity() {
    var that = this;
    setInterval(function () {
      if (app.globalData.userInfo != null) {
        if (app.globalData.identityCode != that.data.identityCode && that.data.identityCode) {
          that.setData({
            identityCode: app.globalData.identityCode
          })
        }
      }
    }, 1000);
  }
})