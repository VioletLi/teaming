// miniprogram/pages/teamInfo/teamInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"队伍信息",
        isActive:true
      },
      {
        id:1,
        name:"队伍成员",
        isActive:false
      }
    ],

    messageType: {
      application: 1, // 申请加入某个队伍
      complete: 2,
      fail: 3,
      leave: 4,
      acceptApply: 5,
      rejectApply: 6,
      removed: 7
    },

    teaminfo:[],
    teamlabel: null,
    teammembers:[],

    memberList:[],
    team:{},
    message: "sss",
    delteID: 0,
    isManage: false,
    inTeam: false,
    userID: '28ee4e3e60867cd612781c4e6bd0ae26',  //公共信息
    teamID: "b00064a760867de4117130e9399892fe",
    deleteList: [],

    canClick: true

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取所有与自己相关的队伍存到data，待实现
    const team_id=options.team_id;
    var app = getApp();
    this.getteaminfo(team_id);
    this.getteammember(team_id);
    this.setData({
      teamID: team_id,
      userID: app.globalData.userInfo._id
    })
  },

  handleTabsItemChange(e)
  {
    // 这里有传过来的参数index
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData(
      {tabs}
    )
  },
  getteaminfo(team_id)
  {
    const db = wx.cloud.database()
    // const teams = db.collection('Team');
    db.collection('Team').doc(team_id).get().then(res => {
      // res.data 包含该记录的数据
      if(res.data.deadline != null)
        res.data.deadline=res.data.deadline.toLocaleDateString();
      else
        res.data.deadline="无截止日期"
      res.data.create_time=res.data.create_time.toLocaleDateString();
      this.setData(
        {
          teaminfo:res.data
        }
      )
      wx.setNavigationBarTitle({
        title: res.data.team_name//页面标题为路由参数
      })
      if (this.data.teaminfo.label_id) {
        const db = wx.cloud.database()
        db.collection("Label")
        .doc(this.data.teaminfo.label_id)
        .get()
        .then(res=>{
          this.setData({
            teamlabel: res.data
          })
        })
        .catch(console.error)
      }
    })
  },

  getnickname: function (member_id)
  {
    var that=this;
    const db = wx.cloud.database()
          //获取队伍member
          const persons = db.collection('Person');
            persons.where({
              _id:member_id
            }).get({
              success:function(res){
                let memberlist=that.data.teammembers;
                memberlist.push(res.data[0]);
                that.setData({teammembers:memberlist});


              }})
  },
  getteammember: function (options)
  {
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMember',
      // 传给云函数的参数
      data: {
        team_id: options
      },
      success: function(res) {
        that.setData({
          memberList: res.result.member.list,  //获取成员信息
          team: res.result.team.data
        })
        
        var result = that.data.memberList.some(function(item) {
          if (item.member_id == that.data.userID) {
              return true;
          }
        })  //看用户是否存在在当前队伍中

        if (result == true) {
          that.setData({
            inTeam: true
          })
        }
        if (that.data.team.leader == that.data.userID) {
          that.setData({
            isManage: true
          })  //leader存放的是队长的_id，通过这个比较可看出用户是否为当前队伍队长
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

    showModal(e) {
      var idx = e.currentTarget.dataset.idx  //获取被处理成员的_id
      let memberList = this.data.memberList;
      if (e.currentTarget.dataset.target == "DialogModal1") {
        this.setData({
          modalName: e.currentTarget.dataset.target,
          message: "确定将队员 " + memberList[idx].info[0].nickname + " 移除队伍吗？",  
          deleteID: idx //保存被处理成员的_id
        }) 
      }
      else if (e.currentTarget.dataset.target == "DialogModal2") {
        let teaminfo = this.data.teaminfo
        this.setData({
          modalName: e.currentTarget.dataset.target,
          message: "确定退出队伍 " + teaminfo.team_name + " 吗？",  
          deleteID: idx //保存被处理成员的_id
        }) 
      }
    },
  
    hideModal(e) {
      this.setData({
        modalName: null
      })
      var res = e.currentTarget.dataset.res
      if (res == "1") {  // 退出/移除事件用户点击确认
        let memberlist = this.data.memberList;
        memberlist[this.data.deleteID].isDelete = true
        var op = e.currentTarget.dataset.op
        if (op == "remove") {  // 队长移除队员出队伍
          this.setData({
            memberList: memberlist,
            deleteID: 0,
            modalName: "Modal1",
            deleteList: this.data.deleteList.concat(memberlist[this.data.deleteID].member_id)
          }) 
        }
        else if (op == "quit") { //队员退出队伍
          this.setData({
            memberList: memberlist,
            deleteID: 0,
            modalName: "Modal2",
            deleteList: this.data.deleteList.concat(memberlist[this.data.deleteID].member_id)
          }) 
        }
  
        var that = this;
        wx.cloud.callFunction({
          // 云函数名称
          name: 'deleteMember', //使用云函数删除成员
          // 传给云函数的参数
          data: {
            team_id:  this.data.teamID,
            deleteList: this.data.deleteList
          },
          success: function(res) {
            if(op == "quit") {  //退出是给队长发消息
              wx.cloud.callFunction({
                // 云函数名称
                name: 'sendMessage',
                // 传给云函数的参数
                data: {
                  type: that.data.messageType.leave,
                  announcer_id: that.data.userID,
                  receive_id: that.data.teaminfo.leader,
                  team_id: that.data.teaminfo._id
                },
                success: console.log,
                fail: console.error
              })

            }
            else {  //移除是给被移除的队员发消息
              wx.cloud.callFunction({
                // 云函数名称
                name: 'sendMessage',
                // 传给云函数的参数
                data: {
                  type: that.data.messageType.removed,
                  announcer_id: that.data.teaminfo.leader,
                  receive_id: that.data.deleteList[0],
                  team_id: that.data.teaminfo._id
                },
                success: console.log,
                fail: console.error
              })
            }
            that.setData({
              deleteList: []
            })
          },
          fail: console.error
        })
        
      } 
    },

    joinTeam: function() {
      // 发送申请加入队伍的申请
      var that = this;

      const db = wx.cloud.database()

      this.setData({  //一次点击后在处理完数据之前不允许再次点击
        canClick: false
      })

      db.collection('Message').where({  //发送申请信息
        type: that.data.messageType.application, 
        announcer_id: that.data.userID, 
        team_id: that.data.teamID
      }).get().then(res => {
        if (res.data.length == 0) {  //没有数据说明没有申请过
          wx.cloud.callFunction({
            // 云函数名称
            name: 'sendMessage',  //调用云函数进行接受信息的发送
            // 传给云函数的参数
            data: {
              type: that.data.messageType.application, 
              announcer_id: that.data.userID, 
              receive_id: that.data.teaminfo.leader, 
              team_id: that.data.teamID
            },
            success: function(res) {
              wx.showToast({
                title: '申请提交成功！',
              })
              that.setData({
                canClick: true
              })
            },
            fail: console.error
          })
        }
        else {
          db.collection('Receive').where({ //有提交过申请，查看是否被处理
            message_id: res.data[0]._id,
            isRead: false,
          }).get().then(res=>{
            if (res.data.length > 0) { //未被处理前不可再次提交
              wx.showToast({
                title: '您已提交申请！',
              })
              that.setData({
                canClick: true
              })
            }
            else {
              wx.cloud.callFunction({  //已经被处理可以再次提交
                // 云函数名称
                name: 'sendMessage',
                // 传给云函数的参数
                data: {
                  type: that.data.messageType.application, 
                  announcer_id: that.data.userID, 
                  receive_id: that.data.teaminfo.leader, 
                  team_id: that.data.teamID
                },
                success: function(res) {
                  wx.showToast({
                    title: '申请提交成功！',
                  })
                  that.setData({
                    canClick: true
                  })
                },
                fail: console.error
              })
            }
          })

        }
        
      })
    },

    //提前结束组队，要发送组队成功信息，以及过期所有本队伍申请
    finishTeam: function(e) {
      const db = wx.cloud.database()
      const _ = db.command
      var that = this
      const team_id = that.data.teamID
      const member_list = that.data.teaminfo.member_list
      
      try{
            // 首先过期队伍中剩余未处理的申请信息
            db.collection('Message')
            .where({
              team_id:team_id,
              type: 1
            })
            .get()
            .then(res2=>{
              var len2 = res2.data.length
              for (var j = 0; j < len2; j++) {
                var rec = res2.data[j]
                db.collection('Receive')
                .where({
                  message_id:rec._id
                })
                .update({
                  data: {  // 设置为已读
                    isRead: true
                  }
                })
              }
            })
            .catch(console.error)

            //将队伍设置未已结束
            db.collection("Team").where({
              _id: team_id
            })
            .update({
              data: {
                isOver: true
              }
            })
            .then(res=>{ //给队伍成员发送组队结束信息
              db.collection('Message').add({
                data: {
                  type: 2,
                  announce_time: db.serverDate(),
                  announcer_id: that.data.teaminfo.leader,
                  team_id: team_id
                }
              }).then(res=>{
                for(var i = 0; i < member_list.length; i++) {
                  db.collection('Receive').add({
                    data: {
                      message_id: res._id,
                      isRead: false,
                      receive_id: member_list[i]
                    }
                  }).then(res => {
                  }).catch(console.error)
                }
              }).catch(console.error)
            }).catch(console.error)
          }
          finally{
            wx.showToast({
              title: '结束组队成功！',
            })
            setTimeout(function () {
              //要延时执行的代码，更新队伍信息数据
              that.getteaminfo(team_id);
              that.getteammember(team_id);
            }, 1000)
          }

    }
    
})