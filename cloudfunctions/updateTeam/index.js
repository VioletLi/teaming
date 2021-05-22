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
  const wxContext = cloud.getWXContext()

  // 组队成功/失败

  try {  //发送组队结果信息
    await db.collection('Team')
      .where({
        deadline:_.neq(null).and(_.lte(new Date())),
        isOver: false
      })
      .get()
      .then(res=>{
        var len = res.data.length
        const info = res.data
        for(var i = 0; i < len; i++) {
          var del = info[i]
          // 根据时间结束的一般都是失败了
          db.collection('Message').add({
            data:{
              announcer_id: del.leader,
              team_id: del._id,
              announce_time: new Date(),
              type: 3
            }
          })
          .then(res=>{
            for (var member = 0; member < del.member_list.length; member++) {
              db.collection('Receive').add({
                data: {
                  message_id: res._id,
                  isRead: false,
                  receive_id: del.member_list[member]
                }
              }).then(res5 => {
              }).catch(console.error)
            }
          })
          .catch(console.error)

          db.collection('Message')
          .where({
            team_id:del._id,
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
        }
      })
      .catch(console.error)

      db.collection('Team')
      .where({
        deadline:_.neq(null).and(_.lte(new Date())),
        isOver: false
      })
      .update({
        data: {
          isOver: true
        },
      })
    } catch(e) {
      console.error(e)
    }
}