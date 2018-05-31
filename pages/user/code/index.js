const app = getApp()
const QRCODELIST = 'api/qrcode/items'
const POSTER = 'api/qrcode/poster'
var mtabW;
var touchDot = 0;//触摸时的原点
var time = 0;//  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = "";// 记录/清理 时间记录
var tmpFlag = true;// 判断左右华东超出菜单最大值时不再执行滑动事件
Page({
  data: {
    windowHeight: 0,
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    scrollLeft: 0,
    qrcodeList: [],
    token: [],
    code: '01',
    picUrl: [],
    touchCode: 1,
    posterArr: [],
    images:{}
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    that.setData({
      islogin: app.globalData.islogin
    })    
    app.pageLoad({
      fun:function(){
        wx.getSystemInfo({
          success: function (res) {
            mtabW = res.windowWidth / 8; //设置tab的宽度
            that.setData({
              tabW: mtabW,
              windowHeight: res.windowHeight
            })
          }
        });
        that.setData({
          token: app.globalData.token
        })
        let data = {code: that.data.code }
        that.getList()
        that.getPoster(data)
      }
    }) 
  },
  getList(data) {
    let that = this
    app.showLoading()
    app.request({
      url: QRCODELIST, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          that.setData({
            qrcodeList: res.data.result.data
          })
        }
      }
    })
  },
  getPoster(data) {
    let that = this
    app.showLoading()
    app.request({
      url: POSTER, data: data, success: function (res) {
        wx.hideToast()
        if (res.data.code === 0) {
          wx.hideToast()
          let posterArr = that.data.posterArr
          var o = new Object()
          o.codeId = data.code
          o.imgUrl = res.data.result.pic_url
          posterArr.push(o)
          that.setData({
            picUrl: [res.data.result.pic_url],
            posterArr: posterArr
          })
        }
      }
    })
  },
  ifElse(data) {
    let that = this
    if (JSON.stringify(that.data.posterArr[Number(data.code) - 1]) == undefined) {
      that.getPoster(data)
    } else {
      that.setData({
        picUrl: [that.data.posterArr[Number(data.code) - 1].imgUrl]
      })
    }
  },
  tabClick: function (e) {
    let that = this;
    let code = e.target.id
    let idIndex = e.currentTarget.id - 1;
    let offsetW = e.currentTarget.offsetLeft;
    let data = { token: that.data.token, code: code }
    if (that.data.activeIndex === idIndex) {
      return
    } else {
      that.ifElse(data)
      this.setData({
        activeIndex: idIndex,
        slideOffset: offsetW
      });
    }

  },
  bindChange: function (e) {
    var current = e.detail.current;
    if ((current + 1) % 4 == 0) {

    }
    var offsetW = current * mtabW; //2种方法获取距离文档左边有多少距离
    this.setData({
      activeIndex: current,
      slideOffset: offsetW
    });
  },
  saveImage(e){
    let that = this
    let picUrl = (this.data.picUrl).join('')
    wx.downloadFile({
      url:picUrl,
      success(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            app.showLoading()
            setTimeout(()=>{
              wx.hideToast()
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },2000)
          },
          fail: function (res) {
            if (res.errMsg === 'saveImageToPhotosAlbum:fail cancel'){
            }else{
              wx.showModal({
                title: '温馨提示',
                content: '您已关闭小程序访问相册权限',
                confirmText: '去打开',
                confirmColor: "#317EF3",
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({

                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })  
            }
          }
        }) 
      },
      fail(err){
        
      }
    })
  },
  //获取图片尺寸
  loadImage(e){
    let that = this
    var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;    //图片的真实宽高比例
    var viewHeight = (that.data.windowHeight-85)*0.9,    //计算的高度值 利用屏幕高度减去tab高度的90%作为高度基准
        viewWidth = (viewHeight* ratio).toFixed(2); //乘以图片缩放比
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },

  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function (e) {
    let that = this
    var touchMove = e.touches[0].pageX;
    let length = that.data.qrcodeList.length
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10) {
      if (tmpFlag) {
        let touchCode = that.data.touchCode
        tmpFlag = false;
        touchCode++
        that.setData({
          touchCode: touchCode++
        })
        if (touchCode > length + 1) {
          that.setData({
            touchCode: 1
          })
        }
        that.setData({
          activeIndex: that.data.touchCode - 1
        })
        let data = {
          token: that.data.token,
          code: '0' + that.data.touchCode
        }
        that.ifElse(data)
      }
    }
    // 向右滑动
    if (touchMove - touchDot >= 40 && time < 10) {
      if (tmpFlag) {
        let touchCode = that.data.touchCode
        tmpFlag = false;
        touchCode--
        that.setData({
          touchCode: touchCode--
        })
        that.setData({
          activeIndex: that.data.touchCode - 1
        })
        if (touchCode < 0) {
          that.setData({
            touchCode: length
          })
        }
        that.setData({
          activeIndex: that.data.touchCode - 1
        })
        let data = {
          token: that.data.token,
          code: '0' + that.data.touchCode
        }
        that.ifElse(data)
      }
    }
  },
  // 触摸结束事件
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true;
  },
  previewImage: function (e) {
    wx.previewImage({
      current: this.data.picUrl, // 当前显示图片的http链接     
      urls: this.data.picUrl // 需要预览的图片http链接列表     
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