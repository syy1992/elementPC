<template>
  <div class="app-container">
    <el-card class='mg-bot20 card '>
      <el-form :inline="true" :model="achievementObj" class="demo-form-inline min-width" >
        <el-form-item label="投保起期:">
          <!--<el-date-picker  v-model="chanObj.daterange" type="daterange" size='small' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">-->
          <!--</el-date-picker>-->
          <el-date-picker v-model="achievementObj.startDate" type="date" placeholder="选择日期" size='small'  value-format="yyyy-MM-dd" style='width: 180px' ></el-date-picker>
        </el-form-item>
        <el-form-item label="投保止期:">
          <el-date-picker v-model="achievementObj.endDate" type="date" placeholder="选择日期" size='small'  value-format="yyyy-MM-dd"  style='width: 180px' ></el-date-picker>
        </el-form-item>
        <el-form-item label="渠道:">
          <el-select v-model="achievementObj.channelNo" placeholder="请选择渠道" size="small" clearable>
            <el-option v-for="(item,index) in channelList" :key="index" :label="item.infoValue" :value="item.infoKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select v-model="achievementObj.productNo" placeholder="请选择产品" size="small" clearable>
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.infoValue"
              :value="item.infoKey">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <!--<el-button type="primary"  size="small" @click="onSubmit('product')">查询产品业绩</el-button>-->
          <el-button type="primary"  size="small" @click="onSubmit()">查询渠道业绩</el-button>
        </el-form-item>
      </el-form>

    </el-card>
      <el-card class='mg-bot20'>
      <div slot="header" class="clearfix">
        <span class='tit' style='line-height: 32px'><i class='iconfont icon-liebiao mg-right5'></i>渠道销售动态</span>
        <span class='gray' style='line-height: 32px'>·数据为实时统计 ·包含渠道及下级业务员数据 ·按照支付时间统计已成交数据</span>
        <!--<el-button size='small' type="primary" class='fl-r'>下载报表</el-button>-->
        <el-button size='small' class='fl-r mg-right10' @click='showTab=!showTab'>切换图表</el-button>

      </div>
        <chart   ref='chart2' :xAxisdata='xAxisdata2' :seriesdata1='ydata1'  :seriesdata2='ydata2' v-if='showTab'></chart>
        <el-table  v-loading="listLoading"   :data="list" element-loading-text="Loading"   border  fit
                   highlight-current-row :header-cell-style="{background:'#DFE6EC'}"  empty-text="暂无数据"  v-if='!showTab'>
          <el-table-column v-for="(col,index) in cols"  :prop="col.prop" :label="col.label" :key='index' align='center'  :width="col.width" :type='col.type'></el-table-column>
          <el-table-column  label="操作" width="240" align='center' >
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click='showChannelDetail(scope.row,scope.$index)'>查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
  import {commonList} from '../../utils/static'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import chart from "../dashboard/admin/components/achievementsChart.vue";
  export default {
    components: {
      ElButton,
      ElCard,
      chart
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          '1': '开启',
          '2': '关闭',
        };
        return statusMap[status]
      },
      priceFilter(pageviews){
        return pageviews.toFixed(2)
      }
    },
    data() {
      return {
        commonList:commonList,
        xAxisdata2:[
//            '晨阳','宁普','王安','王健'
        ],
        ydata1:[
//            60,37,49,71
        ],
        ydata2:[
//            89000,31600,56076,89871
        ],
        achievementObj:{
//          name:'',
          platNo:'',
          channelNo:'',
          policyNo:'',
          productNo:'',
          status:'',
          startDate:'',
          endDate:''
        },
        policyList: null,
        listLoading: true,

        channelList:[],
        productList:[],
        list:[],
        cols:[
          {prop:'',label: '序号',type:'index',width:'50'},
//          {prop: 'productName', label: '产品名称',width:'200'},
//          {prop: 'channelNo', label: '渠道编号'},
          {prop: 'channelName', label: '渠道名称'},
          {prop: 'salesmanCount', label: '业务员人数'},
//          {prop: 'salesName', label: '业务员姓名'},
          {prop: 'productCount', label: '产品数量'},
          {prop: 'policyCount', label: '保单数量'},
          {prop: 'premium', label: '保费'},
        ],
        showTab:false,
      }
    },
    created() {
      this.getChannelDic()
      this.getProductList()
      this.getChannelAchivement()
    },
    methods: {
      //获取产品列表
      getProductList(){
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/common/productDic';
        this.$http.post(url, {}).then((response) => {
          if (response.data.resCode === '0000') {
            this.productList=response.data.data;
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //获取渠道字典
      getChannelDic(){
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/common/channelDic';
        let platNo=JSON.parse(localStorage.userData).platformNo;
        let params={
          platNo:platNo
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.channelList=response.data.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //渠道业绩
      getChannelAchivement() {
        if(new Date(this.achievementObj.endDate).getTime()>0){
          if(new Date(this.achievementObj.startDate).getTime()>new Date(this.achievementObj.endDate).getTime()){
            this.$message.error('投保起期不能大于投保止期')
            return
          }
        }
        this.listLoading = true
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/contract/salesReport';
        let params={
          "startDate":this.achievementObj.startDate,
          "endDate":this.achievementObj.endDate,
          "channelNo":this.achievementObj.channelNo,
          "salesmanNo":"",
          "productNo":this.achievementObj.productNo,
          "dayNum":'',
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.listLoading = false
            this.list=response.data.data.report
            this.list.forEach((item,index)=> {
              this.xAxisdata2.push(item.channelName)
              this.ydata1.push(item.policyCount)
              this.ydata2.push(item.premium)
            })
            this.$refs.chart2.initChart(this.xAxisdata2,this.ydata1,this.ydata2)
//            this.totalCount=response.data.data.totalCount
          }
        }).catch(error => {
          console.log(error)
        })

      },
      addChannel(){},
      onSubmit(){
        this.getChannelAchivement()
      },
  //渠道详情
      showChannelDetail(row, index){
        this.$router.push({
          path:'/statistical/channelReportDetail',
          query:{
            "channelNo": row.channelNo
          }
        })
      },
    }
  }
</script>
<style scoped lang='scss'>
  .el-pagination{text-align: center;margin-top: 20px;}
  .el-form-item{margin-bottom: 0; }
  .iconfont{font-weight: bolder;color: #000;font-size: 18px}
  .gray{color: #858585;font-size: 12px;margin-left: 30px;display: inline-block;}
  .min-width{min-width:1440px;}
</style>
<style lang='scss'>

  /*.card {*/
    /*.el-form-item__label {*/
      /*line-height: 0;*/
    /*}*/
  /*}*/
</style>
