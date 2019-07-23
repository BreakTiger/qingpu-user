import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({


  data: {
    id: '',
    card: [],
    code: '',
    powerlist: []
  },


  onLoad: function(options) {
    let that = this
    let id = options.data
    console.log(id)
    that.setData({
      id: id
    })
    that.detail()

    that.power()

  },

  // 会员卡详情
  detail: function() {
    let that = this
    let id = that.data.id
    console.log(id)
    let url = app.globalData.api + 'api/card/list'
    let data = {
      id: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          let list = res.data.data.cardList
          let picture = res.data.data.qr_path
          that.setData({
            card: list,
            code: picture
          })
        }
      })
  },

  power: function() {
    let that = this
    let url = app.globalData.api + 'api/card/right/list'
    let data = {
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          let list = res.data.data.right
          that.setData({
            powerlist:list
          })
        }
      })
  }



})