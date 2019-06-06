<template>
  <div class="app-container" id='productList'>
    <el-card class='mg-bot20'>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="产品名称：">
          <el-input v-model.trim="formInline.productName" placeholder="输入产品名称（可模糊查询）" size="medium" clearable style='width: 220px'></el-input>
          <!--<el-select v-model="formInline.productNo" placeholder="请选择产品" size="small" clearable>-->
            <!--<el-option-->
              <!--v-for="(item,index) in productList"-->
              <!--:key="index"-->
              <!--:label="item.infoValue"-->
              <!--:value="item.infoKey">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  size="medium" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span class='tit'><i class='iconfont icon-liebiao mg-right5'></i>产品列表</span>
        <span class='gray'>· 可分发产品列表，支持生成投保二维码及投保链接</span>
      </div>
      <!--:render-header='renderHeaderFuc'-->
      <el-table  v-loading="listLoading"   :data="list" element-loading-text="Loading"   border  fit  highlight-current-row :header-cell-style="{background:'#DFE6EC'}"  empty-text="暂无数据" >
        <!--<el-table-column v-for="(col,index) in cols"  :prop="col.prop" :label="col.label" :key='index' align='center'  :width="col.width" :type='col.type' >-->
        <!--</el-table-column>-->
        <el-table-column label="序号" width="110" align='center'>
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="160" align='center'>
          <template slot-scope="scope">
            {{scope.row.productName | formatNull}}
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

        <el-table-column label="有效状态" width="110" align='center'>
          <template slot-scope="scope">
           {{scope.row.valid | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="图片" width="110" align='center'>
          <template slot-scope="scope">
            <img :src="scope.row.iconUrl" class="list_pic" v-if='scope.row.iconUrl' />
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column  prop="description" label="描述" align='center'>
          <template slot-scope="scope">
            {{scope.row.description? scope.row.description : '暂无'}}
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="200" align='center' >
          <template slot-scope="scope" v-if='scope.row.baseUrl'>
            <!--<el-dialog title="复制链接" :visible.sync="isShow" size="small" width='300px' >-->
              <!--<input type='text' v-model='scope.row.baseUrl'  id="copy_text" >-->
              <!--<button   class="tagRead"  data-clipboard-action="copy" data-clipboard-target="#copy_text" @click="copy(scope.$index)">复制链接</button>-->
            <!--</el-dialog>-->

              <el-popover  ref="popover"  placement="top" trigger="click">
                <canvas :id="'qrcode'+scope.$index" ref='canvas'  v-show='ewmShow&&scope.$index==current' class='canvas'></canvas>
                <el-button type="primary" icon="el-icon-download" size='small' class='save' @click='saveImg(scope.$index)'>保存</el-button>
              </el-popover>
              <a class='row-btn'   @click='getEwm(scope.$index,scope.row.baseUrl)'  v-popover:popover >
                <el-button  type="text" size="small" >专属二维码</el-button>
              </a>


            <el-popover ref="popover2"  placement="top" trigger="click"  width='200'>
              <!--<el-link type="primary" :href='scope.row.baseUrl' target="_blank">产品链接</el-link>-->
              <div >
                <a  class='blue' :href='scope.row.baseUrl' target='_blank'>跳转产品链接</a>
                <!--<input type='text' v-model='scope.row.baseUrl'  :id="'copy_text'+scope.$index" >-->
                <!--<button   :class="'tagRead'+scope.$index"  data-clipboard-action="copy" :data-clipboard-target="'#copy_text'+scope.$index" @click="copy(scope.$index)">复制链接</button>-->
                <el-button @click="open(scope.row)" ref='btn' size='small' type='text'>复制链接</el-button>
              </div>


            </el-popover>
            <a  class='row-btn'  v-popover:popover2 >
            <!--<a  class='row-btn' :href='scope.row.baseUrl' target='_blank' >-->
              <el-button type="text" size="small">专属产品链接</el-button>
            </a>
          </template>

        </el-table-column>
      </el-table>
      <el-pagination v-if='list.length!=0' @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="totalCount"></el-pagination>
    </el-card>

  </div>
</template>

<script>
//  import { getList } from '@/api/table'
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
//  import QRCode from '../../utils/qrcode.js'
  import {commonList} from '../../utils/static.js'
  import QRCode from 'qrcode'
  import Clipboard from "clipboard"
  export default {
    components: {ElCard,},
    filters: {
      formatStatus: function (val) {
//        console.log(val)
        let text=''
        commonList.valid.forEach((item,index) => {
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
//      statusFilter(status) {
//        const statusMap = {
//          published: 'success',
//          draft: 'gray',
//          deleted: 'danger'
//        }
//        return statusMap[status]
//      }
    },
    data() {
      return {
        isShow:false,
        totalCount:0,
        currentPage:1,
        pageSize:5,
        productList:[],
        ewmShow:false,
        current:0,
//        QRCode:QRCode,
        listLoading: true,
        formInline:{
          productName:''
        },
        list:[],
        cols:[]
      }
    },
    created() {
      this.getProductList()
      this.fetchData()
    },
    mounted(){},
    methods: {
      getProductList(){
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/common/productDic';
        this.$http.post(url, {}).then((response) => {
          if (response.data.resCode === '0000') {
            this.productList=response.data.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
//获得产品list
      fetchData() {
        this.listLoading = true
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/product/infoPage';
        let params={
          "pageNo":this.currentPage,
          "pageSize":this.pageSize,
          "productName":this.formInline.productName,
        }
        this.$http.post(url, params).then((response) => {
          // 重定向到首页
          this.listLoading = false
          this.list=response.data.data.page.data
          this.totalCount=response.data.data.page.totalCount

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
      onSubmit(){
          this.fetchData()
      },
      //生成二维码
      getEwm(index,url){
        console.log('index='+index)
        console.log('this.current='+this.current)
        this.ewmShow = true;
        this.current = index;
        let canvas = document.getElementById('qrcode' + index)
        QRCode.toCanvas(canvas, url, function (error) {
          if (error) console.error(error)
          console.log('QRCode success!');
        })
        console.log(QRCode)
      },
      handleCurrentChange(val) {
//        console.log(`当前页: ${val}`);
        this.currentPage=val
        this.fetchData()
      },
      leave(){
        this.ewmShow = false;
        this.current = null;
      },
      //保存图片
      saveImg(index) {
        let canvas = document.getElementById('qrcode' + index)
        var dom = document.createElement("a");
        dom.href = canvas.toDataURL("image/png");
        dom.download = new Date().getTime() + ".png";
        dom.click();
      },
      open(row) {
          console.log(row.baseUrl)
          let _this=this;
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('input',  {
                attrs:{
                    value:row.baseUrl,
                    id:'copy_text'
                },
              style:{padding:'6px 5px','line-height':'22px'},

            }),
            h('button', {
                props: {
//                    type:'primary',
//                    size:'small',

                },
              attrs:{
                'class': 'tagRead',
                'data-clipboard-action': 'copy',
                'data-clipboard-target': "#copy_text"
              },
              style:{'margin-left':'5px',padding:'6px 5px','line-height':'22px'},
              on:{
                click: _this.copy
              }
            }, '复制链接')
          ]),
//          showCancelButton: true,
//          confirmButtonText: '确定',
//          cancelButtonText: '取消',
//          beforeClose: (action, instance, done) => {
//            if (action === 'confirm') {
////              instance.confirmButtonLoading = true;
////              instance.confirmButtonText = '执行中...';
////              setTimeout(() => {
////                done();
////                setTimeout(() => {
////                  instance.confirmButtonLoading = false;
////                }, 300);
////              }, 3000);
////            } else {
//              done();
//            }
//            if (action === 'cancel') {
////                this.showCancelButton=false
////              done();
//            }
//          }
        }).catch((error) => {
            console.log(error)
        });
//          .then(action => {
//          this.$message({
//            type: 'info',
//            message: 'action: ' + action
//          });
//        });
      },
      //复制链接
//      open(row){
//          this.isShow=true;
//      },
      copy(index) {
        let  clipboard = new Clipboard(".tagRead");
          console.log(clipboard)
        clipboard.on("success", e => {
                    console.log("复制成功");
          this.$message.success("复制成功");
          // 释放内存
          clipboard.destroy();
          this.isShow=false;
        });
        clipboard.on("error", e => {
          // 不支持复制
          console.log("该浏览器不支持自动复制");
          this.$message.error("该浏览器不支持自动复制");
          // 释放内存
          clipboard.destroy();
        });
      },
    },
    computed:{},
    watch: {
      current(newVal, oldVal){
        console.log('oldVal=' + oldVal)
        console.log('newVal=' + newVal)
      }
    }
  }
</script>
<style scoped lang='scss'>
  .el-form--inline {.el-form-item{margin-bottom: 0}}
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
  .list_pic{width: 80px;height: 80px;}
  .save{display: block;margin:0 auto 10px;padding: 2px 5px;}
  .blue{color: #409EFF;}
</style>
<style lang='scss'>
    .el-popover {
      min-width: 100px !important;
      padding: 0;
      /*width: 100px*/
    }
</style>
