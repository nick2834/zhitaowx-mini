let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
const ORDERS = 'api/orders'
Page({
  data: {
    tabs: ["所有", "未到账", "已到账", "交易关闭"],
    activeIndex: 0,
    scrolltop:0,
    sliderOffset: 0,
    sliderLeft: 0,
    scrollheight: 0,
    normal: false,
    checkId:0,
    page: 1,
    current_page: 0,
    orderList:[],
    flag:false,
    IslastPage: false
  },
  getOrders(data){
    let that = this
    app.showLoading()
    app.request({
      url: ORDERS, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          that.setData({
            orderList: res.data.result.data,
            current_page: res.data.result.current_page,
            flag: false,
            IslastPage: false
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
    if(options.data === 'null'){
      return
    }else{
      app.pageLoad({
        fun:function(){
          let windowHeight = wx.getStorageSync('systemInfo').windowHeight
          that.setData({
            scrollheight: windowHeight
          })
          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
              });
            }
          });
          that.setData({
            token: app.globalData.token
          })
          let data = {
            token: that.data.token,
            status: that.data.checkId,
            page: that.data.page
          }
          that.getOrders(data)
        }
      }) 
    }
  },
  tabClick: function (e) {
    let that = this
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      checkId: e.currentTarget.id,
      scrolltop: 0
    });
    let data = {
      status: that.data.checkId,
      page: 1
    }
    that.getOrders(data)
  },
  scroll(e) { },
  onReachBottom(e){
    let that = this
    if (that.data.flag || that.data.IslastPage) {
      return
    }else{
      that.setData({
        flag: true
      })
      var page = ++that.data.page;
      let data = {
        status: that.data.checkId,
        page: page
      }
      app.showLoading()
      app.request({
        url: ORDERS, data: data, success: function (res) {
          wx.hideToast()
          if (res.data.code === 0) {
            var IslastPage = false;
            if (page >= res.data.result.last_page)
              IslastPage = true;
            that.setData({
              orderList: that.data.orderList.concat(res.data.result.data),
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
    }   
  },
  refresh(e){

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
});