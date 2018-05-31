const wxCharts = require('../../utils/wxcharts-min.js'); // 引入wx-charts.js文件
var app = getApp()
const USERCENTER = 'api/users/index'
const SPACE = 'api/space/index'
const EARNING = 'api/space/earning'
const EXPAND = 'api/space/expand'
var windowWidth = 320;
var month = new Date().getMonth();
var newMonthArray = []
var monthArray=['1月榜单 01.01-01.31',
  '2月榜单 02.01-02.28',
  '3月榜单 03.01-03.31',
  '4月榜单 04.01-04.30',
  '5月榜单 05.01-05.31',
  '6月榜单 06.01-06.30',
  '7月榜单 07.01-07.31',
  '8月榜单 08.01-08.31',
  '9月榜单 09.01-09.30',
  '10月榜单 10.01-10.31',
  '11月榜单 11.01-11.30',
  '12月榜单 12.01-12.31',
]
for (let i in monthArray) {
  if (i < month) {
    newMonthArray.push(monthArray[i])
  }
  // if (i < month + 1) {
  //   newMonthArray.push(monthArray[i])
  // }
} 
try {
  var res = wx.getSystemInfoSync();
  windowWidth = 150;
} catch (e) {
  console.error('getSystemInfoSync failed!');
}
var centerChart = null;
Page({
  data: {
    userInfo:{},
    curHdIndex: 1,
    curBdIndex: 0,
    tabdefault: 1,
    monthArray: newMonthArray,
    showModal:false,
    windowHeight: 0,
    windowWidth:0,
    index:1,
    targetIndex:1,
    expendList:{},
    percent: 0,
    datas:0,
    expending:{},
    listItem:[],
    earnListItem:[],
    thisMonth:"",
    meExpend:[],
    isME:{},
    scrollTop: 0,
    islogin: false,
    isLoading: false,
    identityCode: -1
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
        }
      }
    })
  },
  ringCharts(percent, all, minus, width) {
    centerChart = new wxCharts({
      animation: false,
      canvasId: 'canvas1',
      type: 'ring',
      extra: {
        ringWidth: 8,
        pie: {
          offsetAngle: -90
        }
      },
      title: {
        name: '剩余市场空间',
        color: '#fff',
        fontSize: 10
      },
      subtitle: {
        name: percent,
        color: '#fff',
        fontSize: 20
      },
      series: [
        {
          name: "已完成",
          // data: minus,
          data: 99.9,
          color: '#ffffff'
        },
        {
          name: "未完成",
          // data: all,
          data: 0.1,
          color: '#366ec1'
        }
      ],
      disablePieStroke: true,
      width: width,
      height: 150,
      dataLabel: false,
      legend: false,
      background: '#317EF3'
    });
  },
  getSpace(data) { 
    let that = this
    let all,percent,minus
    app.request({
      url: SPACE, data: data, success: function (res) {
        if (res.data.code === 0) {
          let data = res.data.result
          data.map(item => {
            if (item.type === 3) {
              all = item.percentage
              percent = item.percentage + '%'
              minus = (100 - item.percentage).toFixed(2)
              that.setData({
                expendList: item,
                percent: percent,
                minus: minus,
                all: all
              })
            }
          })
          that.ringCharts(percent, all, minus, windowWidth)
        }
      },
      complete: function (res) {
        setTimeout(() => {
          that.setData({
            isLoading: true
          })
        }, 1000)
      }
    })
  },
  getEarning(data) { 
    let that = this
    let listItem = []
    wx.showNavigationBarLoading()
    app.request({
      url: EARNING, data: data, method: 'post', success: function (res) {
        if (res.data.code === 0) {
          let list = res.data.result.list
          for (let i in list) {
            listItem.push(list[i])
          }
          that.setData({
            earningList: res.data.result,
            earnListItem: listItem,
            isME:res.data.result.me,
            index: month - 1
          })
        }
      },
      complete: function (res) {
        wx.hideNavigationBarLoading()
      }
    })
  },
  getExpend(data){
    let that = this
    let listItem = []
    wx.showNavigationBarLoading()
    app.request({
      url: EXPAND, data: data, method: 'post', success: function (res) {
        
        if (res.data.code === 0) {
          let list = res.data.result.list
          for (let i in list) {
            listItem.push(list[i])
          }
          that.setData({
            expending: res.data.result,
            listItem: listItem,
            meExpend: res.data.result.me
          })
        }
      },
      complete:function(res){
        wx.hideNavigationBarLoading()
      }
    })
  },
  onLoad: function (options) {
    let that = this;
    let newMonthArray = []
    let systemInfo = app.globalData.systemInfo
    that.setData({
      islogin: app.globalData.islogin,
      goods_button: app.globalData.config.system.goods_button,
      identityCode: app.globalData.identityCode
    })   
    let winH = systemInfo.windowHeight
    let winW = systemInfo.windowWidth
    that.setData({
      windowHeight: winH - winW / 750 * (405),
      windowWidth: winW,
      thisMonth: that.data.monthArray[month - 1]
    }) 
    let data = { uid: app.globalData.userid, date: month - 1 }
    that.getSpace(data)
    that.getEarning(data)
    that.getExpend(data)
    app.pageLoad({
      fun:function(){    
        that.check_identity()     
        that.getUserInfo()
      }
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
  },
  onShow: function () {
    let that = this
    let data = {}
    that.setData({
      islogin: app.globalData.islogin
    })      
    that.getSpace(data)
    that.setData({
      scrollTop: 0
    })
  },
  getTabs(e){
    if(this.data.tabdefault == 1){
      this.setData({
        tabdefault: 0
      })
    }
    var dataId = e.currentTarget.id;
    var obj = {};
    obj.curHdIndex = dataId;
    obj.curBdIndex = dataId;
    this.setData({
      tabArr: obj
    })
  },
  HandlerTouch(e) {
  },
  bindPickerChange(e){
    let that = this
    let targetId = e.detail.value
    let data = { uid: app.globalData.userid, date: Number(targetId) + 1 }
    that.getEarning(data)
    that.getExpend(data)
    that.setData({
      thisMonth: that.data.monthArray[targetId]
    })
  },
  upper() { },
  lower() { },
  scroll(){},
  onShareAppMessage(res) {
    return app.ShareAppMessage();
  },
  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      let data = { uid: app.globalData.userid, date: month - 1 }
      that.getSpace(data)
      that.getEarning(data)
      that.getExpend(data)
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
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