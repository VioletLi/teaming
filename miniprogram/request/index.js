// 专门放请求
export const request=(params)=>{
    // baseurl
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
      wx.request({
        ...params,
        url:baseUrl+params.url,
        success:(result)=>{
          resolve(result);
        },
        fail:(err)=>{
          reject(err)
        }
      });
    })
  }