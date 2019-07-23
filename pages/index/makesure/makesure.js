import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()


Page({
  data: {
    kdway: [{
        name: '快递',
        id: 1
      },
      {
        name: '到店自取',
        id: 2
      }
    ],
    payway: [{
        pay: '微信',
        img: '/imgs/index/wx.png',
        id: 2
      },
      {
        pay: '积分',
        img: '/imgs/index/jf.png',
        id: 1
      }
    ],
    aomunt: '',
    payway: [{
        pay: '微信',
        img: '/imgs/index/wx.png',
        id: 2
      },
      {
        pay: '积分',
        img: '/imgs/index/jf.png',
        id: 1
      }
    ], //支付方式
    selsetway: 0, //选择配送窗口的状态
    windstatus: 1, //支付方式窗口的状态
    selsetpayway: 0, //支付方式的状态
    address: '', //收货人地址
    phone: '', //收获人电话
    name: '', //收货人名字
    payid: '2', //支付方式的判别ID
    getid: '1', //收获方式的判别ID
    allinfo: '', //所有信息
    imgArr: '', //
    getname: '快递', //默认的配送方式
    addimg: '/imgs/index/add.png', //默认的打印图片（实际不会打印）
    shopaddress: '', // 门店地址
    storeid: '', // 门店ID
    hasWatermark: ''

  },

  onLoad: function(options) {
    let that = this
    let info = wx.getStorageSync('goodsinfo')
    console.log(info)
    let aomunt = info.price * info.quantity * 1000 / 1000
    let hasWatermark = info.hasWatermark
    that.setData({
      allinfo: info,
      aomunt: aomunt,
      hasWatermark: hasWatermark
    })
    let kdid = that.data.allinfo.sendid
    console.log(kdid)
    // 判断
    if (kdid == 1) {
      let send = wx.getStorageSync('send')
      console.log(send)
      that.setData({
        selsetway: 1,
        shopaddress: send.address,
        getname: '到店自取',
        storeid: send.id,
        getid: 2
      })
    }

    let adress = wx.getStorageSync('address')
    if (!adress) {
      this.changeadds()
    } else {
      that.setData({
        address: adress.ads,
        name: adress.username,
        phone: adress.phone
      })
    }
  },

  // 选择配送
  selectway: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let getid = e.currentTarget.dataset.id
    let getname = e.currentTarget.dataset.name
    console.log('index',index,'getid',getid,'getname',getname)
    that.setData({
      selsetway: index,
      getid: getid,
      windstatus: 1,
      getname: getname
    })
    console.log(getid)

    if(getid==1){
      let _info = wx.getStorageSync('goodsinfo')
      console.log('更新前：', _info)
      _info.sendid = 2
      wx.setStorageSync('goodsinfo', _info)
      let data = wx.getStorageSync('goodsinfo')
      console.log('更新后：', data)
    }else if(getid==2){
      let _info = wx.getStorageSync('goodsinfo')
      console.log('更新前：', _info)
      _info.sendid = 1
      wx.setStorageSync('goodsinfo', _info)
      let data = wx.getStorageSync('goodsinfo')
      console.log('更新后：', data)
    }
  },

  // 弹窗中的关闭按钮
  close: function() {
    let that = this
    let windstatus = that.data.windstatus
    if (windstatus == 1) {
      that.setData({
        windstatus: 2
      })
    } else if (windstatus == 2 || windstatus == 3) {
      that.setData({
        windstatus: 1
      })
    }
  },

  // 选择支付方式
  selectpayway: function(e) {
    let index = e.currentTarget.dataset.index
    let payid = e.currentTarget.dataset.id
    this.setData({
      selsetpayway: index,
      payid: payid
    })
  },

  // 图片上传
  scimg: function() {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        console.log(tempFilePaths[0])
        that.setData({
          addimg: tempFilePaths[0]
        })

        // 上传图片的方法，调用其接口路径
        wx.uploadFile({
          url: app.globalData.api + "api/trade/upload",
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {

          },
          success: function(res) {
            console.log(res.data)
            let result = JSON.parse(res.data)
            // console.log(result)
            let path = result.data.path
            // console.log(path)
            that.setData({
              addimg: path
            })

          },
          fail: function(res) {
            console.log(res)
          }
        })
      },
    })
  },

  // 提交订单
  paybtn: function() {
    let that = this
    let windstatus = that.data.windstatus
    if (windstatus == 1) {
      that.setData({
        windstatus: 3
      })
    } else {
      that.setData({
        windstatus: 1
      })
    }
  },

  // 确定
  suborder: function() {
    let that = this
    let name = that.data.name
    let picture = that.data.addimg
    let hasWatermark = that.data.hasWatermark
    console.log(name, picture, hasWatermark)
    // 判断
    if (name == '') {
      modals.showToast('收货信息不能为空', 'none')
    } else if (hasWatermark == 1 && picture == '/imgs/index/add.png') {
      modals.showToast('请上传图片', 'none')
    } else {
      that.creation()
    }
  },

  // 创建订单
  creation: function() {
    let that = this
    let payid = that.data.payid //支付方式
    let allinfo = that.data.allinfo // 商品数据
    let getid = that.data.getid //配送方式  1为快递  2为自取
    let name = that.data.name //收货人姓名
    let phone = that.data.phone //收货电话
    let adss = that.data.address //收货地址
    let storeid = that.data.storeid //门店ID
    let picture = that.data.addimg //上传的打印图片

    let url = app.globalData.api + 'api/trade'
    let data = {
      productOptionValueId: allinfo.id,
      quantity: allinfo.quantity,
      shippingName: name,
      shippingPhone: phone,
      shippingAddress: adss,
      paymentType: payid,
      shippingType: getid,
      storeId: storeid,
      watermark: picture,
      openId: wx.getStorageSync('openid')
    }
    console.log('请求参数：', data)
    modals.loading()
    request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(function(res) {
        modals.loaded()
        console.log(res)
        let code = res.data.code
        let id = res.data.data.tradeId
        if (code == 0) {
          let timeStamp = res.data.data.timeStamp
          if (timeStamp) {
            let json = res.data.data
            console.log('json', json)
            that.wxpay(json)
          } else {
            if (res.data.code == 2002) {
              modals.showToast('积分不足', 'loading')
              wx.redirectTo({
                url: '/pages/mine/orderdetail/orderdetail?id=' + id
              })
            } else {
              modals.showToast('积分支付成功', 'success')
              setTimeout(function() {
                wx.redirectTo({
                  url: '/pages/mine/orderdetail/orderdetail?id=' + id
                })
              }, 1500)
            }
          }
        }
      }).catch((err)=>{
        console.log('',err)
        wx.showToast({
          title: '支付失败',
        })
      })

  },

  // 微信支付
  wxpay: function(json) {
    let id = json.tradeId
    console.log('id', id)
    wx.requestPayment({
      'appId': json.appId,
      'timeStamp': json.timeStamp,
      'nonceStr': json.nonceStr,
      'package': json.package,
      'signType': 'MD5',
      'paySign': json.paySign,
      // 成功显示
      'success': function(res) {
        wx.showToast({
          title: '支付成功',
        })
        //成功后,跳转至商品详情
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/mine/orderdetail/orderdetail?id=' + id,
          })

        }, 1500)
      },
      // 失败显示
      'fail': function(res) {
        console.log(res)
        modals.showToast('支付失败', 'loading')
        //失败后跳转回首页
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/mine/orderdetail/orderdetail?id=' + id,
          })
        }, 1500)
      },
    })
  },

  // 门店自取
  selfget: function() {
    wx.redirectTo({
      url: '/pages/index/selectstore/selectstore',
    })
  },

  //选择收货地址
  changeadds: function() {
    let that = this
    let getid = that.data.getid
    console.log(getid)
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
        let username = res.userName
        let phone = res.telNumber
        // 地址
        let arr = []
        arr.push(res.provinceName)
        arr.push(res.cityName)
        arr.push(res.countyName)
        arr.push(res.detailInfo)
        let adss = arr.join(',')
        console.log('地址', adss)

        that.setData({
          address: adss,
          name: username,
          phone: phone
        })

        let data = {
          username: username,
          phone: phone,
          ads: adss
        }
        console.log('data', data)
        // 设置缓存
        wx.setStorageSync('address', data)

      }
    })
  },



})