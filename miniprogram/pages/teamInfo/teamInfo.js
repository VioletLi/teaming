// miniprogram/pages/teamInfo/teamInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< HEAD
    info:[],
    userid:null,
    filt:false,
    btn:['我管理的队伍','所有队伍'],
    ind:0
=======
    tabs:[
      {
        id:0,
        value:"队伍信息",
        isActive:true
      },
      {
        id:1,
        value:"队伍成员",
        isActive:false
      }
    ],
    teaminfo:[],
    teammembers:[]

>>>>>>> f844991e0c5ff6d142595d040f134cc6f2846ce9
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取所有与自己相关的队伍存到data，待实现
    const {team_id}=options;
    // console.log(team_id);
    this.getteaminfo(team_id);
    this.getteammember(team_id);

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
      res.data.deadline=res.data.deadline.toLocaleDateString();
      res.data.create_time=res.data.create_time.toLocaleDateString();
      this.setData(
        {
          teaminfo:res.data
        }
      )
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
    const db = wx.cloud.database()
    //获取队伍member
    const members = db.collection('Member');
      members.where({
        team_id:options
      }).get()=>
        success:function(res){
          // console.log(res.data);
          var member_id_list=res.data;
          // console.log(member_id_list);
          for(var b=0;b<member_id_list.length;b++)
          {
            // console.log(member_id_list[b].member_id);
            
            that.getnickname(member_id_list[b].member_id);

          }
        }
      }
      )


<<<<<<< HEAD
  filter: function(){
    this.setData({
      filt:!this.data.filt,
      ind:1-this.data.ind
    })
  }
=======
    },
    
>>>>>>> f844991e0c5ff6d142595d040f134cc6f2846ce9
})