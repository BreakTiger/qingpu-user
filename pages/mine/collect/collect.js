import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({
  data: {
    collection: []
  },


  // 初步加载页面数据
  onLoad: function(options) {
    let that = this
    that.thatDetail();
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

  // 收藏列表
  thatDetail() {
    // 聚焦方法指针
    let that = this
    //获取接口路径
    let url = app.globalData.api + "api/product/productList"
    //返回数据
    let data = {
      collect: 'collect',
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    // 将数据以get请求的传输方式，经过相应的接口路径送至后台
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        let code = res.data.code
        console.log(code, res.data.data)
        let lists = res.data.data.productList
        // 将数据进行绑定更新
        that.setData({
          collection: lists
        })

      }, function(err) {
        console.log(err);
      });
  },




  // 一键清除失效收藏
  clear: function() {
    let that = this
    //获取路径
    let url = app.globalData.api + "api/user/cleanInvalidCollection"
    //返回数据
    let data = {
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    //将数据通过获取的路径返回到后台
    request.sendRequest(url, 'get', data, {})
      .then(function(res) { // 得到后台给的返回回来的数据
        modals.loaded()
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          that.thatDetail()
        } else {
          modals.showToast('无失效藏品')
        }
      }, function(err) {
        console.log(err);
      });
  },

  // 移除收藏，删除
  onRemoveTap: function(e) {
    let that = this
    console.log(e.currentTarget.dataset)
    // 获取收藏物品的信息,并筛选出ID
    let id = e.currentTarget.dataset.item.id
    let status = e.currentTarget.dataset.item.status
    console.log("status", status)
    // 获取接口路径
    let url = app.globalData.api + "api/product/collect"
    // 返回数据
    let data1 = {
      productId: id,
      openId: wx.getStorageSync('openid')
    }
    // 将数据通过相对于的传输模式的路劲，发送到后台
    request.sendRequest(url, 'get', data1, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          if (status == 1) {
            that.thatDetail()
          } else {
            modals.showToast('该商品已被下架或删除')
            that.thatDetail()
          }
        }
      })

  },

  // 进入详情页面
  goodsTap: function(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    let url = '/pages/index/detail/detail?id='
    modals.navigate(url, id)
  }

})