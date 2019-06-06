<template>
  <div class="app-container" id='warrant'>
    <el-card class='mg-bot20'>
      <el-row>
      <el-col :span="4" class='col'><span class="col-inner">渠道名称：</span>{{obj.channel}}</el-col>
      <el-col :span="4"  class='col'><span class="col-inner">可配置产品：</span>{{obj.PermissionSumCount}} 款</el-col>
      <el-col :span="4"  class='col'><span class="col-inner">已配置产品：</span>{{obj.PermissionCount}} 款</el-col>
      <el-col :span="7"  ><span class="col-inner">产品状态：</span>
        <el-select v-model="warrantSelected" placeholder="请选择" size="small"  @change='changeState'>
          <el-option  v-for="(item,index) in warrantStatus" :key="index" :label="item.infoValue" :value="item.infoKey"></el-option>
        </el-select>
      </el-col>
      <!--<el-col :span="4"><div class="col-inner"></div></el-col>-->
      <!--<el-col :span="4"><div class="col-inner"></div></el-col>-->
      </el-row>
    </el-card>
    <!--<el-card class='mg-bot20'>-->
      <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
        <!--<el-form-item label="产品名称">-->
          <!--<el-input v-model="formInline.productName" placeholder="输入产品名称" size="medium" clearable></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary"  size="medium" @click="onSubmit">查询</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

    <!--</el-card>-->
    <el-card>
      <div slot="header" class="clearfix">
        <span class='tit'><i class='iconfont icon-liebiao mg-right5'></i>产品授权</span>
        <span class='gray'>· 授权下属渠道可售卖产品 渠道可授权业务员已被授权产品</span>
      </div>
      <!--:render-header='renderHeaderFuc'-->
      <el-table  v-loading="listLoading"   :data="list" element-loading-text="Loading"   border  fit
                 highlight-current-row :header-cell-style="{background:'#DFE6EC'}"  empty-text="暂无数据" >
        <!--<el-table-column v-for="(col,index) in cols"  :prop="col.prop" :label="col.label" :key='index' align='center'  :width="col.width" :type='col.type'>-->
        <!--</el-table-column>-->
        <el-table-column label="序号" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="产品名称"  align='center'>
          <template slot-scope="scope">
            {{scope.row.productName | formatNull}}
          </template>
        </el-table-column>
        <el-table-column label="保额" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.amount | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="保费" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.premium | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="描述"  align='center'>
          <template slot-scope="scope">
            {{scope.row.description | formatNull}}
          </template>
        </el-table-column>

        <el-table-column label="有效状态" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.valid | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="授权状态" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.row.isPermission | formatPermission}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="160" align='center' >
          <template slot-scope="scope">
            <el-button size='small' :type='scope.row.isPermission | statusFilter' @click='changeWarrant(scope.row)'>{{scope.row.isPermission==0? "授权" :"取消授权"}}</el-button>
            <!--<el-button size='small' v-if='warrantSelected==0'>取消授权</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if='list.length!=0' @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="totalCount" :page-count='pageCount'></el-pagination>
    </el-card>

  </div>
</template>

