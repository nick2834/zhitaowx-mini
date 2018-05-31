App({
  data: {
    start: false,
    invite: {
      uid: 0, //邀请人UID
      active: '', //动作来源
      gid: 0, //商品ID
    },
    inviteuid: 0,
    clipboardvalue: "", //剪贴板内容
    pageFunction: function () { },
    path: "",
    query: ""
  },
  onLaunch: function (options) {
    let that = this
    this.data.path = options.path;
    this.data.query = options.query;
    try {
      if (!options.query.inviteuid) {
        this.data.invite = wx.getStorageSync('invite');
      }
      //更新分享来源信息
      if (options.query.inviteuid) {
        this.data.invite.uid = options.query.inviteuid;
      }
      if (options.query.active) {
        this.data.invite.active = options.query.active;
      }
      if (options.query.gid) {
        this.data.invite.gid = options.query.gid;
      }
      //缓存分享来源信息
      if (this.data.invite.uid) {
        wx.setStorage({
          key: "invite",
          data: this.data.invite
        })
        console.log(this.data.invite);
      }
    } catch (e) { };
    //获取小程序默认配置
     this.setShareConfig();
    //获取设备信息
    this.getSystemInfo()
    //登陆
    this.login();
    //监听剪贴板
    this.clipboard();
  },
  onShow: function (options) {
    if (this.globalData.token == null && this.data.start == true) {
      this.login();
    }
    this.data.start = true;
  },
  //用户登陆
  login: function () {
    var that = this;
    //获取用户信息
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            method: 'post',
            url: that.globalData.serviceUrl + 'api/login/wxlogin',
            data: {
              appid: that.globalData.appid,
              inviteuid: that.data.invite.uid,
              code: res.code
            },
            success: function (res) {
              if (res.data.code == 0) {
                var token = res.data.result.data.token
                that.globalData.token = token;
                if (res.data.result.data.uid > 0) {
                  that.globalData.identityCode = res.data.result.data.type
                  that.getUserCenter(token)
                  that.globalData.userid = res.data.result.data.uid   
                  that.globalData.islogin = true; 
                }
                try {
                  wx.setStorageSync('token', token);
                } catch (e) {

                }
                //临时用户，弹出登陆授权窗口，并获取信息
                if (res.data.result.data.status == -1) {
                  that.data.pageFunction();
                  //that.getUserInfo(token);
                } else {
                  that.data.pageFunction();
                }
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              }
            },
            fail: function (res) {
              setInterval(function () {
                this.login();
              }, 1000);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //获取用户信息
  getUserInfo: function (token) {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        //发起网络请求
        wx.request({
          method: 'post',
          url: that.globalData.serviceUrl + 'api/login/wxuserinfo',
          data: {
            token: token,
            rawData: res.rawData,
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: function (res) {
            if (res.data.code == 0) {
              that.globalData.token = res.data.result.data.token;
              that.globalData.userid = res.data.result.data.uid;
              that.data.pageFunction();
              wx.setStorageSync('token', res.data.result.data.token);
            }
          }
        });
      },
      fail: function (res) {
        console.log('登陆授权失败');
      }
    })
  },
  getUserCenter(token) {
    let that = this
    wx.request({
      url: that.globalData.serviceUrl + 'api/users/index',
      data: { token: token },
      success: function (res) {
        if (res.data.code == 0) {
          var userInfo = res.data.result.data
          var uid = res.data.result.data.uid
          try {
            that.globalData.userInfo = userInfo;
            that.globalData.identityCode = userInfo.type;
            that.globalData.uid = uid;
            wx.setStorageSync('userInfo', userInfo);
          } catch (e) {
            console.log(e)
          }
        }
      }
    }) 
  },
  //监听剪贴板内容
  clipboard: function () {
    var that = this;
    setInterval(function () { 
      try {
        if (!that.globalData.config.system.goods_button){
          // console.log(that.globalData.config.system.goods_button)
          return
        }else{
          wx.getClipboardData({
            success: function (res) {
              if (res.data.length > 12) {
                if (res.data.indexOf('【淘宝-口令】') >= 0) return;
                if (res.data.indexOf('【口令】') >= 0) return;
                if (res.data.indexOf('【小程序-复制】') >= 0) return;
                if (res.data.indexOf('zhitao') >= 0) return;
                if (that.data.clipboardvalue != res.data) {
                  that.data.clipboardvalue = res.data;
                  var keyword = res.data;
                  if (that.data.clipboardvalue.indexOf("【我剁手都要买的宝贝（") > -1) {
                    var str = that.data.clipboardvalue.match(/【我剁手都要买的宝贝（(.*?)）/);
                    keyword = str[1];
                  }
                  if (that.data.clipboardvalue.indexOf("复制这条信息") > -1) {
                    var str = that.data.clipboardvalue.match(/【(.*?)】/);
                    keyword = str[1];
                  }
                  console.log(that.globalData)
                  wx.showModal({
                    content: '您确定搜索商品“' + keyword + '”吗？',
                    confirmText: '立即搜索',
                    confirmColor: "#317EF3",
                    success: function (res) {
                      if (res.confirm) {
                        var searchData = wx.getStorageSync('searchData') || []
                        if (searchData.indexOf(keyword) === -1) {
                          searchData.unshift(keyword)
                          wx.setStorageSync('searchData', searchData)
                          that.globalData.searchData = searchData
                        }        
                        wx.navigateTo({
                          url: "/pages/search/list?keyword=" + keyword
                        })
                      }
                      wx.setClipboardData({
                        data: '',
                        success: function (res) {
                          that.data.clipboardvalue = "";
                        }
                      })
                    }
                  })
                }
              }
            }
          })
        }
      } catch (e) {
      }
    }, 1000);
  },
  //获取小程序系统配置
  setShareConfig: function () {
    var that = this;
      wx.request({
        url: that.globalData.serviceUrl + 'api/config/index',
        data: {
          version: this.globalData.version
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.globalData.config = res.data.result;
            that.globalData.systemIsFlag = true
            //仅测试使用
            // that.globalData.config.system.goods_button = true
            //仅测试使用
            that.globalData.timestamp = res.data.result.timestamp;
          }
        },
        fail: function (e) {
          setInterval(function () {
            this.setShareConfig();
          }, 2000);
        }
      })
  },
  //设置默认分享
  ShareAppMessage: function () {
    var that = this;
    return {
      title: this.globalData.config.share.invite.title.replace("[会员昵称]", this.globalData.userInfo ? this.globalData.userInfo.nickname : ""),
      path: this.globalData.config.share.invite.path + '?active=invite&inviteuid=' + this.globalData.userid,
      imageUrl: this.globalData.config.share.invite.imageUrl,
      success: function (res) {
        that.ShareReport('invite', that.globalData.config.share.invite.path);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //上报分享日志
  ShareReport: function (active = "invite", page = "", gid = 0) {
    wx.request({
      url: this.globalData.serviceUrl + 'api/report/share',
      method: "POST",
      data: {
        encypt: this.globalData.encypt,
        page: page,
        active: active,
        gid: gid
      },
      success: function (res) {
        console.log('上报分享日志成功');
      }
    })
  },
  //封装Page页面onLoad执行函数（作用：防止用户登陆结果在Page页面onLoad之后返回，操成加载数据失败）
  pageLoad: function ({ fun = function () { } }) {
    if (this.globalData.token && this.globalData.islogin) {
      fun();
    } else {
      this.data.pageFunction = fun;
    }
  },

  getSystemInfo() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res
        wx.setStorageSync('systemInfo', res)
        if (res.model.indexOf('iPhone X') === 0) {
          that.globalData.isIpx = true
        }
      },
    })
  },
  //封装发起网络请求函数
  request: function ({ url, data = [], dataType, method = "GET", header, success, fail, complete }) {
    if (!header) {
      header = { 'content-type': 'application/json' };
    }
    if (!success) {
      success = function (res) { };
    }
    if (!fail) {
      fail = function () {
        if (wx.hideLoading) wx.hideLoading();
        wx.showToast({
          title: '网络连接超时',
          icon: 'loading',
          duration: 25000
        })
      };
    }
    if (!complete) {
      complete = function (res) { };
    }
    try {
      var token = this.globalData.token;
      if (token) {
        data.token = token
      } else {
        data.token = wx.getStorageSync('token');
      }
    } catch (e) {
      //this.login();
    }
    data.version = this.globalData.version;
    data.appid = this.globalData.appid;
    var requestTask = wx.request({
      url: this.globalData.serviceUrl + url,
      header: header,
      method: method,
      data: data,
      success: success,
      fail: fail,
      complete: complete
    })
    return requestTask;
  },
  //loading提示
  showLoading(title = "请稍后", duration = 5000) {
    wx.showToast({
      title: title,
      icon: 'loading',
      duration: (duration <= 0) ? 5000 : duration
    });
  },
  //显示带取消按钮的消息提示框
  alertViewWithCancel(title = "提示", content = "消息提示", confirm, showCancel = "true") {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success: function (res) {
        if (res.confirm) {
          confirm();
        }
      }
    });
  },
  //不显示取消按钮的消息提示框
  alertView(title = "提示", content = "消息提示", confirm) {
    this.alertViewWithCancel(title, content, confirm, false);
  },
  globalData: {
    //小程序ID
    appid: 'wxcf89f5cb7edf3e12',
    //小程序版本号
    version: 'v1.0.2',
    //时间戳,由后端生成，用于更新图片缓存
    timestamp: 1513239616,
    //小程序系统配置
    config: {
      system:{
        "goods_button": false,
      },
      timestamp:1525856009
    },
    //腾讯位置解析密钥
    key_map: '2ABBZ-AD4KW-37MRE-O4JCR-3TPQE-KXFNP',
    //用户UID
    userid: 0,
    //用户信息
    userInfo: null,
    //用户登陆认证encypt
    encypt: null,
    //服务器URL
    serviceUrl: "https://api.wxrwin.com/",
    //用户登陆认证token
    token: null,
    // 判断是否是iphone X
    isIpx: false,
    // 搜索记录
    searchData: [],
    //用户身份
    identityCode: -1,
    //图片库地址
    falsePic:null,
    //系统设置
    systemInfo:null,
    //是否加载完毕
    systemIsFlag:false,
    //是否已登录
    islogin:false,
  }
})