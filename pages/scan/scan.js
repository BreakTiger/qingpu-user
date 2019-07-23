import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app = getApp()
Page({


  data: {},

  onLoad: function(options) {
    if (!wx.getStorageSync('openid')) {
      let url = '/pages/login/login'
      modals.navigate(url)
    }

  },

  scanTap: function() {
    let that = this
    wx.scanCode({
      complete: (res) => {
        // console.log(res)
        let result = res.result
        console.log(result)
        wx.request({
          url: result,
          data:{
            openId: wx.getStorageSync('openid')
          },
          success:function(res){
            console.log(res)
            let code = res.data.code
            if(code==0){
              let id = res.data.data.product.id
              console.log(id)
              let url = '/pages/index/detail/detail?id='
              modals.navigate(url,id)
            }
          }
        })

      }
    })
  },

  onShow: function() {

  },

  onShareAppMessage: function() {}

})