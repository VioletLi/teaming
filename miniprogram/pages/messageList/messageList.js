// miniprogram/pages/messageList/messageList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    id: "17453ede608f58e1067ec12278c8a324",
    messageType: {
      application: 1, // 申请加入某个队伍
      complete: 2,
      fail: 3,
      leave: 4,
      acceptApply: 5,
      rejectApply: 6
    },
    messageText: {
      application: "申请加入队伍",
      complete: "队伍组建完成", // 完成和失败可以没有announce_id
      fail: "队伍组建失败",
      leave: "离开了队伍",
      acceptApply: "同意你加入队伍",
      rejectApply: "拒绝了你的申请"
    },
    showApply: false,
    showComplete: false,
    showFail: false,
    showLeave: false,
    showAccept: false,
    showReject: false,
    currentIndex: -1,
    currentTeam: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage()
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

  },

  clickMessage: function (e) {
    const index = e.currentTarget.dataset.index
    const type = this.data.messageList[index].type
    const that = this
    this.setData({
      currentIndex: index
    })
    wx.cloud.database().collection('Team')
      .doc(this.data.messageList[index].team_id)
      .field({
        _id: false,
        team_name: true
      })
      .get({
        success: function (res) {
          that.setData({
            currentTeam: res.data.team_name
          })
          if (type != that.data.messageType.application) {
              that.setRead(index)
          }
          that.showMessage(type, true)
        }
      })
  },
  show: function (e) {
    console.log(e)
    this.showMessage(e.currentTarget.dataset.type, e.currentTarget.dataset.isshow)
    // 没有大写
  },

  showMessage: function (type, isShow) {
    console.log("type")
    console.log(type)
    console.log("isShow")
    console.log(isShow)
    switch (type) {
      case this.data.messageType.application:
        this.setData({
          showApply: isShow
        })
        break
      case this.data.messageType.acceptApply:
        this.setData({
          showAccept: isShow
        })
        break
      case this.data.messageType.rejectApply:
        this.setData({
          showAccept: isShow
        })
        break
      case this.data.messageType.complete:
        this.setData({
          showComplete: isShow
        })
        break
      case this.data.messageType.fail:
        this.setData({
          showFail: isShow
        })
        break

      case this.data.messageType.leave:
        this.setData({
          showLeave: isShow
        })
        break
    }
  },

  setRead: function (index) {
    const isRead = this.data.messageList[index].receive[0].isRead
    if (!isRead) {
      this.data.messageList[index].receive[0].isRead = true;
      this.setData({
        messageList: this.data.messageList
      })
      const db = wx.cloud.database()
      db.collection('Receive')
        .doc(this.data.messageList[index].receive[0]._id).update({
          data: {
            isRead: true
          },
          success: function (res) {
            // console.log("success")
            // 记得读和写的权限
            // console.log(res.data)
          }
        })
    }
  },

  acceptApply: function () {
    // 同意申请需要将该announcer放到队伍表中，并且发送一个信息给announcer
    // 处理好后要弹出通知

    const that = this
    wx.cloud.callFunction({
      name: 'addMember',
      data: {
        announcer_id: that.data.id,
        team_id: that.data.messageList[that.data.currentIndex].team_id,
        member_id: that.data.messageList[that.data.currentIndex].announcer_id,
        type: that.data.messageType.acceptApply
      },
      success: function (res) {
        console.log(res)
        // 将信息变为已处理
        wx.showModal({
          title: '提示',
          content: '您已同意对方的申请',
          showCancel: false
        })
        that.setRead(this.data.currentIndex)
        that.showMessage(this.data.messageType.application, false)
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },

  rejectApply: function () {
    // 拒绝申请只需要发送信息即可，同时要将信息变更为已处理
    const that = this
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        type: that.data.messageType.rejectApply,
        announcer_id: that.data.id,
        receive_id: that.data.messageList[that.data.currentIndex].announcer_id,
        team_id: that.data.messageList[that.data.currentIndex].team_id
      },
      success: function (res) {
        console.log(res)
        // 将信息变为已处理
        wx.showModal({
          title: '提示',
          content: '您已拒绝对方的申请',
          showCancel: false
        })
        that.setRead(this.data.currentIndex)
        that.showMessage(this.data.messageType.application, false)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  deleteMessage: function(e) {
    console.log('delete')
    console.log(e)
    const index = e.currentTarget.dataset.index
    const type = this.data.messageList[index].type
    if (type == this.data.messageType.application) {
        const isRead = this.data.messageList[index].receive[0].isRead
        if (!isRead) {
          // 弹出提示窗，需要先处理消息
          wx.showModal({
            title: '提示',
            content: '该消息需要处理后才能删除，请先处理消息！',
            showCancel: false
          })
          return
        }
      }
      const db = wx.cloud.database()
      db.collection('Message').doc(this.data.messageList[index]._id).remove()
      db.collection('Receive').doc(this.data.messageList[index].receive[0]._id).remove()
      this.getMessage()
  },

  getMessage: function() {
    const that = this
    wx.cloud.callFunction({
      name: 'getMessage',
      data: {
        id: that.data.id
      },
      success: function (res) {
        console.log("call success")
        console.log(res)
        that.setData({
          messageList: res.result.message.list
        })
        console.log("messageList")
        console.log(that.data.messageList)
      },
      fail: function (err) {
        console.log("call err")
        console.log(err)
      }
    })
  }
})