import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()


Page({


  data: {
    cardinfolist: []
  },


  onLoad: function(options) {
    let that = this
    let url = app.globalData.api + 'api/card/list'
    let data = {
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function (res) {
        console.log(res.data.data)
        let list = res.data.data.cardList
        that.setData({
          cardinfolist: list
        })
      })
  },

  // 进入会员卡详情页面
  onCardInfo: function(e) {
    let data = e.currentTarget.dataset.item.id
    console.log(data)
    let url = '/pages/mine/members-detail/members-detail?data='
    modals.navigate(url, data)
  },

  // 继续激活
  AddTap: function() {
    wx.redirectTo({
      url: '/pages/mine/members/members',
    })
  }


})