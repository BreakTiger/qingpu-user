const app = getApp();
import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')

Page({
  data: {
    userinfo: '', //授权的用户信息
    phoneinfo: '' //授权的用户手机号
  },

  onLoad: function(options) {},

  //用户确定授权
  confirm: function(e) {
    console.log(e)
    let that = this
    // 获取用户信息
    let userinfo = JSON.parse(e.detail.rawData)
    console.log(userinfo)
    wx.setStorageSync('user', userinfo)
    // 数据更新
    that.setData({
      userinfo: userinfo
    })
    // if (that.data.phoneinfo == '') {
    //   wx.showToast({
    //     title: '手机号也需要授权哦',
    //   })
    // }
    that.login()
  },

  //手机号授权
  // getphone: function(e) {
  //   let that = this
  //   console.log(e.detail, '这是手机号码')
  //   that.setData({
  //     phoneinfo: e.detail
  //   })
  //   if (that.data.userinfo == '') {
  //     wx.showToast({
  //       title: '请先确定授权',
  //     })
  //   }
  //   that.login()
  // },

  // 登录
  login: function() {
    let userinfo = this.data.userinfo
    let phoneinfo = this.data.phoneinfo
    let code = wx.getStorageSync('code')
    if (userinfo && code) {
      let url = app.globalData.api + "api/auth/login"
      let data = {
        wxCode: code,
        nickname: userinfo.nickName,
        avatar: userinfo.avatarUrl,
        encryptedData: phoneinfo.encryptedData,
        iv: phoneinfo.iv
      }
      request.sendRequest(url, 'post', data, { //数据返回到后台
          "Content-Type": "application/x-www-form-urlencoded"
        })
        .then(function(res) {
          console.log(res.data.data.openId)
          let openid = res.data.data.openId
          wx.setStorageSync('openid', openid) // 设置缓存
          // 设置openid
          app.globalData.openid = openid
          // 提示授权成功
          modals.showToast('授权成功')
          // 授权成功后跳转
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 2000)
        })
    }
  },

  //返回首页
  back: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onShow: function() {}
})