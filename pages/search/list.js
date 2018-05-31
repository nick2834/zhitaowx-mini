const SEARCH = 'api/search'
var app = getApp()
Page({
  data: {
    windowHeight:0,
    windowWidth:0,
    currentTab:0,
    searchResult:[1],
    residuNums:49,
    searchname:'',
    sortActive2: false,
    sortActive3:false,
    sortPrice:3,
    sortSale:5,
    sortNO:0,
    searchList:[],
    page:1,
    total_pages: 0,
    current_page: 0,
    userInfo:null,
    placeholder:true,
    coupon:false, //默认显示是否只搜索优惠券商品
    searchFlag:false
  },
  getList(data){
    let that = this;
    if (that.data.searchFlag) return;
    that.setData({
      searchFlag: true
    }) 
    app.showLoading()
    app.request({
      url: SEARCH, data: data, method: 'post', success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          let list = res.data.result.data
          that.setData({
            searchList: list,
            total_pages: res.data.result.total_page,
            current_page: res.data.result.current_page,
            placeholder: true,
            searchFlag: true
          })
        } else {
          that.setData({
            searchList: [],
            placeholder: false
          })
        }
        that.setData({
          searchFlag: false
        })
      }
    })
  },
  onLoad: function (options) {
    let that = this;
    let winH = wx.getStorageSync('systemInfo').windowHeight
    let winW = wx.getStorageSync('systemInfo').windowWidth
    that.setData({
      windowHeight: winH - winW / 750 * (151),
      userInfo: app.globalData.userInfo,
      windowWidth: winW,
      islogin: app.globalData.islogin
    })     
    let name = options.name
    let keyword = options.keyword
    let searchVal = options.val
    if (name) {
      that.setData({
        searchname: name
      })
    }
    if (keyword) {
      that.setData({
        searchname: keyword
      })
    }
    if (searchVal) {
      that.setData({
        searchname: searchVal
      })
    }
    let data = {
      keyword: that.data.searchname,
      sort: that.data.sortNO,
      page: that.data.page,
      coupon: that.data.coupon
    }
    that.getList(data)
  },
  switchChange(e) {
    let val = e.detail.value
    let that = this
    that.setData({
      coupon: val
    })
    if (that.data.searchname) {
      let data = {
        keyword: that.data.searchname,
        sort: that.data.sortNO,
        page: that.data.page,
        coupon: val
      }
      that.getList(data)
    }
  },
  swichTab(e){
    var that = this;
    var sortNO = e.target.dataset.current
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        page:1
      })
    }  
    var sortNums = 1
    switch (sortNO){
      case "0":
        sortNums = 1
        break;
      case "1":
        sortNums = 2
        break;
      case "2":
        sortNums = 3
        break;
      case "3":
        sortNums = 5
        break;
      default:
        sortNums = 1
    }
    that.setData({
      sortNO: sortNums
    })
    let data = {
      keyword: that.data.searchname,
      sort: sortNums,
      page: that.data.page,
      coupon: that.data.coupon
    }
    that.getList(data)
  },
  bindconfirm(e){
    let that = this
    if (that.data.searchname != '') {
      var searchData = wx.getStorageSync('searchData') || []
      if (searchData.indexOf(that.data.searchname) === -1) {
        searchData.unshift(that.data.searchname)
        wx.setStorageSync('searchData', searchData)
      } 
    } else {

    } 
    let data = {
      keyword: that.data.searchname,
      sort: that.data.sortSale,
      page: that.data.page,
      coupon: false
    }
    that.getList(data)
  },
  bindInput(e){
    this.setData({
      searchname: e.detail.value
    })
  },
  sortList1(e) {
    let that = this
    let sortNO = 4
    that.setData({
      sortActive2: !that.data.sortActive2,
      page: 1,
      currentTab:2
    })
    if (that.data.sortActive2) {
      that.setData({
        sortSale: 4,
        sortNO: 4
      })
    } else {
      that.setData({
        sortSale: 3,
        sortNO: 3
      })
    }
    let data = {
      keyword: that.data.searchname,
      sort: that.data.sortNO,
      page: that.data.page,
      coupon: that.data.coupon
    }
    that.getList(data)
   },
  sortList2(e){
    let that = this
    let sortNO = 5
    that.setData({
      sortActive3: !that.data.sortActive3,
      page:1,
      currentTab:3
    })
    if (that.data.sortActive3){
      that.setData({
        sortSale: 5,
        sortNO: 5
      })
    }else{
      that.setData({
        sortSale: 6,
        sortNO: 6
      })
    }
    let data = {
      keyword: that.data.searchname,
      sort: that.data.sortNO,
      page: that.data.page,
      coupon: that.data.coupon
    }
    that.getList(data)
  },
  searchBtn(e){
    let that = this
    if (that.data.searchname != '') {
      var searchData = wx.getStorageSync('searchData') || []
      if (searchData.indexOf(that.data.searchname) === -1) {
        searchData.unshift(that.data.searchname)
        wx.setStorageSync('searchData', searchData)
      }
    } else {

    } 
    let data = {
      keyword: that.data.searchname,
      sort: that.data.sortNO,
      page: 1,
      coupon: that.data.coupon
    }
    that.getList(data)
  },
  upper(e) { },
  scroll(e) { },
  loadMore(e){
    let that = this
    if (that.data.searchFlag) return;
    that.setData({
      searchFlag: true
    })
    if (that.data.current_page == that.data.total_pages) {
      wx.showToast({
        title: '已经是最后一条啦=^_^=',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      app.showLoading()
      let data = {
        keyword: that.data.searchname,
        sort: that.data.sortNO,
        page: that.data.page++,
        coupon: that.data.coupon
      }
      app.request({
        url: SEARCH, data: data, method: 'post', success: function (res) {
          wx.hideToast()
          if (res.data.code === 0) {
            let list = res.data.result.data
            that.setData({
              searchList: that.data.searchList.concat(res.data.result.data),
              total_pages: res.data.result.total_page,
              current_page: res.data.result.current_page,
              placeholder: true,
              searchFlag: true
            })
          } else {
            that.setData({
              searchList: [],
              placeholder: false
            })
          }
          that.setData({
            searchFlag: false
          })
        }
      })
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