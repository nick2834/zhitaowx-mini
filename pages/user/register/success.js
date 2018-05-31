const app = getApp()
Page({
  data: {
    
  },
  onLoad: function (options) {
    app.globalData.identityCode = 1
    let that = this
    that.setData({
      islogin: app.globalData.islogin
    })    
    app.pageLoad({
      fun:function(){
        app.getUserCenter(app.globalData.token)
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
  onShow: function () {
    
  },
  onHide: function () {
    
  },
  onUnload: function () {
    // 直接跳回用户中心
    wx.navigateBack({
      delta: 2
    })
  },
  onPullDownRefresh: function () {
    
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function () {
    
  }
})