var app = getApp()
Page({
  data: {
    searchVal:'',
    searchList: [],
    windowWidth:0
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      islogin: app.globalData.islogin
    })       
    let winW = wx.getStorageSync('systemInfo').windowWidth
    var searchData = wx.getStorageSync('searchData') || []
    app.pageLoad({
      fun:function(){   
        that.setData({
          windowWidth: winW
        })
        that.setData({
          searchList: searchData
        })
      }
    })
  },
  //搜索公共函数
  funSetstorage(that){
    var searchData = wx.getStorageSync('searchData') || []
    if (searchData.indexOf(that.data.searchVal) === -1) {
      searchData.unshift(that.data.searchVal)
      wx.setStorageSync('searchData', searchData)
      that.setData({
        searchList: searchData
      })
    }  
  },
  // 搜索按钮动作
  searchGoods(e){
    let that = this
    let localStorageValue = []
    if (that.data.searchVal != ''){
      that.funSetstorage(that)
    }else{
      
    }
    wx.navigateTo({
      url: '/pages/search/list?val=' + that.data.searchVal,
    })   
  },
  // 键盘确认动作
  bindconfirm(e) {
    let that = this
    let localStorageValue = []
    if (that.data.searchVal != '') {
      that.funSetstorage(that)
    } else {

    }
    wx.navigateTo({
      url: '/pages/search/list?val=' + that.data.searchVal,
    })   
  },
  // 清除动作
  clearStorage(e){
    let that = this
    wx.showModal({
      title: '溫馨提示',
      content: '确认删除搜索记录吗？',
      confirmText: '是的',
      confirmColor: '#317df4',
      success: function (res) {
        if (res.confirm) { 
          try {
            wx.setStorageSync('searchData', [])
            that.setData({
              searchList: []
            })
          } catch (e) {
            console.log(e)
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  setStorage(e){

  },
  changeInput(e){    
    this.setData({
      searchVal:e.detail.value
    })
  },
  onReady: function () {
    let that = this
  },
  onShow: function () {
    let that = this
    var searchData = wx.getStorageSync('searchData') || []
    that.setData({
      searchList: searchData
    })
  },
  onShareAppMessage: function () {

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