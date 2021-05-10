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
  },
  //加载时发生：判断本地存储，获取队伍信息
  onLoad: function() {
    //根据当前用户，判断加载全部还是个人队伍页面
    //这里先加载全部
    //
    this.getteaminfo(0);
   
  },
  //获取当前人数的函数
  // getmembernumber(team_id){
  //   // var that = this;
  //   const db = wx.cloud.database();
  //   //获取队伍member
  //   const members = db.collection('Member');
  //   var member_num=0;
  //   members.where({
  //     team_id:team_id
  //   }).get().then(res=>{
  //       console.log("dd",res.data.length);
  //       member_num=res.data.length;
  //       return member_num;
  //     }
  //   )
    // return member_num;
      // console.log("mna=",member_num);
      
    // },

  // 获取队伍信息的函数
  //修改1：增加参数
  getteaminfo(condition)
  {
    var that=this;
    const db = wx.cloud.database()
    const team = db.collection('Team');
    const members = db.collection('Member');

    //条件1：全部
    if(condition=="0"){
      team.get().then(res=>{
        for(var a=0;a<res.data.length;a++)
        {
          //日期转换
          res.data[a].deadline=res.data[a].deadline.toLocaleDateString();
          //获取当前队员人数
          // var member_list=await members.where({team_id:res.data[a]._id}).get()
          //     console.log(member_list)
          //     res.data[a].current_member=member_list;
        }
        this.setData({
            teaminfo:res.data,
          })
      })
      .catch(err=>{
        console.log(err);
      })

    }
      //用当前用户id查找
      else{
        const member=db.collection('Member');
        // const person=db.collection('Person');
        member.where({
          member_id:condition
        }).get().then(res=>{
          // 成功
          console.log(res.data);
          var team_id_list=res.data._id;
          var team_list=[];
          for(var a=0;a<team_id_list.length;a++)
          {
            team.where({
              _id:team_id_list[a]
            }).get().then(
              res=>{
                // console.log(res.data);
                 //日期转换
                  res.data.deadline=res.data.deadline.toLocaleDateString();
                  //获取当前队员人数
                  // res.data.current_member=that.getmembernumber(res.data._id);
                team_list.push(res.data);
              }
            )
          }
          //循环结束
          console.log(team_list);
          that.setData({teaminfo:team_list});
        })
        .catch(err=>{
          console.log(err);
        })

      }



  },
      


  // 页面下拉刷新，即执行getteaminfo
  onPullDownRefresh:function()
  {
    this.getteaminfo();
  },
})



