// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

var db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const member = await db
    .collection("Member")
    .aggregate()
    .match({
      team_id : event.team_id
    })
    .lookup({
      from: 'Person',
      localField: 'member_id',
      foreignField: '_id',
      as: 'info',
    })
    .end()
    .then()
    .catch();

    const team = await db
    .collection("Team")
    .doc(event.team_id)
    .get();

    console.log(member)

  return {
    member: member,
    team: team
  }
}