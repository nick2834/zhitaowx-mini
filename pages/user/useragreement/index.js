const app = getApp();
Page({
  data: {
    windowHeight: 0
  },

  agreeBtn(e){
    wx:wx.navigateBack({
      delta: 1,
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
  onLoad: function (options) {
    let that = this
    that.setData({
      islogin: app.globalData.islogin
    })    
    let windowHeight = wx.getStorageSync('systemInfo').windowHeight;
    that.setData({
      windowHeight: windowHeight
    })
  }
})