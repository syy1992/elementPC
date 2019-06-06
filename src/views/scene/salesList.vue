<template>
  <div class="app-container">
    <el-card class='mg-bot20' >
      <el-form :inline="true" :model="salesObj" class="demo-form-inline" >
        <el-form-item label="联系人电话:">
          <el-input v-model.trim="salesObj.phone" placeholder="输入联系人电话" size="small" clearable></el-input>

        </el-form-item>
        <el-form-item label="账户状态:">
          <el-select v-model="salesObj.state" placeholder="请选择" size="small" clearable>
            <el-option  v-for="(item,index) in commonList.state" :key="index" :label="item.infoValue" :value="item.infoKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  size="small" @click="addChannel" plain>新增</el-button>
          <el-button type="primary"  size="small" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span class='tit' style='line-height: 32px'><i class='iconfont icon-liebiao mg-right5'></i>业务员列表</span>
        <span class='gray' style='line-height: 32px'>· 已开通业务员列表，可点击停用业务员与配置产品，已产生保单不会删除</span>
        <!--<el-button size='small' type="primary" class='fl-r'>下载报表</el-button>-->
      </div>
      <el-table v-loading="listLoading"  :data="list"  :header-cell-style="{background:'#DFE6EC'}"   element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="业务员编号" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.salesmanNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务员名称" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.salesmanname }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="姓名" width="110" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{ scope.row.userName }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="手机号" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保费" width="110" align="center">
          <template slot-scope="scope">
            <!--{{ scope.row.pageviews | priceFilter }}-->
            {{ scope.row.allPremium}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.isDeleted | statusFilter }}
            <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="产品数量" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.productCount}}
            <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="出单量(单)" width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.allContract }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="描述" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{ scope.row.description }}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="created_at" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="300" align='center' >
          <template slot-scope="scope">
            <el-button  type="primary" size="small" plain>查看</el-button>
            <el-button type="primary" size="small" plain>停用</el-button>
            <el-button type="primary" size="small" plain>产品授权</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if='list.length!=0'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        background
        layout="prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </el-card>
    <el-dialog :title="dialogTitle"  :visible.sync="dialogVisible"  width="430px"  :before-close="handleClose" class='dialog'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size='small'>
        <el-form-item label="业务员名称" prop="name">
          <el-input v-model.trim="ruleForm.name"  style='width: 200px'></el-input>
        </el-form-item>
        <el-form-item label="业务员编号" prop="salesmanNo">
          <el-input v-model.trim="ruleForm.salesmanNo"  style='width: 200px'></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.trim="ruleForm.phone"  style='width: 200px'></el-input>
          <!--<el-tag size="mini" style='cursor: pointer'>获取验证码</el-tag>-->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size='small' @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" size='small' @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//  import { getList } from '@/api/table'
  import {commonList} from '../../utils/static'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import { isvalidPhone,isvalidCode} from '@/utils/validate'
  const checkPhone = (rule, value, callback) => {
//  const phoneReg = /^1[3-9][0-9]{9}$/;
    if (!value) {
      return callback(new Error('电话号码不能为空'))
    }
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    }
    if(!isvalidPhone(value)){
      callback(new Error('手机号格式有误'))
    }else{
      callback()
    }

  };
  const checkCode = (rule, value, callback) => {
//  const phoneReg = /^1[3-9][0-9]{9}$/;

    if (!value) {
      return callback(new Error('验证码不能为空'))
    }

    if(!isvalidPhone(value)){
      callback(new Error('输入数字和英文，长度为6位'))
    }else{
      callback()
    }

  };
  export default {
    name: 'salesList',
    components: {
      ElButton,
      ElCard},
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '关闭',
          1: '开启',
        };
        return statusMap[status]
      },
//    priceFilter(pageviews){
//        return pageviews.toFixed(2)
//    }
    },
    data() {
      return {
        totalCount:0,
        currentPage:1,
        pageSize:10,
        commonList:commonList,
        salesObj:{
//          name:'',
          phone:'',
          state:'',
        },
        list: [],
        listLoading: true,
        dialogVisible:false,
        dialogTitle:'新增业务员',
        ruleForm: {
          name: '',
          salesmanNo: '',
          phone: '',
//        verifyCode: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入业务员名称', trigger: 'change' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
          salesmanNo: [
            { required: true, message: '请输入业务员编号', trigger: 'change' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
          phone: [
            {  required: true, validator: checkPhone, trigger:'change'}
          ],
//        verifyCode: [
////          {required: true,message: '请输入验证码',pattern:/^[0-9a-zA-Z]{6}$/, trigger: 'change' }
//          {required: true,validator: checkCode, trigger:'change'}
//        ],
        }

      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/sales/infoPage';
        let channelNo=JSON.parse(localStorage.userData).channelNo
        let params={
           pageNo:this.currentPage,
           pageSize:this.pageSize,
          "channelNo":channelNo,
          "salesmanNo":"",
          "phone":this.salesObj.phone,
          "isDeleted":this.salesObj.state,

        };
        this.$http.post(url, params).then((response) => {
          if (response.data.resCode === '0000') {
            this.listLoading = false
            this.list=response.data.data.data
            this.totalCount=response.data.data.totalCount
//            this.currentPage=response.data.data.pageNo
          }

        }).catch(error => {
          console.log(error)
        })

      },
      addChannel(){
        this.dialogVisible = true
      },
      onSubmit(){
          this.fetchData()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchData()
        console.log(`当前页: ${val}`);
      },
      handleClose(){
        this.dialogVisible = false;
        this.resetForm('ruleForm')
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }

    }
  }
</script>
<style scoped lang='scss'>
  .el-pagination{text-align: center;margin-top: 20px;}
  .demo-form-inline {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .iconfont{font-weight: bolder;color: #000;font-size: 18px}
  .gray{color: #858585;font-size: 12px;margin-left: 30px;display: inline-block;}
  .el-dialog__title{font-size: 15px;}
</style>
<style>
  .el-dialog__footer{text-align: center!important;}
</style>
