var app = getApp()
const USERCENTER = 'api/users/index'
const PAY = 'api/pay'
const CODEPAY = 'api/svip/verification_code'
Page({
  data: {
    userInfo:{},
    routes:'',
    radioItems: [
      { name: '微信支付', value: '0', src: "img/icon_wxzf.png", checked: true},
      { name: '智淘码', value: '1', src: "img/icon_zhitao.png"}
    ],
    checkLabels: 0
  },
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
            identityCode: 0
          })
        }
      }
    })
  },
  radioChange: function (e) { 
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      checkLabels: e.detail.value
    });
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      islogin: app.globalData.islogin
    })     
    app.pageLoad({
      fun:function(){
        that.check_identity()
        that.getUserInfo()
        that.setData({
          userInfo: app.globalData.userInfo
        })
        if (JSON.stringify(options) === "{}"){
          return
        }else{
          that.setData({
            routes: options.route
          })
        }
        
      }
    })
  },
  //支付接口
  getPay(data){
    let that = this
    app.showLoading()
    app.request({
      url: PAY, data: data,method:'post' ,success: function (res) {
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
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)               
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
  //优惠支付
  codePay(data){
    let that = this
    app.showLoading()
    app.request({
      url:CODEPAY,data:data,method:'post',success:function(res){
        wx.hideToast()
        if(res.data.code === 0){
          app.globalData.identityCode = res.data.result.type
          wx.showModal({
            title: '温馨提示',
            content: res.data.result.msg,
            showCancel: false,
            confirmText: "知道了",
            confirmColor: "#317df4"
          })    
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
        }else{
          wx.showModal({
            title: '温馨提示',
            content: res.data.result.msg,
            showCancel: false,
            confirmText: "知道了",
            confirmColor: "#317df4"
          })
        }
      }
    })
  },
  //普通支付
  formSubmit(e){
    let that = this
    let data = {
      token:app.globalData.token,
      money:298
    }
    that.getPay(data)
  },
  //优惠码支付
  formSubmit2(e){
    let that = this
    let passCode = e.detail.value.passcode
    if(passCode === ''){
      wx.showModal({
        title: '温馨提示',
        content: '请输入正确的智淘码',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return
    }
    let data = { code: passCode, uid: app.globalData.userid}
    that.codePay(data)
  },
  //检测身份状态变化
  check_identity() {
    var that = this;
    setInterval(function () {
      if (app.globalData.userInfo != null) {
        if (app.globalData.identityCode != that.data.identityCode) {
          that.getUserInfo()
          that.setData({
            identityCode: app.globalData.identityCode
          })
        }
      }
    }, 1000);
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

