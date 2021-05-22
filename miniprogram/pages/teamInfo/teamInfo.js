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
    // console.log(team_id);
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
    // console.log(e);
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
      // console.log("aaa");
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
          console.log(res)
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
    // console.log("ok");
    console.log(member_id);
    const db = wx.cloud.database()
          //获取队伍member
          const persons = db.collection('Person');
            persons.where({
              _id:member_id
            }).get({
              success:function(res){
                // console.log(res.data);
                let memberlist=that.data.teammembers;
                memberlist.push(res.data[0]);
                that.setData({teammembers:memberlist});


              }})
  },
  getteammember: function (options)
  {
    var that = this;
    console.log(options)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMember',
      // 传给云函数的参数
      data: {
        team_id: options
      },
      success: function(res) {
        console.log(res.result) // 3
        that.setData({
          memberList: res.result.member.list,
          team: res.result.team.data
        })
        
        var result = that.data.memberList.some(function(item) {
          if (item.member_id == that.data.userID) {
              return true;
          }
        })

        if (result == true) {
          that.setData({
            inTeam: true
          })
        }
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
        console.log(memberList)
        this.setData({
          modalName: e.currentTarget.dataset.target,
          message: "确定将队员 " + memberList[idx].info[0].nickname + " 移除队伍吗？",  
          deleteID: idx
        }) 
      }
      else if (e.currentTarget.dataset.target == "DialogModal2") {
        let teaminfo = this.data.teaminfo
        this.setData({
          modalName: e.currentTarget.dataset.target,
          message: "确定退出队伍 " + teaminfo.team_name + " 吗？",  
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
            if(op == "quit") {  //退出是给队长发消息
              // type, announcer_id, receive_id, team_id
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
        
      } else {
        console.log("不删除")
      }
    },

    joinTeam: function() {
      // 发送申请加入队伍的申请，未实现
      var that = this;

      const db = wx.cloud.database()

      this.setData({
        canClick: false
      })

      db.collection('Message').where({
        type: that.data.messageType.application, 
        announcer_id: that.data.userID, 
        team_id: that.data.teamID
      }).get().then(res => {
        console.log(res)
        if (res.data.length == 0) {
          wx.cloud.callFunction({
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
        else {
          db.collection('Receive').where({
            message_id: res.data[0]._id,
            isRead: false,
          }).get().then(res=>{
            if (res.data.length > 0) {
              wx.showToast({
                title: '您已提交申请！',
              })
              that.setData({
                canClick: true
              })
            }
            else {
              wx.cloud.callFunction({
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
      
      console.log("finish")
      try{
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
                  data: {
                    isRead: true
                  }
                })
              }
            })
            .catch(console.error)

            db.collection("Team").where({
              _id: team_id
            })
            .update({
              data: {
                isOver: true
              }
            })
            .then(res=>{
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
              //要延时执行的代码
              that.getteaminfo(team_id);
              that.getteammember(team_id);
            }, 1000)
          }

    }
    
})