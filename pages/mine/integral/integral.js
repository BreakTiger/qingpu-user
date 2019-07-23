import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: [],
    page: 0,
    totalPoint: '',
    pageN: 2, //分页
    pageSize: 10,
    pageTottomText: '',
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


  onLoad: function(options) {
    let that = this

    // 获取分页页数 
    let num = that.data.page
    let page = parseInt(num) + 1
    // 获取分页数量
    let page_size = that.data.page_size
    // 获取接口路径
    let url = app.globalData.api + "api/point/pointList"

    // 返回数据
    let data = {
      page: page,
      page_size: 10,
      openId: wx.getStorageSync('openid')
    }
    console.log('请求数据：', data)
    modals.loading()
    // 返回数据到后台
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log('返回数据：', res)
        let pointList = res.data.data.pointList
        let totalPoint = res.data.data.totalPoint
        that.setData({
          record: pointList,
          totalPoint: totalPoint
        })
      })
  },
  
  onReachBottom: function() {
    let that = this
    this.setData({
      pageTottomText: ''
    });
    let pageN = this.data.pageN;
    console.log('pageN', pageN)
    that.setData({
      pageTottomText: getApp().globalData.addText,
    });
    let url = app.globalData.api + "api/point/pointList"
    let data = {
      openId: wx.getStorageSync('openid'),
      page: pageN,
      size: 10
    }
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        console.log('分页', res.data.data)
        let result = res.data.data.pointList
        if (result.length != 0) {
          pageN += 1;
          that.setData({
            pageN: pageN
          })
          setTimeout(function () {
            let item = that.data.record.concat(result)
            that.setData({
              record: item
            });
            console.log('pageN', pageN, '地区分页', item)
          }, 1000);
        } else {
          that.setData({
            pageTottomText: getApp().globalData.endText,
          });
        }
      }, function (err) {
        console.log(err);
      });
  }

})