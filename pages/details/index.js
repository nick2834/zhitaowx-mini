var app = getApp()
const TAOBAOKE = 'api/tbk/convert'
const DETAILS = 'api/goods/details'
const INFO = 'api/goods/info'
const USERCENTER = 'api/users/index'
var coupon_info
Page({
  data: {
    windowHeight:0,
    hasCard:true,
    shopDetails:{},
    goodsDetails:[],
    userInfo:{},
    titles:'',
    isIpx:app.globalData.isIpx ? true : false,
    coupon:false,
    infoDetails:{},
    item_id:0,
    coupon_amount:0,
    identityCode:-1,
    state:0, //状态，0转链中，1=转链成功，2=转链失败
    goods_button:false,  //是否显示底部导航
    imgList:[],
    isFirstIn: false
  },
  previewImage(e){
    let that = this
    var current = e.currentTarget.dataset.src;
    that.data.imgList.push(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: that.data.imgList // 需要预览的图片http链接列表  
    })
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
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    })      
    // app.pageLoad({
    //   fun:function(){
        that.check_identity()
        try {
          that.setData({
            goods_button: app.globalData.config.system.goods_button
          })
        } catch (e) {
        }        
        let item_id = options.item_id
        let item_coupon = options.item_coupon
        let amountId = options.coupon_id || null
        let amount = options.coupon_amount || null
        //优惠券信息
        coupon_info = options.coupon_info
        if (item_coupon === "[object Object]" && amount > 0) {
          that.setData({
            coupon: true
          })
        } else { that.setData({ coupon: false }) }
        let winH = wx.getStorageSync('systemInfo').windowHeight;
        let winW = wx.getStorageSync('systemInfo').windowWidth;
        that.setData({
          windowHeight: winH,
          token: app.globalData.token,
          userInfo: app.globalData.userInfo,
          titles: options.item_title,
          item_id: item_id,
          coupon_amount: options.coupon_amount,
          item_coupon: item_coupon,
          identityCode: app.globalData.identityCode
        })
        wx.setNavigationBarTitle({
          title: options.item_title,
        })
        var data = { item_id: item_id }
        that.getShareDetails(data, amount, amountId)
    //   }
    // })
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
  getDetails(data) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      state: 0
    })    
    app.request({
      url: TAOBAOKE, data: data,method:'post', success: function (res) {
        wx.hideLoading()
        if (res.data.code === 0) {
          var gid = res.data.result.item_id
          var details = res.data.result
          details['commissions'] = (details.upgrade_subsidy + details.subsidy).toFixed(2)
          details['after_price'] = (details.item_price - details.coupon_amount).toFixed(2)
          if (details.coupon_amount > 0){
            details['coupon_info'] = coupon_info
          }
          that.setData({
            state:1,
            shopDetails: res.data.result,
            coupon: details.coupon_amount > 0 ? true : false
          })
        }else{
          that.setData({
            state: 2,
          })          
        }
      },fail:function(err){
        console.log(err)
      }
    })
  },
  getImageDetails(datas){
    let that = this
    //app.showLoading()
    app.request({
      url: DETAILS, data: datas, success: function (res) {
        //wx.hideToast()
        if (res.data.code === 0) {
          let temp = res.data.result.data
          that.setData({
            goodsDetails: temp
          })
        }
      }
    })
  },
  clickPaste(e){
    let taotoken = e.currentTarget.dataset.id
    wx.setClipboardData({
      data: taotoken + '【小程序-复制】',
      success: function (res) {
        wx.showModal({
          title: '温馨提示',
          content: '淘口令复制成功,打开[手机淘宝]即可[领取优惠券]并购买,收货后佣金到智淘提现',
          showCancel: false,
          confirmText: "知道了",
          confirmColor: "#317df4"
        })
      }
    })
  },
  getShareDetails(data,amount,amountId){
    let that = this
    //app.showLoading()
    app.request({
      url: INFO, data: data, success: function (res) {
        //wx.hideToast()
        if (res.data.code === 0) {
          var gid = res.data.result.data.item_id
          var datas = { gid: gid }
          var data = {
            coupon_amount: amount || null,
            coupon_id: amountId || null,
            item_id: res.data.result.data.item_id,
            item_pic: res.data.result.data.item_pic,
            item_price: res.data.result.data.item_price,
            item_title: res.data.result.data.item_title
          }
          that.getDetails(data)
          that.setData({
            infoDetails: res.data.result.data
          })
          setTimeout(() => {
            that.getImageDetails(datas)
          }, 1000)
        }
      }
    })
  },
  upper(e) { 
    
  },
  lower(e) {

  },
  loadImg(e) { 
  },
  //分享关健字替换
  share_replace: function (str) {
    str = str.replace("[商品标题]", this.data.titles);
    str = str.replace("[商品图片]", this.data.infoDetails.item_pic);
    str = str.replace("[商品价格]", this.data.infoDetails.item_price);
    str = str.replace("[商品优惠券]", this.data.shopDetails.coupon_amount);
    str = str.replace("[商品券后价]", this.data.shopDetails.after_price);
    return str;
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.share_replace(this.data.titles),
      path: '/pages/details/index?active=invite&inviteuid=' + app.globalData.userid + '&item_id=' + this.data.item_id + '&coupon_amount=' + this.data.coupon_amount + '&item_coupon=' + this.data.item_coupon,
      imageUrl: this.share_replace(this.data.infoDetails.item_pic),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow(){
    var that = this
    if (that.data.isFirstIn) {
      that.setData({
        isFirstIn: true
      })
      return
    } else {
      app.pageLoad({
        fun: function () {
          that.getUserInfo()
        }
      })
    }
  },
  //检测身份状态变化
  check_identity() {
    var that = this;
    setInterval(function () {
      if (app.globalData.userInfo != null) {
        if (app.globalData.identityCode != that.data.identityCode) {
          that.setData({
            identityCode: app.globalData.identityCode
          })
        }
      }
    }, 1000);
  }
})