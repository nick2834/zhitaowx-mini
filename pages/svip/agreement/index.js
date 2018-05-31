var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    isBottom:true
  },

  agreeBtn(e){
    wx.navigateBack({
      delta: 1,
    })
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
    
  },
  upper(e) {
   },
  lower(e) { 
    let that = this
    let bottoms = e.detail.direction
    if(bottoms === 'bottom'){
      that.setData({
        isBottom:false
      })
    }
  },
  scroll(e){
  },
})