var app = getApp()
const DETAILS = 'api/Novice/info'
const PLAYNUMS = 'api/Novice/addplayback'
Page({
  data: {
    itemlist:{},
    otherList: [],
    windowHeight:"",
    guideList: [],
    itemType:'video',
    flag:true,
    isVideo:true,
    id:0,
    isShare:false
  },
  getDetails(data){
    let that = this
    app.showLoading()
    app.request({
      url: DETAILS, data: data, method:'post', success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          let thisOne = res.data.result.one[0]
          that.setData({
            guideList: res.data.result.list,
            itemlist: thisOne,
            itemType: thisOne.type
          })
          if (thisOne.type === 'image'){
            that.setData({
              flag:false
            })
          }else{
            that.setData({
              flag: true,
              isVideo:false
            })
          }
          //动态设置标题
          wx.setNavigationBarTitle({
            title: thisOne.title
          })
        }
      }
    })
  },
  getPlayList(data){
    app.request({
      url: PLAYNUMS, data: data,success: function (res) {
        if (res.data.code === 0) {
          console.log('播放次数+1')
        }
      }
    })
  },
  onLoad: function (options) {
    let id = options.id
    let systemInfo = app.globalData.systemInfo
    let that = this;
    if(options.active){
      that.setData({
        isShare: true
      })
    }
    that.setData({
      islogin: app.globalData.islogin
    })      
    app.pageLoad({
      fun:function(){
        let data = { id: id }
        let winH = systemInfo.windowHeight
        let winW = systemInfo.windowWidth
        that.getDetails(data)
        that.getPlayList(data)
        that.setData({
          id:id,
          windowHeight: winH
        })
      }
    })
    

  },
  // 点击切换信息
  handleChange(e){
    let that = this
    let id = e.currentTarget.dataset.idx
    wx.navigateTo({
      url: '/pages/guide/guide?id='+id,
    })
  },
  onShareAppMessage(res){
    return {
      title: this.data.itemlist.title,
      path: '/pages/guide/guide?id=' + this.data.id + '&active=invite&inviteuid=' + app.globalData.userid
    }
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