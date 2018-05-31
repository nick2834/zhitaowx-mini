var app = getApp()
const SETNAME = 'api/users/setname'
var fullnameREG = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/ 
Page({
  data: {
    username:null,
    userInfo:null,
    fullname:null
  },

  getusername(e){
    let that = this
    let uname = e.detail.value
    that.setData({
      username:uname
    })
  },
  formSubmit(e){
    let that = this
    let formValue = e.detail.value
    if (formValue.username === ""){
      wx.showModal({
        title: '提示',
        content: '请输入正确的姓名',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    if (!fullnameREG.test(formValue.username)){
      wx.showModal({
        title: '提示',
        content: '你输入的字符格式不符，请输入两至四个汉字',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#317df4"
      })
      return;
    }
    let data = {
      fullname: formValue.username,
      token:app.globalData.token
    }
    app.request({
      url: SETNAME, data: data,method:'post' ,success: function (res) {
        if (res.data.code === 0) {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            fullname: formValue.username
          })
          wx.navigateBack({
            delta: 1
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
    app.pageLoad({
      fun:function(){
        let fullname = options.fullname
        that.setData({
          userInfo: wx.getStorageSync('userInfo'),
          fullname: fullname,
          username: fullname
        })
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