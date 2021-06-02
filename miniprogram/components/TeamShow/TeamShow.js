// components/TeamShow/TeamShow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    teaminfo:{
      type:Array,
      value:[],
      observer(val) {
        // 第一种方式通过参数传递的方式触发函数的执行
        this.setData({allteaminfo:val,teamtabinfo:val})
      }

    },
    tabs:{
      type:Array,
      value:[],
    },
    searched:{
      type:Boolean,
      value:false
    },
    loading:{
      type:Boolean,
      value:true
    },
    searchover:{
      type:Boolean,
      value:false
    },
    homepage:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    teamtabinfo:[],
    allteaminfo:[]

  },

  /**
   * 组件的方法列表
   */
  methods: {
  //   changeHidden: function(){
  //     this.setData({
  //         hidden: !this.data.hidden
  //     });
  // },



    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e){
      // var that=this;
      // 1 获取被点击的标题索引
      const {index}=e.detail;
      // 2 修改源数组
      let {tabs}=this.data;
      // 重新设置tamtabinfo
      var teamtabinfo=[];
      var allteaminfo=this.data.allteaminfo;
      console.log(allteaminfo);
      if (index==0){
        teamtabinfo=allteaminfo;
      }
      else{
        this.setData({loading:true});
        for(var a=0;a<allteaminfo.length;a++){
          if (allteaminfo[a].label_id==this.data.tabs[index]._id){
            teamtabinfo.push(allteaminfo[a]);
          }
        }
        
      this.setData({loading:false});
      }
      this.setData({
        teamtabinfo:teamtabinfo
      })
      
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      // 3 赋值到data中
      this.setData({
        tabs
      })
    } 
  },


})
