// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const {announcer_id, team_id, member_id, type} = event
  // return await db.collection('Member').add({
  //   data: {
  //     isLeader: false,
  //     team_id: team_id,
  //     member_id: member_id
  //   }
  // }).then(res => {
  //   db.collection('Message').add({
  //     data: {
  //       type: type,
  //       announce_time: db.serverDate(),
  //       announcer_id: announcer_id,
  //       team_id: team_id
  //     }
  //   }).then(res => {
  //     const messageid = res._id
  //     db.collection('Receive').add({
  //       data: {
  //         message_id: messageid,
  //         isRead: false,
  //         receive_id: member_id
  //       }
  //     }).then(res => {
  //     }).catch(console.error)
  //   }).catch(console.error)
  // }).catch(console.error)


  return await db.collection('Team').where({
    _id: team_id,
    isOver: false,
  })
  .get()
  .then(res => {
    var max = res.data[0].max;
    var cur = res.data[0].current_member;
    const member_list = res.data[0].member_list;
      if (res.data[0].member_list.indexOf(member_id) == -1 && (max == -1 || res.data[0].current_member < max)) {
        db.collection('Team').where({
          _id: team_id,
        })
        .update({
          data: {
            current_member: _.inc(1),
            member_list: _.push([member_id])
          }
        })
        .then(res2=>{
          cur = cur + 1;
          if (res2.stats.updated != 0) {
            db.collection('Member').add({
                data: {
                  isLeader: false,
                  team_id: team_id,
                  member_id: member_id
                }
              }).then(res3 => {
                db.collection('Message').add({
                  data: {
                    type: type,
                    announce_time: db.serverDate(),
                    announcer_id: announcer_id,
                    team_id: team_id
                  }
                }).then(res4 => {
                  const messageid = res4._id
                  db.collection('Receive').add({
                    data: {
                      message_id: messageid,
                      isRead: false,
                      receive_id: member_id
                    }
                  }).then(res5 => {
                  }).catch(console.error)
                }).catch(console.error)
              }).catch(console.error)
            
          }
          //如果人满了，要发送组队完成信息
          if (max == cur) {
            //还要让这个队伍的申请都过期
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
                  announcer_id: announcer_id,
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
        }).catch(console.error)
      }
  }).catch(console.error)

}