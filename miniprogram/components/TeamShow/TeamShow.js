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
        // this.logInfo();
        // console.log(val);
        this.setData({allteaminfo:val,teamtabinfo:val})
      }

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
// 0. 全部
// 1. 学习
// 2. 锻炼
// 3. 吃喝
// 4. 购物
// 5. 娱乐
// 6. 其它
    tabs:[{
      id: 0,
      value: "全部",
      isActive: true
    },
    {
      id: 1,
      value: "学习",
      isActive: false
    },
    {
      id: 2,
      value: "锻炼",
      isActive: false
    },
    {
      id: 3,
      value: "吃喝",
      isActive: false
    },
    {
      id: 4,
      value: "购物",
      isActive: false
    },
    {
      id: 5,
      value: "娱乐",
      isActive: false
    },
    {
      id: 6,
      value: "其它",
      isActive: false
    },
    {
      id: 7,
      value: "其它2",
      isActive: false
    },
    {
      id: 8,
      value: "其它3",
      isActive: false
    }
    ],
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
      // console.log(that.data.teamtabinfo);
      // 1 获取被点击的标题索引
      const {index}=e.detail;
      // 2 修改源数组
      let {tabs}=this.data;
      // 重新设置tamtabinfo
      var teamtabinfo=[];
      var allteaminfo=this.data.allteaminfo;
      if (index==0){
        teamtabinfo=allteaminfo;
      }
      else{
        this.setData({loading:true});
        for(var a=0;a<allteaminfo.length;a++){
          if (allteaminfo[a].label_id==index-1){
            console.log(allteaminfo[a]);
            teamtabinfo.push(allteaminfo[a]);
          }
        }
        
      this.setData({loading:false});
      }
      // console.log(teamtabinfo);
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
