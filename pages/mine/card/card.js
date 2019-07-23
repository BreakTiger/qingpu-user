import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tiaojian: []
  },

  
  onLoad: function(options) {
    let that = this 
    let url = app.globalData.api + 'api/card/vip/demand'
    let data = {
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url,'get',data,{})
    .then(function(res){
      console.log(res)
      let code = res.data.code
      if(code==0){
        let result = res.data.data.demand
        console.log(result)
        that.setData({
          tiaojian: result
        })
        let article = result.content
        WxParse.wxParse('article', 'html', article, that, 5)
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})