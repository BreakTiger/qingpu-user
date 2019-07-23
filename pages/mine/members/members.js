import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()


Page({


  data: {
    powerlist: [],
    phone: '',
    code: '',
    gettime: false,
    counts: 60
  },


  onLoad: function(options) {
    let that = this
    that.power()

  },

  // 权益列表
  power: function() {
    let that = this
    let url = app.globalData.api + "api/card/right/list"
    let data = {
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        let list = res.data.data.right
        if (code == 0) {
          that.setData({
            powerlist: list
          })
        }
      })
  },

  // 获取输入的手机号
  getphone: function(e) {
    let that = this
    let phone = e.detail.value
    // console.log('phone.leng',phone.length)
    // 判断
    if (phone.length == 11) {
      if ((/^1[34578]\d{9}$/.test(phone))) {
        that.setData({
          phone: phone
        })
        console.log('phone',that.data.phone)
      }
    }
  },

  // 发送验证码，并获取
  onSendTap: function() {
    let that = this
    let phone = that.data.phone
    let url = app.globalData.api + 'api/card/sms/code'
    let data = {
      phone: phone,
      openId: wx.getStorageSync('openid')
    }
    console.log('请求数据：',data)
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let code = res.data.code
        if (code == 0) {
          that.countdown()
        } else if (code == 1) {
          modals.showToast('手机号有误')
        } else if (code == 3000) {
          modals.showToast('您暂未获得会员资格,请点击下方如何成为会员了解详情!','none')
        } else if (code == 3001) {
          modals.showToast('您已是菁莆会员,请勿重复激活!','none')
        }
      })
  },

  // 60s倒计时
  countdown: function() {
    let that = this
    that.setData({
      gettime: true
    })
    var getsix = setInterval(function() {
      let times = that.data.counts - 1
      that.setData({
        counts: times
      });
      if (that.data.counts < 1) {
        clearInterval(getsix)
        that.setData({
          gettime: false,
          counts: 60
        });
      }
    }, 1000)

  },

  // 输入的验证码
  yanzhnum: function(e) {
    let that = this
    let yanzmun = e.detail.value;
    console.log(yanzmun)
    that.setData({
      code: yanzmun
    })
  },

  // 立即激活
  tosubmit: function(e) {
    let that = this
    let phone = that.data.phone
    let codes = that.data.code
    console.log('phone:',phone,'codes:',codes)
    if (phone == '' && codes==''){
      modals.showToast('请填写信息')
    }else{
      let url = app.globalData.api + 'api/card/active'
      let data = {
        phone: phone,
        salt: codes,
        openId: wx.getStorageSync('openid')
      }
      console.log('请求数据：', data)
      request.sendRequest(url, 'post', data, {
        "Content-Type": "application/x-www-form-urlencoded"
      })
        .then(function (res) {
          console.log(res)
          let code = res.data.code
          if (code == 0) {
            wx.redirectTo({
              url: '/pages/mine/members-list/members-list',
            })
          } else {
            modals.showToast('验证码有误')
          }
        })
    }
  },

  // 进入激活条件页面
  onRequireTap: function() {
    let url = '/pages/mine/card/card'
    modals.navigate(url)
  }

})