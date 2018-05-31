import wxCharts from '../../utils/wxcharts-min.js'
const USERCENTER = 'api/users/index'
const SVIPCARD = 'api/svip/index'
const TWODAYS = 'api/svip/twodays'
const USERNUM = 'api/svip/usersnum'
const STATISTICSMONEY = 'api/svip/statisticsmoney'
const STATISTICCUSTOMER = 'api/svip/statisticcustomer'
var app = getApp();
let lineChart = null;
let chart = null;
let columnChart = null;
let windowWidth = wx.getSystemInfoSync().windowWidth;
Page({
  data: {
    flag: true,
    selected: true,
    selected1: false,
    windowWidth: windowWidth,
    userInfo: null,
    identityCode: -1,
    headInfo:{},
    todaysInfo:{},
    usersNums:{},
    customeList:{},
    category:[],
    categoryDate:[],
    series:[],
    iDCard:0,
    isFirstIn:true,
    goods_button: false,
    islogin:-1,
    isLoading: false
  },
  bindgetuserinfo(res) {
    let that = this
    let resultData = res.detail
    if (resultData.errMsg == "getUserInfo:fail auth deny") {
      //授权失败
    } else {
      //授权成功
      wx.request({
        method: 'post',
        url: app.globalData.serviceUrl + 'api/login/wxuserinfo',
        data: {
          token: app.globalData.token,
          rawData: res.detail.rawData,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        success: function (res) {
          if (res.data.code == 0) {
            app.globalData.identityCode = res.data.result.data.type;
            app.globalData.userid = res.data.result.data.uid;
            app.data.pageFunction();
            wx.setStorageSync('token', res.data.result.data.token);
          }
        }
      });
    }
  },
  //头部
  getCard(data){
    let that = this
    app.request({
      url: SVIPCARD, data: data,method:'post',
      success: function (res) {
        let data2 = {
          type: 'today',
          uid: data.uid
        } 
        if (res.data.code === 0) {
          let datas = {
            uid: app.globalData.userid,
            type: 'today'
          }
          that.getToday(datas)
          let type = res.data.result.data.type
          let date = res.data.result.data.svip_end_time
          if (type == 2) {
            that.getUserNums(data)
          } else if (type >= 3) {
            that.getUserNums(data)
            that.getInnerList(data)
            that.getCustomers(data)
          }
          let IDnumbers = res.data.result.data.number  
          var iDCard = IDnumbers.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
          that.setData({
            headInfo: res.data.result.data,
            identityCode: app.globalData.identityCode,
            iDCard: iDCard
          })
        }
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
  //今日昨日数据
  getToday(data) {
    let that = this
    app.request({
      url: TWODAYS, data: data,method:'post', success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            todaysInfo: res.data.result.data
          })
        }
      }
    })
  },
  //客户数
  getUserNums(data){
    let that = this
    app.request({
      url: USERNUM, data: data, method: 'post', success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            usersNums: res.data.result.data
          })
        }
      }
    })
  },
  //收入统计接口
  getInnerList(data){
    let that = this
    let dateList = []
    let shoppingList = []
    let recommendList = []
    app.request({
      url: STATISTICSMONEY, data: data,method:'post' ,success: function (res) {
        if (res.data.code === 0) {
          let list = res.data.result.data
          for (let i in list) {
            dateList.unshift(i)
            shoppingList.unshift(list[i].shopping)
            recommendList.unshift(list[i].recommend)
          }
          let category = [
            {
              name: '商品分佣',
              type: 'bar',
              stack: '收入统计',
              data: shoppingList
            }, {
              name: '推荐奖励',
              type: 'bar',
              stack: '收入统计',
              data: recommendList
            }
          ]
          that.setData({
            category: category,
            categoryDate: dateList
          })
          that.columnInitChart(category, dateList, windowWidth)
        }
      }
    })
  },
  //收入统计报表
  columnInitChart(cate,date,width) {
    columnChart = new wxCharts({
      canvasId: 'incomesCanvas',
      type: 'column',
      animation: false,
      categories: date,
      series: cate,
      yAxis: {
        format: function (val) {
          return val;
        },
        min:0
      },
      width: width,
      height: 200,
      legend: true,
      dataLabel: true, 
      extra:{
        column: {
          width: 10 
        }
      }
    });
  },
  //客户统计接口
  getCustomers(data) {
    let that = this
    let dateList = []
    let kehuList = []
    let vipList = []
    let svipList = []
    let series = []
    app.request({
      url: STATISTICCUSTOMER, data: data, method:'post',success: function (res) {
        let data = res.data.result.data
        if (res.data.code === 0) {
          for (let i in data) {
            dateList.unshift(i)
            kehuList.unshift(data[i].kehu)
            vipList.unshift(data[i].vip)
            svipList.unshift(data[i].svip)
          }
          series = [
            {
              name: '客户新增',
              type: 'line',
              stack: '总量',
              data: kehuList
            },
            {
              name: 'VIP新增',
              type: 'line',
              stack: '总量',
              data: vipList
            },
            {
              name: 'SVIP新增',
              type: 'line',
              stack: '总量',
              data: svipList
            }
          ]
          that.setData({
            series: series,
            lineDate: dateList
          })
          that.lineInitChart(dateList, series, windowWidth)
        }
      }
    })
  },
  //客户统计报表
  lineInitChart(date,series, width) {
    lineChart = new wxCharts({
      canvasId: 'customsCanvas',
      type: 'line',
      categories: date,
      animation: false,
      background: '#fff',
      title: {
        text: '折线图堆叠'
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        min:0,
        type: 'value'
      },
      series: series,
      width: width,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'straight'
      }
    });
  },
  //报表点击动作
  touchHandler: function (e) {
    lineChart.showToolTip(e, {})
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      islogin: app.globalData.islogin,
      goods_button: app.globalData.config.system.goods_button,
    }) 
    let data = { uid: app.globalData.userid }
    that.getCard(data)  
    app.pageLoad({
      fun:function(){
        that.check_identity()
        try {
          that.setData({
            userInfo :app.globalData.userInfo,
            uid: app.globalData.userid,
            identityCode: app.globalData.identityCode
          })
        } catch (e) {
        }         
        let data = { uid: app.globalData.userid }
        that.getCard(data)
      }
    })
  },
  checkDetails(){
    this.setData({ flag: false })
  },
  // 遮罩层显示  
  show: function () {
    this.setData({ flag: false })
  },
  // 遮罩层隐藏  
  conceal: function () {
    this.setData({ flag: true })
  },  
  // 保持不关闭隐藏层  
  baochi: function () {
    this.setData({ flag: false })
  }, 
  addsvip:function(){
    wx.showToast({
      title: '已加入SVIP',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },
  //今日
  selected: function (e) {
    let that = this 
    let data = {
      uid: that.data.uid,
      type: 'today'
    }
    that.setData({
      selected1: false,
      selected: true
    })
    that.getToday(data)
  },
  //昨日
  selected1: function (e) {
    let that = this
    let data = {
      uid: that.data.uid,
      type: 'yesterday'
    }
    this.setData({
      selected: false,
      selected1: true
    })
    that.getToday(data)
  },
  onReady: function () {
    let that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onShow: function () {
    let that = this
    that.setData({
      islogin: app.globalData.islogin,
      identityCode: app.globalData.identityCode
    })  
    if (that.data.isFirstIn) {
      that.setData({
        isFirstIn:false
      })
    } else {
      app.pageLoad({
        fun: function () {
          let data = { uid: app.globalData.userid }
          that.getCard(data)
          that.check_identity()
        }
      })
    } 
  },
  onHide: function () {
    // 页面跳出隐藏
    this.setData({ flag: true })
  },
  onShareAppMessage(res) {
    return app.ShareAppMessage();
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
  },
  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      let data = { uid: app.globalData.userid }
      that.getCard(data)
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
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