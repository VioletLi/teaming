// miniprogram/pages/newTeam/newTeam.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    needAddress:false,
    amountLimit:false,
    dateLimit:false,
    date:null,
    curDate:null,
    userid:null,
    title:null,
    member:-1,
    content:'',
    address:'',
    monthDay:[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    picker:['a', 'b'],
    labelList:[],
    index:-1,
    canClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    d = d.getDate();
    d += 1;
    if(d > this.data.monthDay[m - 1]){
      if(m != 2 || !((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) || d == 30){
        d = 1;
        m += 1;
      }
    }
    if(m > 12){
      y += 1;
      m = 1;
    }
    this.setData({
      date: y + '-' + m + '-' + d,
      curDate: y + '-' + m + '-' + d
    })

    var picker = [];
    const db = wx.cloud.database()
    db.collection("Label")
    .get()
    .then(res=>{
      console.log(res)
      for(var i = 0; i < res.data.length; i++) {
        picker.push(res.data[i].name);
      }
      this.setData({
        picker: picker,
        labelList: res.data,
      })
      console.log(picker)
      console.log(res.data)
    })
    .catch(console.error)
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:1
      })
    }
  },

  switchAddress: function(e){
    if(e.detail.value === false){
      this.setData({
        address:""
      })
    }
    this.setData({
      needAddress: e.detail.value
    })
  },

  switchAmount: function(e){
    if(e.detail.value === false){
      this.setData({
        member:-1
      })
    }
    this.setData({
      amountLimit: e.detail.value
    })
  },

  dateChange: function(e){
    this.setData({
      date: e.detail.value
    })
  },

  switchEndDate: function(e){
    this.setData({
      dateLimit: e.detail.value
    })
  },

  pickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  fill: function(e){
    this.setData({
      [e.currentTarget.id]: e.detail.value
    })
  },

  commit:function(e){
    this.setData({
      canClick: false
    })
    var regNum = new RegExp('(^[1-9][0-9]*$)|^0$','g')
    var that = this
    if(this.data.title === null){
      wx.showToast({
        title: '请输入队伍名称',
        icon: 'error'
      })
    }
    // else if(this.data.needAddress && this.data.address === ''){
    //   wx.showToast({
    //     title: '请输入详细地址',
    //     icon: 'error'
    //   })
    // }
    else if(this.data.amountLimit && regNum.exec(this.data.member) === null){
      console.log(this.data.member)
      console.log(regNum.exec(this.data.member) )
      wx.showToast({
        title: '请输入有效数字',
        icon: 'error'
      })
    }
    else if(this.data.index === -1){
      wx.showToast({
        title: '请选择队伍分类',
        icon: 'error'
      })
    }
    else{
      var that = this
      var app = getApp();
      const db = wx.cloud.database()
      const team = db.collection("Team")
      var now = new Date()
      team.add({
        data:{
          address:that.data.address,
          max:parseInt(that.data.member),
          label_id:that.data.labelList[that.data.index]._id,
          create_time:now,
          deadline:that.data.dateLimit ? new Date(that.data.date) : null,
          information:that.data.content,
          team_name:that.data.title,
          current_member:1,
          isOver:false,
          status:1,
          leader: app.globalData.userInfo._id,
          member_list: new Array(app.globalData.userInfo._id)
        },
        success:function(res){
          console.log(res)
          wx.cloud.callFunction({
            name:'login',
            data:{
              message:'helloCloud',
            }
          }).then(res2=>{
            db.collection("Member").add({
              data:{
                team_id:res["_id"],
                isLeader:true,
                member_id: app.globalData.userInfo._id
              },
              success:function(res2){
                wx.showToast({
                  title: '提交成功！',
                })
                setTimeout(function () {
                  //要延时执行的代码
                  wx.switchTab({
                    url: '../index/index'
                  });
                }, 1000) 
              },
              fail:function(res2){
                team.doc(res["_id"]).remove()
                wx.showToast({
                  title: '提交失败！',
                  icon:"loading"
                })
              }
            })
          })
        },
        fail:function(res){
          wx.showToast({
            title: '提交失败！',
            icon:"loading"
          })
        }
      })
      
    }
    this.setData({
      canClick: true
    })
  }
})