// miniprogram/pages/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList:[],
    team:{},
    message: "sss",
    delteID: 0,
    isManage: false,
    userID: '28ee4e3e60867cd612781c4e6bd0ae26',  //公共信息
    teamID: "b00064a760867de4117130e9399892fe",
    deleteList: []
  },

  joinTeam() {
    console.log("join");
    
    var that = this;
    
    //
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'addMember',
    //   // 传给云函数的参数
    //   data: {
    //     team_id:  this.data.teamID,
    //     member_id: "sdfdfwefa",
    //     isLeader: false
    //   },
    //   success: function(res) {
    //     console.log(res.result) // 3
    //   },
    //   fail: console.error
    // })

   
    
  },

  showModal(e) {
    var idx = e.currentTarget.dataset.idx
    let memberList = this.data.memberList;
    let message = this.data.message;
    let deleteID = this.data.delteID;
    // this.setData({
    //   modalName: e.currentTarget.dataset.target,
    //   message: "确定将队员 " + memberList[idx].name + " 移除队伍吗？",  
    //   deleteID: idx
    // })  
    if (e.currentTarget.dataset.target == "DialogModal1") {
      this.setData({
        modalName: e.currentTarget.dataset.target,
        message: "确定将队员 " + memberList[idx].name + " 移除队伍吗？",  
        deleteID: idx
      }) 
    }
    else if (e.currentTarget.dataset.target == "DialogModal2") {
      let team = this.data.team
      this.setData({
        modalName: e.currentTarget.dataset.target,
        message: "确定退出队伍 " + team.name + " 吗？",  
        deleteID: idx
      }) 
    }
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
    var res = e.currentTarget.dataset.res
    // 根据传参键值，获取点击事件传来的image值
    if (res == "1") {
      let memberlist = this.data.memberList;
      memberlist[this.data.deleteID].isDelete = true
      var op = e.currentTarget.dataset.op
      if (op == "remove") {
        this.setData({
          memberList: memberlist,
          deleteID: 0,
          modalName: "Modal1",
          deleteList: this.data.deleteList.concat(memberlist[this.data.deleteID].member_id)
        }) 
        console.log(this.data.deleteList)
      }
      else if (op == "quit") {
        this.setData({
          memberList: memberlist,
          deleteID: 0,
          modalName: "Modal2",
          deleteList: this.data.deleteList.concat(memberlist[this.data.deleteID].member_id)
        }) 
        console.log(this.data.deleteList)
      }
      console.log("删除")

      var that = this;
      wx.cloud.callFunction({
        // 云函数名称
        name: 'deleteMember',
        // 传给云函数的参数
        data: {
          team_id:  this.data.teamID,
          deleteList: this.data.deleteList
        },
        success: function(res) {
          that.setData({
            deleteList: []
          })
        },
        fail: console.error
      })
      
    } else {
      console.log("不删除")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    var that = this;

    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMember',
      // 传给云函数的参数
      data: {
        team_id:  this.data.teamID
      },
      success: function(res) {
        console.log(res.result) // 3
        that.setData({
          memberList: res.result.member.list,
          team: res.result.team.data
        })
        if (that.data.team.leader == that.data.userID) {
          that.setData({
            isManage: true
          })
        }
        else {
          that.setData({
            isManage: false
          })
        }
      },
      fail: console.error
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'deleteMember',
      // 传给云函数的参数
      data: {
        team_id:  this.data.teamID,
        deleteList: this.data.deleteList
      },
      success: function(res) {
        that.setData({
          deleteList: []
        })
      },
      fail: console.error
    })


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'deleteMember',
      // 传给云函数的参数
      data: {
        team_id:  this.data.teamID,
        deleteList: this.data.deleteList
      },
      success: function(res) {
        that.setData({
          deleteList: []
        })
      },
      fail: console.error
    })

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