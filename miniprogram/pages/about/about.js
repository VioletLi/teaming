// miniprogram/pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    value:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "关于我们"//页面标题为路由参数
    })
  },

  commit: function() {
    if(this.data.content == "") {
      wx.showToast({
        title: '请输入意见',
      })
    }
    else {
      var that = this
      const db = wx.cloud.database()
      db.collection('Advice').add({
        data: {
          advice: that.data.content
        }
      })
      .then(res=>{

        that.setData({
          content:"",
          value:""
        })

        wx.showToast({
          title: '提交成功！',
        })
        
      })
      .catch(console.error)
      
    }  
  },

  fill:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})