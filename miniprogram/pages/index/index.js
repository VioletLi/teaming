//index页面
//使用promise
// import{request} from "../../request/index.js"
const app = getApp()
Page({
  data: {
    // 队伍信息
    teaminfo:[],
    // 用户的地理位置【暂定】
    // userglobe:"",
    loading:false,
  },
  //加载时发生：判断本地存储，获取队伍信息
  onLoad: function() {
    this.getteaminfo();
   
  },
  

  // 获取队伍信息的函数
  async getteaminfo()
  {
    var that=this;
    const db = wx.cloud.database()
    const team = db.collection('Team');
    // const members = db.collection('Member');

    this.setData({loading:true});
      await team.get().then(res=>{
        for(var a=0;a<res.data.length;a++)
        {
          //日期转换
          res.data[a].deadline=res.data[a].deadline.toLocaleDateString();
          
        }
        this.setData({
            teaminfo:res.data,
          })
      })
      .catch(err=>{
        console.log(err);
      })
      this.setData({loading:false});

    },
      // //用当前用户id查找
      // else{
      //   const member=db.collection('Member');
      //   // const person=db.collection('Person');
      //   member.where({
      //     member_id:condition
      //   }).get().then(res=>{
      //     // 成功
      //     console.log(res.data);
      //     var team_id_list=res.data._id;
      //     var team_list=[];
      //     for(var a=0;a<team_id_list.length;a++)
      //     {
      //       team.where({
      //         _id:team_id_list[a]
      //       }).get().then(
      //         res=>{
      //           // console.log(res.data);
      //            //日期转换
      //             res.data.deadline=res.data.deadline.toLocaleDateString();
      //             //获取当前队员人数
      //             // res.data.current_member=that.getmembernumber(res.data._id);
      //           team_list.push(res.data);
      //         }
      //       )
      //     }
      //     //循环结束
      //     console.log(team_list);
      //     that.setData({teaminfo:team_list});
      //   })
      //   .catch(err=>{
      //     console.log(err);
      //   })

      // }




      


  // 页面下拉刷新，即执行getteaminfo
  onPullDownRefresh:function()
  {
    this.getteaminfo();
  },
})



