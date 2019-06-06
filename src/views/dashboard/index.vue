<template>
  <div class="dashboard-container">
    <!--<panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>-->
    <panel-group @getHomeData="handleHomeData" :dayData='homeData'></panel-group>
    <!--<div class="dashboard-text">name:{{ name }}</div>-->
    <!--<div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class='box-card-tit'>保费趋势</span>
          <div class='dateBtnGroup'>
            <a :class='{dateBtn:true,ac:item.key==dateSelected}' v-for='(item,index) in dateList.slice(1,3)' :key='index' @click='changeDateBtn(item.key)' >{{item.value}}</a>
          </div>
        </div>
        <el-row>
          <line-chart :chart-data="lineChartData" ref='lineChartDataRef'></line-chart>
          <div v-show='lineChartData.premiumList.length==0' class='noData' style='width: 100%;height: 300px;text-align: center;display: flex;justify-content: center;align-items: center;position: absolute;z-index: 1000;top:0;background: #fff'><div>暂无统计数据</div></div>
        </el-row>
      </el-card>

    <el-row :gutter="32" style='margin-top: 20px'>

      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card" >

          <div slot="header" class="clearfix">
            <span class='box-card-tit'>热门产品</span>
            <div class='dateBtnGroup'>
              <a :class='{dateBtn:true,ac:item.key==dateSelected1}' v-for='(item,index) in dateList' :key='index' @click='changeDateBtn1(item.key)' >{{item.value}}</a>
            </div>
          </div>
          <div class="chart-wrapper" style='position: relative'>
            <pie-chart :productNameList='productNameList' ref='productRef' :productList='productList'></pie-chart>
            <div v-show='productList.length==0' class='noData' style='width: 100%;height: 300px;text-align: center;display: flex;justify-content: center;align-items: center;position: absolute;z-index: 1000;top:0'><div>暂无统计数据</div></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" class='m20'>
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span class='box-card-tit'>{{role | formatStatus}}</span>
          <div class='dateBtnGroup'>
            <a :class='{dateBtn:true,ac:item.key==dateSelected2}' v-for='(item,index) in dateList' :key='index' @click='changeDateBtn2(item.key)' >{{item.value}}</a>
          </div>
        </div>
        <div class="chart-wrapper">
            <box-card :rankList='rank' :colorList='color' ></box-card>
        </div>
      </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './admin/components/PanelGroup'
