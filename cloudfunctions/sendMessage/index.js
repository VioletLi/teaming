// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const {type, announcer_id, receive_id, team_id} = event
  return await db.collection('Messaage').add({
    data: {
      type: type,
      announce_time:db.serverDate(),
      announcer_id: announcer_id,
      team_id: team_id
    }
  }).then(res => {
    const messageid = res._id
    db.collection('Receive').add({
      data: {
        message_id: messageid,
        isRead: false,
        receive_id: receive_id
      }
    }).then(res => {
    }).catch(console.error)
  }).catch(console.error)
}