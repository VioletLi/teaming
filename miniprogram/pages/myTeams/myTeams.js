Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[],
    userid:null,
    filt:false,
    btn:['我管理的队伍','所有队伍'],
    ind:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    this.setData({
      userid: app.globalData.userInfo._id
    })
    var that = this
    //获取所有与自己相关的队伍存到data，待实现
    wx.cloud.callFunction({
      name:"login",
      context:"login"
    }).then(res=>{
      // that.setData({
      //   userid:res.result
      // })
      const db = wx.cloud.database()
      db.collection("Member").where({
        member_id:that.data.userid
      }).get({
        success:function(res){
          res["data"].forEach(element => {
            var temp = [{
              "isLeader": element["isLeader"],
              "id": element["team_id"]
            }]
            db.collection("Team").doc(temp[0]["id"]).get({
              success:function(res){
                temp[0]["content"] = res["data"]["information"]
                temp[0]["name"] = res["data"]["team_name"]
                temp[0]["isOver"] = res["data"]["isOver"]
                that.setData({
                  info: that.data.info.concat(temp)
                })
              }
            })
          });
        }
      })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //判断是否还有未显示的队伍，动态改变底部内容
  },

  edit: function(e){
    wx.navigateTo({
      url: '../editPage/editPage?id=' + e.currentTarget.id,
    })
  },

  filter: function(){
    this.setData({
      filt:!this.data.filt,
      ind:1-this.data.ind
    })
  }
})