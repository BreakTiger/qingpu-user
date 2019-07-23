import modals from '../../class/methods/modal.js'
const request = require('../../class/api/htts.js')
var app = getApp()
var openid = wx.getStorageSync('openid')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    bannerlist: '', //轮播图
    categoryList: '', //一级分类列表
    productList: '', //热门商品
    tophot: '',
    botmhot: '',
    audio: '',
    playstatus: 0
  },

  Audio: null,

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

  // 进入专区页面
  detail: function(e) {
    let data = e.currentTarget.dataset.item.id
    console.log(data)
    let url = '/pages/index/zone/zone?id='
    modals.navigate(url, data)
  },

  // 热销商品
  onHotTap: function(e) {
    let id = e.currentTarget.dataset.id
    console.log('商品id：',id)
    let url = '/pages/index/detail/detail?id='
    modals.navigate(url, id)
  },

  lunbo:function(e){
    let id = e.currentTarget.dataset.item.typeValue
    console.log(id)
    let url = '/pages/index/detail/detail?id='
    modals.navigate(url, id)
  },

  // 播放音频
  voice: function() {
    let that = this
    // 获取音频文件的地址
    let audio = that.data.audio
    // 调用微信播放音频API

    // 获取播放状态
    let play = that.data.playstatus

    this.Audio.src = audio

    if (play == 0) { //开始播放
      this.Audio.play();
      this.Audio.onPlay(() => {
        console.log('开始播放')
      })
      that.setData({
        playstatus: 1
      })
    } else if (play == 1) {
      this.Audio.stop()
      this.Audio.onStop(() => {
        console.log('停止音乐')
      })
      that.setData({
        playstatus: 0
      })
    }
  },

  //数据初步加载的方法
  onLoad: function(options) {

    //定位指针
    let that = this
    let url = app.globalData.api + "api/main/mainData"
    // 将openid传输给后台
    let data = {
      openId: openid
    }
    that.Audio = wx.createInnerAudioContext('myAudio')
    // 加载中的方法调用
    modals.loading()
    request.sendRequest(url, 'GET', data, {}) //将openid传给后台
      .then(function(res) { // 返回的结果在res中
        modals.loaded()
        console.log(res.data.data)
        let result = res.data.data
        let categoryList = result.categoryList
       
        let tophot = categoryList.slice(0, 2)
        // let botmhot = categoryList.slice(2, 5)
        let botmhot = categoryList.slice(2)
        console.log(tophot, botmhot)
        // 音频
        let audio = result.audio.audioPath
        // console.log(audio)

        // 将上面获取的后台所返回的值，用于更新data中相应的内容
        that.setData({
          bannerlist: result.bannerList,
          categoryList: result.categoryList,
          productList: result.productList,
          tophot: tophot,
          botmhot: botmhot,
          audio: audio
        })
      }, function(err) {
        console.log(err);
      });

    if (!wx.getStorageSync('openid')) {
      let url = '/pages/login/login'
      modals.navigate(url)
    }
  },

  // 指示点的改变事件
  changDot: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  // 搜索
  search: function() {
    let url = '/pages/index/search/search'
    modals.navigate(url)
  },
})