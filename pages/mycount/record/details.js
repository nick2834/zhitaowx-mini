var app = getApp()
const EXTRACTDETAILS = 'api/withdrawals/details'
Page({
  data: {
    extractDetails:{},
    token:null,
    has:false,
    status:0
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    })      
    let orderId = options.orderid
    app.pageLoad({
      fun:function(){
        let token = app.globalData.token
        that.setData({
          token: token
        })
        let falseToken = wx.getStorageSync('token')
        let data = {
          token: falseToken,
          id: orderId
        }
        that.getDetails(data)
      }
    })
    
  },
  getDetails(data){
    let that = this
    app.showLoading()
    app.request({
      url: EXTRACTDETAILS, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          that.setData({
            extractDetails: res.data.result.data,
            has: true,
            status: res.data.result.data.status
          })
        }
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
  }
})