import LineChart from './admin/components/LineChart'
import PieChart from './admin/components/PieChart'
import BoxCard from './admin/components/BoxCard'
//const lineChartData = {
//  newVisitis: {
//    expectedData: [100, 120, 161, 134, 105, 160, 165],
//    actualData: [120, 82, 91, 154, 162, 140, 145]
//  },
//
////  messages: {
////    expectedData: [200, 192, 120, 144, 160, 130, 140],
////    actualData: [180, 160, 151, 106, 145, 150, 130]
////  },
////  purchases: {
////    expectedData: [80, 100, 121, 104, 105, 90, 100],
////    actualData: [120, 90, 100, 138, 142, 130, 130]
////  },
////  shoppings: {
////    expectedData: [130, 140, 141, 142, 145, 150, 160],
////    actualData: [120, 82, 91, 154, 162, 140, 130]
////  }
//}
export default {
  filters: {
    formatStatus: function (val) {
      let text=''
        if (val==1){
          text='渠道销量'
        }
        if (val==2){
          text='业务员销量'
        }
      return text
    }
  },
  name: 'Dashboard',
  components:{
    PanelGroup,
    LineChart,
    PieChart,
    BoxCard
  },
  data(){
  return {
//    lineChartData: lineChartData.newVisitis,
    lineChartData: {
      timeList:[],
      premiumList:[]
    },
    listLoading: true,
    dateList:[
      {key:1,value:'日'},
      {key:7,value:'周'},
      {key:30,value:'月'},
    ],
    dateSelected:30,
    dateSelected1:30,
    dateSelected2:30,
    homeData:{},
    rank:[
//      {name:'宁普',count:70},
//      {name:'钟尧',count:56},
    ],

    color:['#2fbbf9','#f03333','#256789','#B6A2DE','#edf666'],
    productNameList: [],
    productList:[],
    role:JSON.parse(localStorage.userData).userType,
  }
},

  methods:{
    handleHomeData(){
      let url = process.env.BASE_URL + process.env.commonPort + '/dingPC/common/homeData';
      this.$http.post(url, {}).then((response) => {
//            console.log(response.data.data)
        if (response.data.resCode == '0000') {
          this.homeData = response.data.data
        }
      }).catch((error) => {
        console.log(error)
      })
    },
//    handleSetLineChartData(){
//      this.lineChartData = lineChartData[type]
//    },
    changeDateBtn(index){
       this.dateSelected=index;
       this.getPremiumReportDetails()
    },
    changeDateBtn1(index){
       this.dateSelected1=index
       this.getProductReportDetails()
    },
    changeDateBtn2(index){
      this.dateSelected2=index
      this.getChannelReportDetails()
    },
    //渠道销量(业务员）
    getChannelReportDetails(){
      this.listLoading=true
      this.rank=[];
        let url=process.env.BASE_URL + process.env.commonPort + '/dingPC/contract/salesReport';
        let params={
          "dayNum":this.dateSelected2, //360,
          "startDate":"",
          "endDate":"",
          "channelNo":JSON.parse(localStorage.userData).channelNo,
          "salesmanNo":JSON.parse(localStorage.userData).salesmanNo,
          "productNo":""
        }
      this.$http.post(url, params).then((response) => {
        if (response.data.resCode == '0000') {
          this.listLoading=false
          for(let i=0;i<response.data.data.report.length;i++){
                let obj={};
                if(response.data.data.report>5){
                    return
                }else {
                    if(this.role==1){
                      obj.name= response.data.data.report[i].channelName
                    }
                    if(this.role==2){
                      obj.name= response.data.data.report[i].salesName
                    }
                  obj.count= parseFloat(response.data.data.report[i].premium/response.data.data.sumPremium*100).toFixed(2)*1
//                  obj.count=0
//                  let time=1000
//                  let aa=parseFloat(response.data.data.report[i].premium/response.data.data.sumPremium*100).toFixed(2)*1
//                  let speed =aa*100/time
//                  console.log(speed)
//                  let timer=setInterval(function(){
//                    obj.count+=speed
//                    if(aa==obj.count){
//                       clearInterval(timer)
//                    }
//                  },time)
                }
            this.rank.push(obj)
          }
        }
      }).catch((error) => {
        console.log(error)
      })

    },
    //产品销量
    getProductReportDetails(){
      this.productList=[];
        let url=process.env.BASE_URL + process.env.commonPort + '/dingPC/contract/productReport';
        let params={
          "dayNum":this.dateSelected1,
          "startDate":"",
          "endDate":"",
          "channelNo":JSON.parse(localStorage.userData).channelNo,
          "salesmanNo":JSON.parse(localStorage.userData).salesmanNo,
          "productNo":""
        }
      this.$http.post(url, params).then((response) => {
        if (response.data.resCode == '0000') {
          let hotTop5=response.data.data.report.splice(0,5);//取销量前5的
          for(let i=0;i<hotTop5.length;i++){
//          for(let i=0;i<response.data.data.report.length;i++){
            let obj = {};
//            obj.name = response.data.data.report[i].productName
//            obj.value = response.data.data.report[i].premium
            obj.name = hotTop5[i].productName
            obj.value = hotTop5[i].premium
            this.productList.push(obj)
            this.productNameList.push(obj.name)
            }
          this.$refs.productRef.initChart(this.productNameList,this.productList);
        }
      }).catch((error) => {
        console.log(error)
      })

    },
    //保费趋势
    getPremiumReportDetails(){
      this.lineChartData.timeList=[];
      this.lineChartData.premiumList=[];
      let url=process.env.BASE_URL + process.env.commonPort + '/dingPC/contract/premiumTrend';
      let params={
        "dayNum":this.dateSelected, //this.dateSelected
        "startDate":"",
        "endDate":"",
        "channelNo":JSON.parse(localStorage.userData).channelNo,
        "salesmanNo":JSON.parse(localStorage.userData).salesmanNo,
        "productNo":""
      }
      this.$http.post(url, params).then((response) => {
//          this.lineChartData=
        if (response.data.resCode == '0000') {
          for(let i=0;i<response.data.data.length;i++){
            let obj = {};
            obj.timeList = response.data.data[i].createDate
            obj.premiumList = response.data.data[i].premium
            this.lineChartData.timeList.push(obj.timeList)
            this.lineChartData.premiumList.push(obj.premiumList)
//            this.productNameList.push(obj.name)
          }
          this.$refs.lineChartDataRef.initChart(this.lineChartData);
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
  },
  created(){
      this.handleHomeData()
      this.getChannelReportDetails()
      this.getPremiumReportDetails()
      this.getProductReportDetails()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .dateBtnGroup{
      float: right;
      .dateBtn{
        margin-left: 8px;background: #fff;color: #0987E7;padding: 3px 15px;border-radius: 20px;font-size: 12px;border: 1px solid #0987E7;
      }
      .ac{
        background: #0987E7;color: #fff;border: 1px solid #0987E7;
      }
    }
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }

}
.box-card-tit{
  display: inline-block;
  position: relative;
  margin-left: 6px;
  &:after{width: 2px;height: 18px;background:#0987E7;position: absolute;left:-6px;top:0; content:""; }
}
@media screen and (max-width:1200px)  {
  .m20{margin-top: 20px}
}
</style>
