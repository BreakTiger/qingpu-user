import modals from '../../../class/methods/modal.js'
const request = require('../../../class/api/htts.js')
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()

Page({

  data: {
    swiperCurrent: 0,
    productid: '', //商品ID
    goodsinfo: '', //商品基础信息
    slideshow: [], // 轮播图
    changestatus: 1,
    nodes: [],
    detailDatas: { //商品购买的最终数量
      num: 1
    },
    minusStatuses: '',
    sendway: [{
        id: 1,
        name: '到店自取'
      },
      {
        id: 2,
        name: '快递'
      }
    ], //配送方式
    sendindex: 0,
    sendid: 1,
    colorlist: '',
    capacitylist: '',
    colorindex: 0,
    capacityindex: 0,
    colorid: '', //选择的ID
    capacityid: '', //
    colorname: '', //选择的名字
    capacityname: '',
    aa: [],
    id: '', // 规格ID
    point: '', //积分
    price: '', //价格
    vipPrice: '', //会员价
    hasWatermark: ''

  },


  onLoad: function(options) {
    let that = this
    let id = options.id
    console.log('商品ID:',id)
    that.setData({
      productid: id
    })
    that.goods()
    that.specifications()
    that.pricedetail()
  },

  // 轮播点
  changDot: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },

  // 弹窗[立即购买，选择规格、尺码颜色+关闭按钮]
  changegg: function() {
    let that = this
    let changestatus = that.data.changestatus
    console.log(changestatus)
    if (changestatus == 1) {
      that.setData({
        changestatus: 2
      })
    } else {
      that.setData({
        changestatus: 1
      })
    }
  },

  // 减号
  bindMinus: function(e) {
    var num = this.data.detailDatas.num;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    } else {
      this.setData({
        minusStatuses: true,
      });
    }
    // 购物车数据
    var detailDatas = this.data.detailDatas;
    detailDatas.num = num;
    // 将数值与状态写回
    this.setData({
      detailDatas: detailDatas,
    });
    console.log(this.data.detailDatas)
  },

  // 加号
  bindPlus: function(e) {
    var num = this.data.detailDatas.num;
    // 自增
    num++;
    // 购物车数据
    var detailDatas = this.data.detailDatas;
    detailDatas.num = num;
    // 将数值与状态写回
    this.setData({
      detailDatas: detailDatas,
      minusStatuses: false,
    });
    console.log(this.data.detailDatas)
  },

  // 商品数量 【加，减，手动输入，控制】
  bindChange: function(e) {
    var detailDatas = this.data.detailDatas;
    if (e.detail.value > 1) {
      detailDatas.num = e.detail.value;
      this.setData({
        detailDatas: detailDatas,
        minusStatuses: false,
      });
    } else {
      detailDatas.num = 1;
      this.setData({
        detailDatas: detailDatas,
        minusStatuses: true,
      });
    }
  },

  // 配送方式
  selectpeis: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    console.log('选择的配送方式:', 'index:', index, 'id:', id)
    that.setData({
      sendindex: index,
      sendid: id
    })
  },

  // 商品详情
  goods: function() {
    let that = this
    let id = that.data.productid
    let url = app.globalData.api + 'api/product/productDetails'
    let data = {
      productId: id,
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res.data.data)
        let result = res.data.data.product
        that.setData({
          goodsinfo: result,
          slideshow: result.images,
          nodes: result.content,
          hasWatermark: result.hasWatermark
        })
        var article = result.content
        WxParse.wxParse('article', 'html', article, that, 5)
      }, function(err) {
        console.log(err)
      })
  },

  // 收藏
  colloct: function() {
    let that = this
    let id = that.data.productid
    let url = app.globalData.api + 'api/product/collect'
    let data = {
      productId: id,
      openId: wx.getStorageSync('openid')
    }
    modals.loading()
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        modals.loaded()
        console.log(res)
        console.log('已收藏')
        that.goods()
      }, function(err) {
        console.log(err)
      })
  },

  // 商品规格
  specifications: function() {
    let that = this
    let id = that.data.productid
    let url = app.globalData.api + 'api/product/optionOfProduct'
    let data = {
      productId: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data.optionList)
        let kinds = res.data.data.optionList
        console.log('kinds', kinds)
        if (kinds.length == 1) {
          that.setData({
            colorlist: kinds[0],
            colorid: kinds[0].optionValueList[0].id,
            colorname: kinds[0].optionValueList[0].name,
          })
        } else {
          that.setData({
            colorlist: kinds[0],
            capacitylist: kinds[1],
            colorid: kinds[0].optionValueList[0].id,
            colorname: kinds[0].optionValueList[0].name,
            capacityid: kinds[1].optionValueList[0].id,
            capacityname: kinds[1].optionValueList[0].name
          })
        }
      }, function(err) {
        console.log(err)
      })
  },

  // 选择规格

  // 1.选择花色
  selectcolor: function(e) {
    let that = this
    let colorid = e.currentTarget.dataset.item.id
    let colorname = e.currentTarget.dataset.item.name
    let colorindex = e.currentTarget.dataset.index
    console.log('id:', colorid, 'name:', colorname, 'index', colorindex)
    // 更新
    that.setData({
      colorid: colorid,
      colorname: colorname,
      colorindex: colorindex
    })
    that.choose()
  },

  // 2.选择容量
  selectsize: function(e) {
    let that = this
    let capacityid = e.currentTarget.dataset.item.id
    let capacityname = e.currentTarget.dataset.item.name
    let capacityindex = e.currentTarget.dataset.index
    console.log('id', capacityid, 'name', capacityname, 'index', capacityindex)
    // 更新
    that.setData({
      capacityid: capacityid,
      capacityname: capacityname,
      capacityindex: capacityindex
    })
    that.choose()
  },

  // 规格对应的价格
  pricedetail: function() {
    let that = this
    let id = that.data.productid
    let url = app.globalData.api + 'api/product/productPrice'
    let data = {
      productId: id,
      openId: wx.getStorageSync('openid')
    }
    request.sendRequest(url, 'get', data, {})
      .then(function(res) {
        console.log(res.data.data)
        let aa = []
        let options = res.data.data.productPriceList
        for (let i = 0; i < options.length; i++) {
          console.log(options[i])
          let data = {
            id: options[i].id,
            price: options[i].price,
            vipPrice: options[i].vipPrice,
            point: options[i].point,
            cid: options[i].optionValueList[0].id,
            cname: options[i].optionValueList[0].name,
            sid: options[i].optionValueList.length > 1 ? options[i].optionValueList[1].id : null,
            sname: options[i].optionValueList.length > 1 ? options[i].optionValueList[1].name : null
          }
          aa.push(data)
          that.setData({
            aa: aa
          })
          that.choose()
        }
      })
  },

  choose: function() {
    let that = this
    // 获取选中的内容和ID
    let colorid = that.data.colorid
    let capacityid = that.data.capacityid
    console.log(colorid, capacityid)

    let lists = that.data.aa
    console.log(lists)
    for (var i = 0; i < lists.length; i++) {
      // console.log('id', lists[i].id, 'cid', lists[i].cid, 'sid', lists[i].sid)
      if (colorid == lists[i].cid && (lists[i].sid==null || capacityid == lists[i].sid)) {
        // console.log('lists[i].id', lists[i].id)
        that.setData({
          id: lists[i].id,
          price: lists[i].price,
          vipPrice: lists[i].vipPrice,
          point: lists[i].point
        })
      }
    }
  },

  // 返回首页
  homeTap: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 立即购买
  tobuy: function() {
    let that = this
    that.choose()

    let data = {
      goodspicture: that.data.slideshow[0], //商品图片
      goodsname: that.data.goodsinfo.name, //商品名
      color: that.data.colorname, //颜色
      size: that.data.capacityname, // 容量
      price: that.data.price, //普通价格
      vipprice: that.data.vipPrice, //会员价
      quantity: that.data.detailDatas.num, //数量
      id: that.data.id, //规格ID
      hasWatermark: that.data.hasWatermark, //水印状态 0：无  1：有
      sendid: that.data.sendid, //配送方式  1：自取 2：快递
      point: that.data.point, //积分
    }
    console.log('传输的数据：', data)

    wx.setStorageSync('goodsinfo', data)

    that.setData({
      changestatus: 1
    })

    wx.navigateTo({
      url: '/pages/index/makesure/makesure',
    })

  },

})