import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var app = getApp()

Page({


  data: {
    oneid: '',
    banner: '',
    lable: '',
    allid: '', // 所有的二级ID
    checked: 0,
    list: [],
    id: '',
    swiperCurrent:0
  },


  onLoad: function(options) {
    let that = this
    let id = options.id
    that.setData({
      oneid: id
    })
    that.zone()
  },

  // 专区详情
  zone: function() {
    let that = this
    let id = that.data.oneid
    let url = app.globalData.api + 'api/category/category'
    let data = {
      parentId: id,
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res.data.data)
        let blist = res.data.data.bannerList
        let clist = res.data.data.categoryList
        // 添加'全部'标签
        let arr = []
        arr = clist.unshift({
          'id': 0,
          'name': '全部'
        })

        // 获取所有二级分类标签的id,并拼接
        let aa = []
        for (let i = 0; i < clist.length; i++) {
          console.log('二级', clist[i].id)
          aa.push(clist[i].id)
          console.log(aa)
        }
        let str = aa.join(',')
        console.log(str)
        that.setData({
          banner: blist,
          lable: clist,
          allid: str
        })
        console.log(that.data.lable)
        let id = that.data.allid
        console.log('id', id)
        let url = app.globalData.api + 'api/category/productListByCategoryIds'
        let data = {
          categoryIds: id,
          openId: wx.getStorageSync('openid')
        }
        request.sendRequest(url, 'get', data, {})
          .then(function (res) {
            console.log(res.data.data)
            let list = res.data.data.productList
            that.setData({
              list: list
            })
          })
      })
  },

  // 标签颜色切换
  onLableTap: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    console.log('index:', index, 'id:', id)
    this.setData({
      checked: index,
      id: id
    })
    if (id == 0) { //点击标签为:全部
      that.alldetail()
    } else {
      that.kinds()
    }

  },

  // 全部标签
  alldetail: function() {
    let that = this
    let id = that.data.allid
    console.log('id', id)
    let url = app.globalData.api + 'api/category/productListByCategoryIds'
    let data = {
      categoryIds: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        let list = res.data.data.productList
        that.setData({
          list: list
        })
      })
  },

  // 除'全部'以外的其他分类标签
  kinds: function() {
    let that = this
    let id = that.data.id
    console.log('分类ID', id)
    let url = app.globalData.api + 'api/product/productList'
    let data = {
      category: id,
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res.data.data)
        let list = res.data.data.productList
        that.setData({
          list: list
        })
      })
  },


  //收藏功能
  onLikeTap: function(e) {
    let that = this
    console.log(e.currentTarget.dataset)
    let url = app.globalData.api + "api/product/collect"
    let id = e.currentTarget.dataset.item.id
    let data = {
      productId: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res)
        let id = that.data.id
        if (id == 0) {
          that.alldetail()
        } else {
          that.kinds()
        }
      })
  },


  // 进入详情页面
  todetail: function(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    let url = '/pages/index/detail/detail?id='
    modals.navigate(url, id)
  },

  //轮播图进入详情
  goodsTap: function(e) {
    let id = e.currentTarget.dataset.item.typeValue
    console.log(id)
    let url = '/pages/index/detail/detail?id='
    modals.navigate(url, id)
  },

  // 轮播图指示点
  changDot: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

})