<script>
//  import { getList } from '@/api/table'
import {commonList,isWarrant} from '../../utils/static.js'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import qs from 'qs'
export default {
    components: {
      ElButton,
      ElCard},
    filters: {
      statusFilter(status) {
        const statusMap = {
//          published: 'success',
//          draft: 'gray',
//          deleted: 'danger'
          0: 'primary',
          1: '',
        }
        return statusMap[status]
      },

      formatStatus: function (val) {
        let text = ''
        commonList.valid.forEach((item, index) => {
          if (val == item.infoKey) {
            text = item.infoValue
          }else if (val == '' || val == null) {
            text = '/'
          }
        })
        return text
      },
      formatPermission: function (val) {
        let text = ''
        isWarrant.forEach((item, index) => {
          if (val == item.infoKey) {
            text = item.infoValue
          }
        })
        return text
      },
      formatMoney: function (val) {
        return val == '' || val == null ? '/' : val.toFixed(2)
      },
      formatNull: function (val) {
        return val == '' || val == null ? '/' : val

//      statusFilter(status) {
//        const statusMap = {
//          published: 'success',
//          draft: 'gray',
//          deleted: 'danger'
//        }
//        return statusMap[status]
//      }

      },
    },
    data() {
      return {
        obj:{
          channel:qs.parse(location.href.split('?')[1]).urlParam,
          PermissionSumCount:0,
          PermissionCount:0,
        },
        warrantStatus:isWarrant,
        warrantSelected:1,
        ewmShow:false,
        currentPage:1,
        pageSize:10,
        totalCount:0,
        pageCount:0,
//        QRCode:QRCode,
//        list: null,
        listLoading: true,
        formInline:{},
        list:[],
        cols:[
//          {prop:'',label: '序号',type:'index',width:'50'},
//          {prop: 'productName', label: '产品名称',width:'200'},
//          {prop: 'price', label: '基础价格',width:'120'},
//          {prop: 'desc', label: '方案介绍'},
//          {label: '操作',
//            renderHeaderFuc(h, {
//              column,
//              $index
//            })  {
//              return h('span', {}, [
//                h('span', {}, '金额'),
//                h('span', {
//                  style: {},
//                  on: {
//                    click: () => {
////                      this.visible = true
//                    }
//                  }
//                }, '调价券')
//              ])
//            }
//          }
        ],
        channelList:[],
      }
    },
    created() {
      this.getChannelDic()

    },
    mounted(){
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        let url = process.env.BASE_URL + process.env.commonPort + '/dingPC/product/productLicenseInfoPage';
        let userData = JSON.parse(localStorage.userData)
        let params = {
          "pageNo": this.currentPage,
          "pageSize": this.pageSize,
          "platformNo": userData.platformNo,
          "channelNo": qs.parse(location.href.split('?')[1]).urlParam,
          "salesmanNo": '',
          "isPermission":this.warrantSelected,
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.listLoading = false
            this.list = response.data.data.page.data
//            console.log(this.list)
            this.totalCount = response.data.data.page.totalCount
//            this.pageCount = response.data.data.page.totalPage
            this.obj.PermissionSumCount = response.data.data.PermissionSumCount
            this.obj.PermissionCount = response.data.data.PermissionCount
          }

        }).catch(error => {
          console.log(error)
        })
      },
      onSubmit(){ },
      changeState(){
          this.fetchData()
      },
      handleCurrentChange(val) {
//        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.fetchData()
      },
      changeWarrant(row){
//        this.listLoading = true
        let url = process.env.BASE_URL + process.env.commonPort + '/dingPC/product/productLicense';
        let userData = JSON.parse(localStorage.userData)
        let splitObj = location.href.split('?')[1];
        let params = {
//          "type": userData.userType,
          "state": row.isPermission == 0 ? 1 : 0,
          "productId": row.id,
          "platformNo": userData.platformNo,
          "channelNo": qs.parse(splitObj).urlParam,
          "salesmanNo": userData.salesmanNo
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.fetchData()
          }

        }).catch(error => {
          console.log(error)
        })
      },
      //获取渠道字典
//      getChannelDic(){
//        let url = process.env.BASE_URL + process.env.commonPort + '/dingPC/common/channelDic';
//        let platNo = JSON.parse(localStorage.userData).platformNo;
//        let params = {
//          platNo: platNo
//        };
//         new Promise((resolve, reject) => {
//          this.$http({
//            url: url,
//            method: 'post',
//            data: {
//              platNo: platNo
//            }
//          })
//            .then((res) => {
//              if(res.data.resCode=='0000'){
//                this.channelList = res.data.data
//                this.channelList.forEach((item, index) => {
//                  if (item.infoKey == this.obj.channel) {
//                    return this.obj.channel = item.infoValue
//                  }
//                })
//              }
//              resolve(res.data);
//
//            })
//            .catch(function (error) {
//              reject(error);
//              // console.log(error);
//            });
//        });
//
//
//      },
      getChannelDic(){
        let url = process.env.BASE_URL + process.env.commonPort + '/dingPC/common/channelDic';
        let platNo = JSON.parse(localStorage.userData).platformNo;
        let params = {
          platNo: platNo
        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.channelList = response.data.data
            this.$nextTick(()=>{
              this.channelList.forEach((item, index) => {
                if (item.infoKey == this.obj.channel) {
                  return  this.obj.channel = item.infoValue
                }
              })
            })

//            console.log(this.channelName)
          }
        }).catch(error => {
          console.log(error)
        })

      },
    },
  computed: {
  }
}
</script>
<style scoped lang='scss'>
  .el-form--inline {.el-form-item{margin-bottom: 0}}
  .col{
    padding: 7px 0
  }
  .iconfont{font-weight: bolder;color: #000;font-size: 18px}
  .gray{color: #858585;font-size: 12px;margin-left: 30px;display: inline-block;}
  .el-pagination{text-align: center;margin-top: 20px;}

  .row-btn {
    position: relative;
    margin-right: 8px;
    &:after{
      position: absolute;
      right: -8px;
      top:2px;
      content:'';
      width: 2px;
      height: 12px;
      background: #409EFF;
    }
    &:last-child{
      margin-right: 0;
      &:after{
        display: none;
      }
    }
  }
  .canvas{width:100px!important;height:100px!important;text-align: center;margin: auto}
</style>
<style lang='scss'>
  .el-popover {
    min-width: 100px !important;
    padding: 0;
    /*width: 100px*/
  }
</style>
