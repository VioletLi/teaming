// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
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
          $.eq(['$receive_id', "17453ede608f58e1067ec12278c8a324"])
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
      team_id: 1,
      receive: 1,
      announcer: 1
    })
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