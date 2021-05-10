// 专门放请求
export const request=(params)=>{
    return new Promise((resolve,reject)=>{
      wx.request({
        success:(result)=>{
          resolve(result);
        },
        fail:(err)=>{
          reject(err)
        }
      });
    })
  }