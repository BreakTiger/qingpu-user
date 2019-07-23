import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchlist: [],
    word: '',
    em: 0
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  // 获取输入框中文字
  inputword: function(e) {
    this.setData({
      word: e.detail.value
    })
  },

  // 搜索
  onBtnTap: function() {
    let that = this
    //获取搜索关键字
    let search = that.data.word
    // 获取状态
    let em = that.data.em
    // console.log(em)
    // 获取路径
    let url = app.globalData.api + "api/product/productList"
    // 返回数据
    let data = {
      search: search,
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    //返回到后台
    request.sendRequest(url, 'get', data, {})
      .then(function(res) { //后台反馈的数据
        modals.loaded()
        console.log(res)
        let result = res.data.data.productList
        console.log(result)
        //更新数据
        that.setData({
          searchlist: result
        })
        // 判断：在更新数据后，searchlist是否还是为空，即等于零 如等于0 em+1
        let after = that.data.searchlist // 获取更新后的数据
        console.log('after', after)
        if (after.length == 0) {
          that.setData({
            em: 1
          })
        }
      }, function(err) {
        console.log(err);
      });
  },

  //收藏功能
  onLikeTap: function(e) {
    let that = this
    console.log(e.currentTarget.dataset.item.id)
    // 获取收藏物品的信息,并筛选出ID
    let id = e.currentTarget.dataset.item.id
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
        that.onBtnTap();
      })
  },

  // 进入详情页面
  detail: function(e) {
    let data = e.currentTarget.dataset.item.id
    console.log(data)
    let url = '/pages/index/detail/detail?id='
    modals.navigate(url, data)
  }
})