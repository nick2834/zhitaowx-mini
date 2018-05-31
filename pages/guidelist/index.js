var app = getApp()
const LISTS = 'api/Novice/lists'
const ADDSHARE = 'api/Novice/addshare'
Page({
  data: {
    guideList:[],
    sharesNum:0,
    userInfo:{},
    showToast:false
  },
  getList(data){
    let that = this
    app.request({
      url: LISTS, data: data, success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            guideList: res.data.result
          })
        }
      }
    })
  },
  getShares(data){
    let that = this
    app.request({
      url: ADDSHARE, data: data, success: function (res) {
        if (res.data.code === 0) {
          let data = {}
          that.getList(data)
        }
      }
    })
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    })      
    let data = {}
    that.getList(data)
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },
  shareBtn(e){
    let that = this
    let id = e.target.dataset.id
    let data = {id:id}
    that.getShares(data)
  },
  onShareAppMessage: function () {
    return {
      title: '智淘助手新手指引？',
      path: '/pages/guidelist/index?active=invite&inviteuid=' + app.globalData.userid
    }
  },
  showToast(e){
    let that = this
    that.setData({
      showToast:true
    })
  },
  closeToast(e){
    let that = this
    that.setData({
      showToast: false
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