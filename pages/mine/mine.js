import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app = getApp()

Page({
  data: {
    users: app.globalData.userinfo,
    navlist: [{
        icon: '/imgs/mine/icon2.png',
        title: '待付款'
      },
      {
        icon: '/imgs/mine/icon1.png',
        title: '待制作'
      },
      {
        icon: '/imgs/mine/icon4.png',
        title: '待收货'
      },
      {
        icon: '/imgs/mine/icon3.png',
        title: '已完成'
      },
      {
        icon: '/imgs/mine/icon5.png',
        title: '已取消'
      }
    ],
    operation: [{
        icon: '/imgs/mine/picture2.png',
        title: '我的会员卡'
      },
      {
        icon: '/imgs/mine/picture4.png',
        title: '收藏'
      },
      {
        icon: '/imgs/mine/picture3.png',
        title: '我的积分'
      },
      {
        icon: '/imgs/mine/picture1.png',
        title: '关于我们'
      }
    ],
    memberlist: []
  },



  onLoad: function(options) {
    let that = this
    console.log(wx.getStorageSync('user'))
    this.setData({
      user: wx.getStorageSync('user')
    })
    that.personal();

    that.members();

  },


  // 个人中心
  personal: function() {
    let url = app.globalData.api + 'api/user/personal'
    let data ={
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url,'get',data,{})
    .then(function(res){
      console.log(res)
    })
  },


  // 会员卡
  members: function() {
    let that = this
    let url = app.globalData.api + 'api/card/list'
    let data = {
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        let list = res.data.data.cardList
        // console.log(list)
        that.setData({
          memberlist: list
        })
      })
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

  // 查看全部订单
  more: function(e) {
    let index = e.currentTarget.dataset.index
    let data = parseInt(index)
    console.log(data)
    wx.navigateTo({
      url: '/pages/mine/order/order?index=' + data,
    })
  },

  //相应的导航
  seeorder: function(e) {
    let index = e.currentTarget.dataset.index
    let data = parseInt(index) + 1
    console.log(data)
    wx.navigateTo({
      url: '/pages/mine/order/order?index=' + data,
    })
  },

  // 导航
  OperationTap: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    if (index == 0) {
      //判断
      let list = that.data.memberlist
      console.log('list',list)
      if (list.length==0){
        let url = '/pages/mine/members/members'
        modals.navigate(url)
      }else{
        let url = '/pages/mine/members-list/members-list'
        modals.navigate(url)
      }
    } else if (index == 1) {
      let url = '/pages/mine/collect/collect'
      modals.navigate(url)
    } else if (index == 2) {
      let url = '/pages/mine/integral/integral'
      modals.navigate(url)
    } else {
      let url = '/pages/mine/about/about'
      modals.navigate(url)
    }
  },


  onShow: function() {
    if (!wx.getStorageSync('openid')) {
      let url = '/pages/login/login'
      modals.navigate(url)
    }
  }

  
})