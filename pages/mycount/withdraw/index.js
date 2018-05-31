const nameReg = /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/
var app = getApp()
const USERCENTER = 'api/users/index'
const EXTRACT = 'api/withdrawals/extract'
const ACCOUNT = 'api/users/account'
Page({
  data: {
    money:0,
    username:"",
    userInfo:null,
    fullMoney:0,
    disabled:false,
    account:{},
    identityCode: -1
  },
  //用户中心接口
  getUserInfo() {
    let that = this
    app.request({
      url: USERCENTER, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            userInfo: res.data.result.data,
            identityCode: res.data.result.data.type
          })
        } else {
          that.setData({
            identityCode: -1
          })
        }
      }
    })
  },
  getExtract(data){
    let that = this
    app.showLoading()
    app.request({
      url: EXTRACT, data: data, method:'post',success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          wx.navigateTo({
            url: '/pages/mycount/status/msg?status=' + res.data.status,
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  getAccount() {
    let that = this
    app.request({
      url: ACCOUNT, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            account: res.data.result.data,
            username: res.data.result.data.fullname
          })
        }
      }
    })
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    }) 
    let fullname = options.fullname
    if (that.data.username === "") {
      that.setData({
        disabled: true,
        username: fullname
      })
    }
    app.pageLoad({
      fun:function(){
        that.setData({
          userInfo: app.globalData.userInfo,
          fullMoney: options.money
        })
        that.getAccount()
      }
    })
  },
  onShow(){
    this.getAccount()
  },
  getnames(e){
    let that = this
    let uname = e.detail.value
    that.setData({
      username: uname
    })
  },
  getmoney(e){
    let that = this
    let val = e.detail.value
    that.setData({
      money:val
    })
  },
  formSubmit(e){
    let that = this
    let formBox = e.detail.value
    if(formBox.username == ''){
      wx.showModal({
        title: '温馨提示',
        content: '首次提现需验证提现账户真实姓名',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    if (formBox.money < 1){
      wx.showModal({
        title: '温馨提示',
        content: '提现金额需≥1元，请输入正确的金额',
        showCancel:false,
        confirmText:"知道了",
        confirmColor:"#317df4"
      })
      return;
    }
    if (formBox.money > Number(that.data.fullMoney)) {
      wx.showModal({
        title: '温馨提示',
        content: '提现金额超出可用佣金金额，请输入正确的金额',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    let data = {
      money: formBox.money,
      fullname: formBox.username
    }
    that.getExtract(data)
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