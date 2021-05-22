//index页面
//使用promise
import{request} from "../../request/index.js"
const app = getApp()
Page({
  data: {
    // 队伍信息
    teaminfo:[],
    // 用户的地理位置【暂定】
    // userglobe:"",
    userID: '28ee4e3e60867cd612781c4e6bd0ae26',

    tabs:[],

    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  //加载时发生：判断本地存储，获取队伍信息
  onLoad: function() {

    
    //根据当前用户，判断加载全部还是个人队伍页面
    //这里先加载全部
    this.getteaminfo();  
    var that = this  
    const db = wx.cloud.database()
    db.collection("Label").get()
    .then(res=>{
      console.log(res.data)
      that.setData({
        tabs: res.data
      })
    })


    this.getUserProfile()
   
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  onShow: function() {
    this.getteaminfo();  
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected:0
      })
    }
  },



  //获取当前人数的函数
  getmembernumber(team_id){
    var that = this;
    const db = wx.cloud.database();
    //获取队伍member
    const members = db.collection('Member');
      members.where({
        team_id:team_id
      }).get({
        success:function(res){
          return res.data.length;
        }
      })
    },

  // 获取队伍信息的函数
  //修改1：增加参数
  getteaminfo()
  {

    console.log("ddddddddddd");
    // const db = wx.cloud.database();
    // const teams = db.collection('Team');
    // // var team_ids=[];
    // teams.get().then(res=>{
    //   console.log(res);
    //   // console.log(res.data[0].deadline.toLocaleDateString());
    //   for(var a=0;a<res.data.length;a++)
    //   {
    //     res.data[a].deadline=res.data[a].deadline.toLocaleDateString();
    //     // team_ids.push(res.data[a]._id);
    //   }

    var that=this;
    const db = wx.cloud.database();
    const team = db.collection('Team');

    //条件1：全部
    team.where({
      isOver: false
    }).get().then(res=>{
        for(var a=0;a<res.data.length;a++)
        {
          //日期转换
          if (res.data[a].deadline != null)
            res.data[a].deadline=res.data[a].deadline.toLocaleDateString();
          //获取当前队员人数
          // res.data[a].current_member=that.getmembernumber(res.data[a]._id);
        }
        this.setData({
            teaminfo:res.data,
          })
          console.log(res.data)
      })
      .catch(err=>{
        console.log(err);
      })

    },

  
      


  // 页面下拉刷新，即执行getteaminfo
  onPullDownRefresh: function()
  {
    this.getteaminfo();
  },

})



