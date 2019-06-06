<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span class='tit' style='line-height: 32px'><i class='iconfont icon-liebiao mg-right5'></i>产品销量报表详情</span>
        <!--<span class='gray' style='line-height: 32px'>· 数据为实时统计</span>-->
      </div>
      <el-table  v-loading="listLoading"   :data="list" element-loading-text="Loading"   border  fit
                 highlight-current-row :header-cell-style="{background:'#DFE6EC'}"  empty-text="暂无数据">
        <el-table-column v-for="(col,index) in cols"  :prop="col.prop" :label="col.label" :key='index' align='center'  :width="col.width" :type='col.type'></el-table-column>
      </el-table>
      <!--<el-pagination v-if='list.length!=0'-->
                     <!--@size-change="handleSizeChange"-->
                     <!--@current-change="handleCurrentChange"-->
                     <!--:current-page="currentPage"-->
                     <!--background-->
                     <!--layout="prev, pager, next"-->
                     <!--:total="totalCount">-->
      <!--</el-pagination>-->
    </el-card>

  </div>
</template>

<script>
  import {commonList} from '../../utils/static'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  import qs from 'qs'
  export default {
    components: {
      ElCard},
    filters: {
      formatStatus: function (val) {
//        console.log(val)
        let text=''
        commonList.policyStatus.forEach((item,index) => {
          if (val==item.infoKey){
            text=item.infoValue
          }
          if (val==''||val==null){
            text='/'
          }
        })
        return text
      },
      formatMoney:function (val) {
        return val==''||val==null?  '/' : val.toFixed(2)
      },
      formatNull:function (val) {
        return val==''||val==null?  '/' : val
      },
    },
    data() {
      return {
//        totalCount:0,
//        currentPage:1,
//        pageSize:10,
        listLoading: true,
        list:[],
        cols:[
          {prop:'',label: '序号',type:'index',width:'50'},
          {prop: 'productName', label: '产品名称',width:'200'},
//          {prop: 'channelNo', label: '渠道编号'},
          {prop: 'channelName', label: '渠道名称'},
          {prop: 'salesmanCount', label: '业务员人数'},
//          {prop: 'salesName', label: '业务员姓名'},
//          {prop: 'productCount', label: '产品数量'},
          {prop: 'policyCount', label: '保单数量'},
          {prop: 'premium', label: '保费'},
        ],
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(){
        let splitObj=location.href.split('?')[1];
        this.listLoading=true
        let url = process.env.BASE_URL + process.env.commonPort + '/dingPC/contract/productReportDetails';
        let params = {
          "startDate": '',
          "endDate": '',
          "channelNo": '',
          "salesmanNo": "",
          "productNo":qs.parse(splitObj).productNo, //需要传值的
          "dayNum": '',
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.listLoading=false
            this.list=response.data.data
//            this.totalCount=response.data.data.totalCount
          }

        }).catch(error => {
//            this.loading = false
          console.log(error)
        })
      },
//      handleSizeChange(val) {
//        console.log(`每页 ${val} 条`);
//      },
//      //点击当前页码请求数据
//      handleCurrentChange(val) {
//        console.log(`当前页: ${val}`);
//        this.currentPage=val
//        this.fetchData()
//      },
//      getVal(val){
//        let a=new Date(val)
//        console.log(a.getTime())
//      },
//      getVal2(val){
//        let b=new Date(val)
//        console.log(b.getTime())
//      }
    }
  }
</script>
<style scoped lang='scss'>
  .el-pagination{text-align: center;margin-top: 20px;}
  .el-form-item{margin-bottom: 0; }
  .iconfont{font-weight: bolder;color: #000;font-size: 18px}
  .gray{color: #858585;font-size: 12px;margin-left: 30px;display: inline-block;}
  /*.min-width{min-width:1440px;}*/
</style>
<style lang='scss'>

  .card {
    .el-form-item__label {
      line-height: 0;
    }
  }
</style>
