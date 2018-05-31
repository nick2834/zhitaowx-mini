const CATEGORY = 'api/goods/category'
const LIST = 'api/goods/lists'
const GUIDELIST = 'api/Novice/index'
const DYNAMIC = 'api/dynamic/index'
const USERCENTER = 'api/users/index'
const USERSUM = 'api/novice/usersum'
const app = getApp()
Page({
  data: {
    userInfo: {},
    currentTab: 0, //预设当前项的值
    isBind: false,
    tabbarFix: false,
    guideList: [],
    scrollTop: 0,
    categoryID: 2,
    categoryList: [],
    goodsList: [],
    dynamicList: [],
    pagesize: 10,
    page: 1,
    lastPage: 0,
    identityCode: -1,
    sortId: 1,
    IslastPage: false,
    flag: false,
    goods_button: false,//是否显示底部导航,新手指引
    minHeight:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    islogin: -1,
    isFlag: false,
    isLoading:false
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
            identityCode: -1
          })
        }
      }
    })
  },
  //滚动广告
  getDynamic() {
    let that = this
    app.request({
      url: DYNAMIC,success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            dynamicList: res.data.result
          })
        }
      }
    })
  },
  //tab栏
  getCategory() {
    let that = this
    app.request({
      url: CATEGORY, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            categoryList: res.data.result.data
          })
        }
      }
    })
  },
  //商品
  getGoodsList(data) {
    wx.showNavigationBarLoading()
    let that = this
    if (that.data.flag) return;
    that.setData({
      flag: true
    })
    app.request({
      url: LIST, data: data, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            goodsList: res.data.result.data,
            page: res.data.result.current_page,
            lastPage: res.data.result.last_page,
            IslastPage: false,
            flag: false,
          })
        }
        that.setData({
          flag: false
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  //指引
  getGuide() {
    let that = this
    app.request({
      url: GUIDELIST, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            guideList: res.data.result
          })
        }
      }
    })
  },
  bindgetuserinfo(res){
    let that = this
    let resultData = res.detail
    if (resultData.errMsg == "getUserInfo:fail auth deny"){
      //授权失败
    }else{
      //授权成功
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
            app.globalData.userid = res.data.result.data.uid;
            app.globalData.identityCode = res.data.result.data.type;
            app.data.pageFunction();
            app.globalData.islogin = true;
            that.setData({
              islogin: true
            })            
          }
        }
      });
    }
  },
  onLoad: function (options){
    let that = this; 
    let data = {
      cid: 1,
      pagesize: that.data.pagesize,
      page: that.data.page
    }
    that.getCategory()
    that.getGoodsList(data)
    that.getGuide()
    that.getDynamic()    
    wx.request({
      url: app.globalData.serviceUrl + 'api/config/index',
      data: {
        version: app.globalData.version
      },
      success: function (res) {
        app.globalData.config = res.data.result;
        that.setData({
          goods_button: res.data.result.system.goods_button,
          identityCode: app.globalData.identityCode
        })
        setTimeout(() =>{
          that.setData({
            isFlag: true
          },2000)
        })
        that.init();
      },
      complete:function(res){
        setTimeout(() => {
          that.setData({
            isLoading: true
          })
        }, 1000)
      }
    })
  },
  init(){
    let that = this 
    app.pageLoad({
      fun: function () {        
        that.setData({
          islogin: app.globalData.islogin
        })       
        that.check_identity()
        that.setData({
          minHeight: app.globalData.systemInfo.windowHeight,
          identityCode: app.globalData.identityCode
        })
        wx.showShareMenu({
          withShareTicket: true
        })
      }
    })
  },
  onShow(){
    if(this.data.isindex){
      this.setData({
        islogin: app.globalData.islogin
      }) 
    }else{
      this.setData({
        isindex: true
      }) 
    }     
    this.setData({
      scrollTop: 0,
      goods_button: app.globalData.config.system.goods_button,
      identityCode: app.globalData.identityCode
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let that = this
    let sortId = e.target.dataset.sortid
    let data = {
      cid: sortId,
      pagesize: 10,
      page: 1
    }
    that.getGoodsList(data)
    that.setData({
      tabbarFix: true,
      isBind: true,
      sortId: sortId,
      scrollTop:136
    })
    var cur = e.target.dataset.current;
    if (that.data.currentTaB == cur) { return false; }
    else {
      that.setData({
        currentTab: cur
      })
    }
  },
  onShareAppMessage(res) {
    return app.ShareAppMessage();
  },
  //上拉刷新
  upper(e) { 
    let that = this
    that.getUserInfo()
    wx.stopPullDownRefresh()
  },
  //下拉加载
  lower(e) {
    let that = this
    if (that.data.flag) return;
    if (that.data.IslastPage) return;
    that.setData({
      flag: true
    })
    var page = ++that.data.page;
    let data = {
      cid: that.data.sortId,
      pagesize: 10,
      page: page
    }
    app.showLoading()
    app.request({
      url: LIST, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          var IslastPage = false;
          if (page >= res.data.result.last_page)
            IslastPage = true;
          that.setData({
            goodsList: that.data.goodsList.concat(res.data.result.data),
            page: res.data.result.current_page,
            lastPage: res.data.result.last_page,
            IslastPage: IslastPage,
            flag: false
          })
        }
        that.setData({
          flag: false
        })
      }
    })
  },
  //滚动监听
  scroll(e) {
    let that = this
    let scrollTop = e.detail.scrollTop
    if (scrollTop > 92) {
      that.setData({
        isBind: true
      })
      if (scrollTop > 395) {
        that.setData({
          tabbarFix: true,
          isBind: true
        })
      }
    } else {
      that.setData({
        isBind: false,
        tabbarFix: false
      })
    }
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
  }
})
