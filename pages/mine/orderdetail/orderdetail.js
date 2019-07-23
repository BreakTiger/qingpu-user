import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({

  data: {
    // status:3, //1已付款，2已发货，3交易完成，4交易取消
    allinfo: '',
    amount: '',
    windowstatus: 0,
    type: '',
    id: '',
    code: '',
    qrcode: ''
  },

  onLoad: function(options) {
    let that = this
    console.log(options)
    let id = options.id
    that.setData({
      id: id
    })
    that.order()
  },

  // 订单详情
  order: function() {
    let that = this
    let id = that.data.id
    let url = app.globalData.api + "api/trade/info"
    let data = {
      tradeId: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data.trade)
        let amount = res.data.data.trade.products[0].price * 1000 * res.data.data.trade.products[0].quantity / 1000
        that.setData({
          allinfo: res.data.data.trade,
          amount: amount
        })
      })
  },

  // 查看物流
  check: function(e) {
    let that = this
    let data = JSON.stringify(that.data.id)
    console.log(data)
    let url = '/pages/mine/carriage/carriage?data='
    modals.navigate(url, data)
  },

  //确定收货
  confirm: function() {
    let that = this
    let item = that.data.allinfo
    let url = app.globalData.api + "api/trade/confirmTrade"
    let data = {
      tradeId: item.id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        let code = res.data.code
        console.log(res.data.data)
        if (code == 0) {
          modals.showToast('收货成功', 'success')
          wx.redirectTo({
            url: '/pages/mine/order/order'
          })
        }


      })

  },

  // 取消订单
  cancelorder: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success: function(res) {
        if (res.confirm) {
          let item = that.data.allinfo
          let url = app.globalData.api + "api/trade/cancelTrade"
          let data = {
            tradeId: item.id,
            openId: wx.getStorageSync('openid')
          }
          modals.loading()
          request.sendRequest(url, 'get', data, {})
            .then(function(res) {
              modals.loaded()
              console.log(res)
              let code = res.data.code
              if (code == 0) {
                modals.showToast('订单取消成功', 'success')
                wx.redirectTo({
                  url: '/pages/mine/order/order?index=' + 0,
                })
              }
            })
        } else if (res.cancel) {

        }

      }
    })



  },

  // 继续支付
  pay: function() {
    let that = this
    let url1 = app.globalData.api + "api/trade/repay"
    let id = that.data.allinfo.id
    let data1 = {
      tradeId: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url1, 'get', data1, {})
      .then(function(res) {
        console.log(res.data.data)
        let result = res.data.data
        let timeStamp = result.timeStamp
        let total = result.total
        let aa = result.package
        let paySign = result.paySign
        let appId = result.appId
        let signType = result.signType
        let nonceStr = result.nonceStr
        let tradeId = result.tradeId

        // 调用微信支付的原生API方法
        wx.requestPayment({
          timeStamp: timeStamp,
          total: total,
          package: aa,
          paySign: paySign,
          appId: appId,
          signType: signType,
          nonceStr: nonceStr,
          tradeId: tradeId,
          success: function(res) {
            wx.showToast({
              title: '支付成功'
            })
            setTimeout(function() {
              let url = '/pages/mine/order/order'
              modals.navigate(url)
            }, 1100)
          },
          fail: function(res) {
            wx.showToast({
              title: '支付失败'
            })
          }
        })

      })
  },

  // 删除订单
  delet: function() {
    let that = this
    let item = that.data.allinfo
    let url = app.globalData.api + "api/trade/deleteTrade"
    let data = {
      tradeId: item.id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        let code = res.data.code
        if (code == 0) {
          modals.showToast('订单取消成功', 'success')
          wx.navigateTo({
            url: '/pages/mine/order/order',
          })
        }

      })
  },

  // 验证码+二维码
  coding: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    that.setData({
      windowstatus: 1,
      type: index
    })

    let id = that.data.id

    // 获取type
    let types = that.data.type
    console.log('type', types)

    let url = app.globalData.api + 'api/trade/pick/goods'

    let data = {
      tradeId: id,
      type: types,
      openId: wx.getStorageSync('openid')
    }

    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        if (types == 1) {
          let code = res.data.data.code
          that.setData({
            code: code
          })
        } else {
          let qrcode = res.data.data.qr_path
          that.setData({
            qrcode: qrcode
          })
        }

      })



  },

  // 关闭按钮
  closeTap: function() {
    this.setData({
      windowstatus: 0
    })
  }

})