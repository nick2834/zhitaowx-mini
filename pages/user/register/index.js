var app = getApp()
const REGISTER = 'api/users/register'
const GETCODE = 'api/sms/getcode'
var phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
var pswReg = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{8,16}/;
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      getmsg: "获取验证码"
    })
    countdown = 60;
    that.setData({
      flag: false
    })
    return;
  } else {
    that.setData({
      getmsg: countdown + 's重新获取',
      flag: true
    })
    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }, 1000)
}

Page({
  data: {
    getmsg: "获取验证码",
    userbind: {},
    phone: '',
    identify: '',
    openid: null,
    flag: false,
    VIP: true,
    title: "注册SVIP",
    disabled: true,
    isAbled: false,
    token: null,
    types: 'zhuce',
    codeActived: false
  },
  onLoad: function (options) {
    console.log(options)
    let types = options
    let that = this
    that.setData({
      islogin: app.globalData.islogin
    })    
    app.pageLoad({
      fun: function () {
        that.setData({
          types: types
        })
        wx.getStorage({
          key: 'openid',
          success: function (res) {
            that.setData({
              userbind: res.data
            })
          },
        })
        that.setData({
          token: app.globalData.token
        })
        if (!that.data.VIP) {
          //动态设置标题
          wx.setNavigationBarTitle({
            title: "注册VIP"
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
  },
  getusers: function (e) {
    let that = this
    let phone = e.detail.value

    that.setData({
      phone: phone,
      codeActived: true
    })
  },
  getidentify(e) {
    let that = this
    let identify = e.detail.value

    that.setData({
      identify: identify
    })
  },
  formSubmit: function (e) {
    let that = this
    var phone = e.detail.value.phone;
    var identify = e.detail.value.identify;
    var password = e.detail.value.password;
    if (phone.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    if (identify.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    var data = {
      phone: phone,
      code: identify,
      token: that.data.token
    }
    app.request({
      url: REGISTER, data: data, method: 'post', success: function (res) {
        if (res.data.code === 0) {
          setTimeout(function () {
            app.globalData.identityCode = 1;
          }, 1);
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
          if (that.data.types.type === 'zhuce') {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/svip/buysvip/buysvip',
              })
            }, 2000)
          }
        } else {
          wx.showModal({
            title: '溫馨提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: "知道了",
            confirmColor: "#317df4"
          })
        }
      }
    })
  },
  getCode(e) {
    let that = this
    var phone = that.data.phone;
    if (phone.length < 1 || !phoneReg.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    if (that.data.flag) { return; }
    var data = {
      phone: phone,
      token: that.data.token
    }
    app.request({
      url: GETCODE, data: data, method: 'post', success: function (res) {
        // 倒計時結束重新開始
        that.setData({
          flag: true
        })
        if (res.data.code === 0) {
          settime(that)
        } else {
          wx.showModal({
            title: '溫馨提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: "知道了",
            confirmColor: "#317df4"
          })
        }
      }
    })
  }
})