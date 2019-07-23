import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({


  data: {
    goodsinfo: [],
    infos: [],
    status:'',
    em:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // 获取ID值
    let id = JSON.parse(options.data)
    console.log(id)

    //接口路径
    let url = app.globalData.api + 'api/trade/shipping/info'

    let data = {
      tradeId: id,
      openId: wx.getStorageSync('openid')
    }

    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        let info = JSON.parse(res.data.data.info)
        that.setData({
          goodsinfo: res.data.data.trade,
          infos: info.Traces,
          status: info.State,
          em: info.Reason
        })

        console.log(info.State)

        
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