const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsID: 1,
    pageImgs: []
  },
  getDetails(data){
    let that = this
    app.request({ url:'api/goods/jia_goods',success:function(res){
      if(res.data.code === 0){
        switch (data){
          case '1':
            that.setData({
              pageImgs: res.data.result[1]
            })
            break;
          case '2':
            that.setData({
              pageImgs: res.data.result[2]
            })
            break;
          case '3':
            that.setData({
              pageImgs: res.data.result[3]
            })
            break;
          case '4':
            that.setData({
              pageImgs: res.data.result[4]
            })
            break;
          default:
            that.setData({
              pageImgs: res.data.result[1]
            });
        }
      }
    }})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = options
    wx.setNavigationBarTitle({
      title: data.title,
    })
    this.setData({
      goodsID: data.id
    })
    this.getDetails(this.data.goodsID)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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