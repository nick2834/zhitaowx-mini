const app = getApp()
const WXUSERINFO = 'api/login/wxuserinfo'
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 弹窗标题
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定授权'
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    islogin: false,
    firstIn:false
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    bindgetuserinfo(res){
      var that = this;
      let resultData = res.detail
      if (resultData.errMsg == "getUserInfo:fail auth deny") {
        //授权失败
      } else {
        that.setData({
          firstIn: true
        })
        wx.setStorageSync('firstIn', true)
        //发起网络请求
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
              app.globalData.token = res.data.result.data.token;
              app.globalData.userid = res.data.result.data.uid;
              app.globalData.identityCode = res.data.result.data.type;
              app.data.pageFunction();
              wx.setStorageSync('token', res.data.result.data.token);
              app.globalData.islogin = true;
              that.setData({
                islogin: true
              })
            }
          }
        });
      }
    },
    //隐藏弹框
    hideDialog() {
      this.setData({
        islogin: true
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        islogin: false
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }
  }
})