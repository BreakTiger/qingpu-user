import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({

  data: {
    nav: [
      '全部',
      '待付款',
      '待制作',
      '待收货',
      '已完成',
      '已取消'
    ],
    list: '',
    activenav: 0,
    page: 1,
    page_size: 15,
    order: '',
    windowstatus: 0,
    type: '',
    code: '',
    qrcode: ''
  },

  onLoad: function(options) {
    let that = this
    // 进入订单页面第一次获取的index
    let index = options.index
    console.log(index)
    that.setData({
      activenav: index
    })
    that.askorder()
  },

  //切换导航栏 
  changenav: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log('上面导航', index)
    that.setData({
      activenav: index
    })
    that.askorder()
  },

  // 订单列表
  askorder: function() {
    let that = this
    let index = that.data.activenav
    console.log(index)
    let url = app.globalData.api + 'api/trade/list'
    let data = ''
    if (index == 0) {
      data = {
        openId: wx.getStorageSync('openid')
      }
    } else {
      let statusid = parseInt(index) - 1
      //  0待支付，1待制作，2待收货，3已完结，4已取消
      console.log(statusid)
      data = {
        status: statusid,
        openId: wx.getStorageSync('openid')
      }
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        that.setData({
          list: res.data.data.tradeList
        })
      })
  },

  // 取消订单 
  cancelorder: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.item)

    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success: function(res) {
        if (res.confirm) {
          //订单ID
          let id = e.currentTarget.dataset.item.id
          //接口路径
          let url = app.globalData.api + "api/trade/cancelTrade"
          // 返回的数据
          let data = {
            tradeId: id,
            openId: wx.getStorageSync('openid')
          }
          modals.loading()
          request.sendRequest(url, 'get', data, {})
            .then(function(res) {
              modals.loaded()
              console.log(res)
              let code = res.data.code
              if (code == 0) {
                that.askorder()
              }
            })
        } else if (res.cancel) {
          // that.askorder()
        }
      }
    })


  },

  //付款
  paybtn: function(e) {
    let that = this
    let id = e.currentTarget.dataset.item.id
    console.log('id', id)
    // 获取接口路径
    let url = app.globalData.api + 'api/trade/repay'
    let data = {
      tradeId: id,
      openId: wx.getStorageSync('openid')
    }
    console.log('请求参数', data)
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        let code = res.data.code
        let result = res.data.data
        if (code == 0) {
          let timeStamp = result.timeStamp
          let total = result.total
          let packages = result.package
          let paySign = result.paySign
          let appId = result.appId
          let signType = result.signType
          let nonceStr = result.nonceStr
          let tradeId = result.tradeId
          wx.requestPayment({
            timeStamp: timeStamp,
            total: total,
            package: packages,
            paySign: paySign,
            appId: appId,
            signType: signType,
            nonceStr: nonceStr,
            tradeId: tradeId,
            success: function(res) {
              modals.showToast('支付成功')
              that.askorder()
            },
            fail: function(res) {
              modals.showToast('支付失败')
            }
          })
        }
      })
  },

  // 删除订单
  delet: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.item)
    let item = e.currentTarget.dataset.item
    let url = app.globalData.api + "api/trade/deleteTrade"
    let data = {
      tradeId: item.id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        let code = res.data.code
        if (code == 0) {
          modals.showToast('订单删除成功', 'success')
          that.askorder()
        }
      })
  },

  //下拉刷新
  onPullDownRefresh: function() {
    console.log('下拉刷新1')
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  // 订单详情
  orderdetail: function(e) {
    let id = e.currentTarget.dataset.id
    console.log('订单id：', id)

    // let data = JSON.stringify(item)
    wx.navigateTo({
      url: '/pages/mine/orderdetail/orderdetail?id=' + id,
    })
  },

  //查看物流
  check: function(e) {
    let data = JSON.stringify(e.currentTarget.dataset.item.id)
    console.log('id', data)
    let url = '/pages/mine/carriage/carriage?data='
    modals.navigate(url, data)
  },

  // 分页 + 订单列表
  onReachBottom: function() {
    let that = this
    // console.log('sssssss')
    let index = this.data.activenav
    let url = app.globalData.api + "api/trade/list"
    let data = ''
    let num = that.data.page
    let page = parseInt(num) + 1
    console.log(page)
    that.setData({
      page: page
    })
    if (index == 0) {
      data = {
        openId: wx.getStorageSync('openid'),
        page: page,
        page_size: 15
      }
    } else {
      let status = parseInt(index) - 1
      console.log(status)
      data = {
        status: status,
        openId: wx.getStorageSync('openid'),
        page: page,
        page_size: 15
      }
    }
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        let list = that.data.list
        console.log('list', list)
        let result = res.data.data.tradeList
        for (let i = 0; i < result.length; i++) {
          list.push(result[i])
        }
        console.log(list, '现在的数组')
        that.setData({
          list: list
        })
      })
  },

  // 确认收货
  confirm: function(e) {
    let that = this
    let id = e.currentTarget.dataset.item.id
    console.log(id)
    let url = app.globalData.api + "api/trade/confirmTrade"
    let data = {
      tradeId: id,
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res.data.data)
        let index = that.data.activenav
        that.askorder(index)
        modals.showToast('收获成功', 'success')
      })
  },

  // 收货验证码 + 二维码
  code: function(e) {
    // 聚焦方法指针
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    // 更新窗口状态
    that.setData({
      windowstatus: 1,
      type: index
    })
    // 获取ID
    let id = e.currentTarget.dataset.item.id
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