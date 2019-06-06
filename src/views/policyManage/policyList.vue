<template>
  <div class="app-container">
    <el-card class='mg-bot20 card '>
      <el-form :inline="true" :model="chanObj" class="demo-form-inline min-width">
          <el-form-item label="投保起期:">
            <el-date-picker v-model="chanObj.startDate" type="date" placeholder="选择日期" size='small' @change='getVal' value-format="yyyy-MM-dd"  class='w140'></el-date-picker>
          </el-form-item>
          <el-form-item label="投保止期:">
            <el-date-picker v-model="chanObj.endDate" type="date" placeholder="选择日期" size='small'  value-format="yyyy-MM-dd"  @change='getVal2' class='w140'></el-date-picker>
          </el-form-item>
        <el-form-item label="渠道:">
          <el-select v-model="chanObj.channelNo" placeholder="请选择渠道" size="small" clearable  class='w140'>
            <el-option
              v-for="(item,index) in channelList"
              :key="index"
              :label="item.infoValue"
              :value="item.infoKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称:">
          <el-select v-model="chanObj.productNo" placeholder="请选择" size="small" clearable  class='w140'>
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.infoValue"
              :value="item.infoKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保单号:">
          <el-input v-model="chanObj.policyNo" placeholder="输入保单号" size="small" clearable  class='w140'></el-input>
        </el-form-item>
        <el-form-item label="保单状态:">
          <el-select v-model="chanObj.policyStatus" placeholder="请选择" size="small" clearable  class='w140'>
            <el-option
              v-for="(item,index) in commonList.policyStatus"
              :key="index"
              :label="item.infoValue"
              :value="item.infoKey">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <!--<el-button type="primary"  size="small" @click="addChannel">新增</el-button>-->
          <el-button type="primary"  size="small" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span class='tit' style='line-height: 32px'><i class='iconfont icon-liebiao mg-right5'></i>保单管理</span>
        <span class='gray' style='line-height: 32px'>· 数据为实时统计 ·按照支付时间统计已成交数据
          <span style='margin-left: 20px;'>
            <b class='mg-right5'>保单数量：<span class='blue'>{{totalCount}}</span> 单</b>
            <b class='mg-right5'>保费：<span class='blue'>{{contractSumPremium | formatMoney}}</span> 元</b>
          </span>
        </span>
        <el-button size='small' type="primary" class='fl-r' @click='getFormInfo'>导出报表</el-button>
      </div>

      <el-table  v-loading="listLoading"   :data="policyList" element-loading-text="Loading"   border  fit  highlight-current-row :header-cell-style="{background:'#DFE6EC'}"  empty-text="暂无数据" >
        <!--<el-table-column v-for="(col,index) in cols"  :prop="col.prop" :label="col.label" :key='index' align='center'  :width="col.width" :type='col.type' >-->
        <!--</el-table-column>-->
        <el-table-column label="序号" width="50" align='center' type="index">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="保单号" width="150" align='center'>
          <template slot-scope="scope">
            {{scope.row.policyNo | formatNull}}
          </template>
        </el-table-column>
        <el-table-column label="方案名称" width="180" align='center'>
          <template slot-scope="scope">
            {{scope.row.planName | formatNull}}
          </template>
        </el-table-column>
        <!--<el-table-column label="保额" width="110" align='center'>-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.amount | formatMoney}}-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column label="保费" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.premium | formatMoney}}
          </template>
        </el-table-column>

        <el-table-column label="投保人" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.applicantName | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  prop="insuranceName" label="被保人" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.insuranceName | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  prop="channelName" label="渠道名称" align='center'>
          <template slot-scope="scope">
            {{scope.row.channelName | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  prop="salesmanName" label="业务员" align='center'>
          <template slot-scope="scope">
            {{scope.row.salesmanName | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  prop="policyStatus" label="保单状态" align='center'>
          <template slot-scope="scope">
            {{scope.row.policyStatus | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column  prop="createTime" label="投保时间" align='center'>
          <template slot-scope="scope">
            {{scope.row.createTime | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  prop="startTime" label="保险起期" align='center'>
          <template slot-scope="scope">
            {{scope.row.startTime | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  prop="endTime" label="保险止期" align='center'>
          <template slot-scope="scope">
            {{scope.row.endTime | formatNull}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="160" align='center' >
          <template slot-scope="scope" >
           <a :href='scope.row.policyUrl' v-if='scope.row.policyUrl' target='_blank' class='blue'>下载保单</a>
           <a  v-else='scope.row.policyUrl'>/</a>
          </template>

        </el-table-column>
      </el-table>



      <el-pagination v-if='policyList.length!=0'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        background
        layout="prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
//  import { getList2 } from '@/api/table'
  import {commonList} from '../../utils/static'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default {
    components: {
      ElButton,
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
      statusFilter(status) {
        const statusMap = {
          '0': '开启',
          '1': '开启',
//        published: 'success',
//        draft: 'gray',
//        deleted: 'danger'
        };
        return statusMap[status]
      },
      priceFilter(pageviews){
        return pageviews.toFixed(2)
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
        contractSumPremium:0,
        totalCount:0,
        currentPage:1,
        pageSize:10,
        commonList:commonList,
        chanObj:{
          channelNo:'',
          policyNo:'',
          productNo:'',
          policyStatus:'',
          startDate:'',
          endDate:''
        },
        policyList: [],
        listLoading: true,
        channelList:[],
        productList:[],
        cols:[ ],
      }
    },
    created() {
      this.getProductList()
      this.getChannelDic()
      this.fetchData()
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
      //table列表展示
      fetchData() {
          if(new Date(this.chanObj.endDate).getTime()>0){
            if(new Date(this.chanObj.startDate).getTime()>new Date(this.chanObj.endDate).getTime()){
              this.$message.error('投保起期不能大于投保止期')
              return
            }
          }

        this.listLoading = true
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/contract/infoPage';
        let params={
          "pageNo":this.currentPage,
          "pageSize":this.pageSize,
          "startDate":this.chanObj.startDate,
          "endDate":this.chanObj.endDate,
          "channelNo":this.chanObj.channelNo,
          "salesmanNo":"",
          "productNo":this.chanObj.productNo,
          "policyNo":this.chanObj.policyNo,
          "policyStatus":this.chanObj.policyStatus
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.listLoading = false
            this.policyList=response.data.data.page.data
            this.totalCount=response.data.data.page.totalCount
            this.contractSumPremium=response.data.data.contractSumPremium
          }


        }).catch(error => {
//            this.loading = false
          console.log(error)
        })
//        getList2(this.listQuery).then(response => {
//          this.policyList = response.data.policyItems
////          this.policyList = response.data.items
//          this.listLoading = false
//        })
      },
      addChannel(){},
      //查询
      onSubmit(){
          this.fetchData()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //点击当前页码请求数据
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage=val
        this.fetchData()
      },
      //获取起止时间
      getVal(val){
        let a=new Date(val)
        console.log(a.getTime())
      },
      getVal2(val){
        let b=new Date(val)
        console.log(b.getTime())
      },
      getFormInfo(){
        let copyColumnsList = JSON.parse(JSON.stringify(this.policyList))
        let arrDataHeader = [];
        let arrDataField = [];
        for (let i = 0; i < copyColumnsList.length; i++) {
          arrDataHeader.push(copyColumnsList[i].title)
          arrDataField.push(copyColumnsList[i].key)
        }
        arrDataHeader=this.truncate(arrDataHeader).toString()
        arrDataField=this.truncate(arrDataField).toString()
        console.log('arrDataHeader='+typeof arrDataHeader)
        console.log('arrDataField='+arrDataField)
        let form = {
          "header": arrDataHeader,
          "field": arrDataField,

          "platformNo":JSON.parse(localStorage.userData).platformNo,
          "channelNo":this.chanObj.channelNo,
          "salesmanNo":'',
          "productNo":this.chanObj.productNo,
          "planNo":"",
          "startDateStr":this.chanObj.startDate,
          "endDateStr":this.chanObj.endDate,
          "policyStatus":this.chanObj.policyStatus,
          "payStatus":"",
          "policyNo":this.chanObj.policyNo,
        };
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/contract/exportContractExcel';
        this.formPost(url, form)
      },
      formPost(url,params) {
        //参考：JS动态创建from表单 - CSDN博客  https://blog.csdn.net/cai_eternal/article/details/53454914
        var turnForm = document.createElement("form");
        //一定要加入到body中
        document.body.appendChild(turnForm);
        turnForm.method = 'post';
        turnForm.action = url;
        /* turnForm.target = '_blank';*/

        for (var key in params) {
          var value=params[key];
          //创建若干隐藏表单域
          var newElement = document.createElement("input");
          newElement.setAttribute("name",key);
          newElement.setAttribute("value",value);
          newElement.setAttribute("type","hidden");
          turnForm.appendChild(newElement);
        }
        turnForm.submit();
      },
      //分割数组去头去尾
      truncate(arr) {
        var newArr = arr.join().split(',');    //join后再拆分为新数组
        newArr.pop();
        newArr.splice(0,1);
        return newArr;
      },
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
.w140{width: 140px !important;}
  /*.card {*/
    /*.el-form-item__label {*/
      /*line-height: 0;*/
    /*}*/
  /*}*/
  .blue{color: #409EFF;
    &:hover{
     color: #409EFF;
     opacity: 0.8;
    }
  }

</style>
