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
  },
  //加载时发生：判断本地存储，获取队伍信息
  onLoad: function() {
    //根据当前用户，判断加载全部还是个人队伍页面
    //这里先加载全部
    //
    this.getteaminfo();
   
  },

  //获取当前人数的函数
  getmembernumber(team_id){
    var that = this;
    const db = wx.cloud.database();
    //获取队伍member
    const members = db.collection('Member').where({
        team_id:team_id
      }).count({
        success: function(res) {
          console.log(res.total)
          return res.total
        },
        fail: console.error
      })
    },

  // 获取队伍信息的函数
  //修改1：增加参数
  getteaminfo()
  {
    var that=this;
    const db = wx.cloud.database();
    const team = db.collection('Team');
    const userID = this.data.userID;

    //条件1：全部
    
        // const member=db.collection('Member');
        // const person=db.collection('Person');
        
        db.collection('Member').where({
          member_id: userID
        }).get({
          success:function(res){
          var team_id_list=res.data;
          var team_list=[];
          for(var a=0;a<team_id_list.length;a++)
          {
            console.log(team_id_list[a].team_id)
            team.where({
              _id:team_id_list[a].team_id
            }).get().then(
              res=>{
                 //日期转换
                  res.data[0].deadline=res.data[0].deadline.toLocaleDateString();
                  //获取当前队员人数
                  // res.data[0].current_member=that.getmembernumber(res.data[0]._id);
                  console
                team_list.push(res.data[0]);
                that.setData({teaminfo:team_list});
                console.log(team_list);
              }
            )
          }
          //循环结束
          // console.log(team_list);
          // that.setData({teaminfo:team_list});
          }
          // 成功
          
        })

      

    },

  
      


  // 页面下拉刷新，即执行getteaminfo
  onPullDownRefresh: function()
  {
    this.getteaminfo();
  },

})



