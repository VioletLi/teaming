//index页面
//使用promise
// import{request} from "../../request/index.js"
const app = getApp();
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
    this.getUserProfile();

    this.getteaminfo();  
    var that = this  
    const db = wx.cloud.database();
    db.collection("Label").get()
    .then(res=>{

      that.setData({
        tabs: res.data
      })
    })



   
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
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




  // 获取队伍信息的函数
  getteaminfo()
  {
    var that=this;
    const db = wx.cloud.database();
    const team = db.collection('Team');

    team.where({
      isOver: false
    }).get().then(res=>{
        for(var a=0;a<res.data.length;a++)
        {
          //日期转换
          if (res.data[a].deadline != null)
            res.data[a].deadline=res.data[a].deadline.toLocaleDateString();
          //获取首页图片
          if(res.data[a].pic_list!=null&&res.data[a].pic_list[0]!=null)
            res.data[a].picture=res.data[a].pic_list[0];
          else
            res.data[a].picture="https://wx3.sinaimg.cn/mw1024/008gNS3Fly1gr4741peyrj31400u0k0r.jpg";
          
        }
        this.setData({
            teaminfo:res.data,
          })
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



