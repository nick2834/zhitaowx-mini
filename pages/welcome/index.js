const app = getApp()
Page({
  data: {
    islogin: false
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
          iv: res.detail.iv,
          appid: app.globalData.appid
        },
        success: function (res) {
          if (res.data.code == 0) {
            app.globalData.userid = res.data.result.data.uid;
            app.globalData.identityCode = res.data.result.data.type;
            app.data.pageFunction();
            app.globalData.islogin = true;
            app.globalData.isFirstLogin = true;
            that.setData({
              islogin: true
            })
            wx.setStorageSync('isFirstLogin', true)
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      });
    }
  },
  onLoad: function (options) {
    wx.setStorageSync('isFirstLogin', false)
  },
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})