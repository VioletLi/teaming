//app.js
App({
  onLaunch: function () {

    

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'xn-5gcwwat3f1925c4f',
        env: 'teaming-1g9mzhby405cea51',
        traceUser: true,
      })

      var that = this

      wx.cloud.callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: {
        },
        success: function(res) {
          console.log(res)
          const db = wx.cloud.database()
          db.collection("Person").where({
            _openid: res.result
          })
          .get()
          .then(res=>{
            if (res.data.length == 0) {
              wx.showModal({
                title: '提示',
                content: '申请获得用户头像和用户名',
                showCancel:false,
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.getUserInfo({
                      lang: "zh-CN",
                      success: function(res) {
                        console.log(res)
                        db.collection("Person").add({
                          data:{
                            avatar: res.userInfo.avatarUrl,
                            nickname: res.userInfo.nickName
                          }
                        })
                        .then(res=>{
                          that.globalData.userInfo = res.data
                        })
                      }
                    })
                  } 
                }
              })
            }
            else {
              that.globalData.userInfo = res.data[0]
            }
          })
        },
        fail: console.error
      })
    }

    this.globalData = {
      // userInfo: {
      //   _id: "cbddf0af60867d3e03cfa00d475f51de",
      //   avatar: "../../images/code-cloud-callback-config.png",
      //   nickname: "ewreg"
      // }
      userInfo: {
        _id: "79550af260880300118e88ea5b62a607",
        avatar: "../../images/code-cloud-callback-config.png",
        nickname: "wgfvregqreg"
      }
    }
    // wx.getSystemInfo({
    //   success: e => {
    //     this.globalData.StatusBar = e.statusBarHeight;
    //     let capsule = wx.getMenuButtonBoundingClientRect();
		// if (capsule) {
		//  	this.globalData.Custom = capsule;
		// 	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		// } else {
		// 	this.globalData.CustomBar = e.statusBarHeight + 50;
		// }
    //   }
    // })
  }
})
