import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({

  data: {
    list: []
  },

  onLoad: function(options) {
    let that = this
    // 获取经纬度查询附近门店
    wx.getLocation({
      success: function(res) {
        let longitude = res.longitude
        let latitude = res.latitude
        console.log(longitude, latitude)
        let url = app.globalData.api + "api/store/storeList"
        let data = {
          lat: latitude,
          lon: longitude,
          openId: wx.getStorageSync('openid')
        }
        modals.loading()
        request.sendRequest(url, 'get', data, {})
          .then(function(res) {
            modals.loaded()
            console.log(res.data.data.storeList)
            let storeList = res.data.data.storeList
            that.setData({
              list: storeList
            })
          }, function(err) {
            console.log(err);
          });
      },
    })

  },

  //  选择门店，获取地址
  choice: function(e) {
    let data = e.currentTarget.dataset.item
    console.log(data)

    // 设置缓存
    wx.setStorageSync('send', data)

    // 跳转
    wx.redirectTo({
      url: '/pages/index/makesure/makesure'
    })
    

  },

  onShow: function() {

  },

})