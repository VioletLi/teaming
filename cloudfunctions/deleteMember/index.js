// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

var db = cloud.database();

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('Team').doc(event.team_id).update({
    data: {
      current_member: _.inc(-1)
    }
  })
  .then(res=>{
    db.collection('Member').where({
      team_id: event.team_id,
      member_id: _.in(event.deleteList)
    }).remove()
  })
  .catch(console.error)
}