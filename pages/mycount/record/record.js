var app = getApp()
const EXTRACTLIST = 'api/withdrawals/lists'
Page({
  data: {
    recordList:[],
    page: 1,
    total_pages: 0,
    current_page: 0
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    })      
    that.setData({
      token: app.globalData.token
    })
    let data = {
      token: that.data.token,
      page: that.data.page,
    }
    that.getList(data)
  },
  getList(data){
    let that = this
    app.showLoading()
    app.request({
      url: EXTRACTLIST, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          console.log(res.data.result.data)
          that.setData({
            recordList: res.data.result.data,
            total_pages: res.data.result.total,
            current_page: res.data.result.current_page
          })
        }
      }
    })
  },
  upper(e) { },
  loadMore(e) { 
    let that = this
    if ((that.data.current_page === that.data.total_pages)) {
      return
    }
    let data = {
      token: that.data.token,
      page: that.data.page++,
    }
    app.showLoading()
    app.request({
      url: EXTRACTLIST, data: data, method: 'post', success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          that.setData({
            recordList: that.data.recordList.concat(res.data.result.data),
            total_pages: res.data.result.total,
            current_page: res.data.result.current_page
          })
        }
      }
    })
  },
  scroll(e) { },
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