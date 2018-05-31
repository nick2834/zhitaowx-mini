const app = getApp()
const PAY = 'api/pay2'
var nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/;
var phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
Page({
  data: {
    switchID: 1,
    money: 0,
    takename: '',
    taketel: '',
    takeaddress: ''
  },
  formSubmit(e){
    let that = this
    let val = e.detail.value
    if (val.takename === '' || !nameReg.test(val.takename)){
      wx.showModal({
        title: '提示',
        content: '请输入正确的收货人',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return
    }
    if (val.taketel === '' || !phoneReg.test(val.taketel)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的收货手机号',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return
    }
    if (val.takeaddress === '') {
      wx.showModal({
        title: '提示',
        content: '请输入正确的收货地址',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return
    }
    wx.setStorageSync('userGoods', val)
    let data = {
      money: that.data.money
    }
    that.getPay(data)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      switchID:options.id
    })
    if (that.data.switchID == 1){
      this.setData({
        money: '2388'
      })
    } else if (that.data.switchID == 2){
      this.setData({
        money: '4399'
      })
    } else if (that.data.switchID == 3) {
      this.setData({
        money: '2599'
      })
    } else if (that.data.switchID == 4) {
      this.setData({
        money: '2888'
      })
    } else {
      this.setData({
        money: '2388'
      })
    }
    if (wx.getStorageSync('userGoods')){
      let datas = wx.getStorageSync('userGoods')
      that.setData({
        takename: datas.takename,
        taketel: datas.taketel,
        takeaddress: datas.takeaddress
      })
    }
  },
  getPay(data) {
    let that = this
    app.showLoading()
    app.request({
      url: PAY, data: data, method: 'post', success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          var payModel = res.data.jsapi
          wx.requestPayment({
            'timeStamp': '' + payModel.timeStamp + '',
            'nonceStr': payModel.nonceStr,
            'package': payModel.package,
            'signType': payModel.signType,
            'paySign': payModel.paySign,
            'success': function (res) {
              app.globalData.identityCode = 2
              if (that.data.routes == 'detials') {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              } else {
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/svip/svip',
                  })
                }, 1000)
              }
            },
            'fail': function (res) {
            }
          })
        }
      }
    })
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