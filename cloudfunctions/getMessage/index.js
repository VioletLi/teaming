// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id } = event
  const $ = db.command.aggregate
  const _= db.command
  const message = await db.collection('Message').aggregate()
    .lookup({
      from: 'Receive',
      let: {
        messageidm: '$_id'
      },
      as: 'receive',
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$message_id', '$$messageidm']),
          $.eq(['$receive_id', id])
        ]))).project({
          _id: 1,
          isRead: 1
        }).done()
    })
    .match({
      receive: _.neq([])
    }
    )
    .lookup({
      from: 'Person',
      localField: 'announcer_id',
      foreignField: '_id',
      as: 'announcer'
    })
    .project({
      _id: 1,
      type: 1,
      time: $.dateToString({
        date: '$announce_time',
        format: '%Y-%m-%d'
      }),
      announcer_id: 1,
      team_id: 1,
      receive: 1,
      announcer: 1
    })
    .limit(100)
    .end()


  return {
    event,
    id,
    message: message,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}