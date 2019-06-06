<template>
  <div class='app-container'>
    <el-card>
      <!--<el-table :data="tableData" style="width: 100%"  v-loading="loading">-->
      <el-table :data="tableData" style="width: 100%" >
        <el-table-column label="序号" type="index" show-overflow-tooltip width="50"></el-table-column>
        <el-table-column v-for="(col,index) in cols"  :prop="col.prop" :label="col.label" :key='index' align='center'>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100" align='center'>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button raw-type="button" @click="addCol">
        添加一列
      </el-button>
    </el-card>

  </div>

</template>
<script>
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main";
  export default{
    components: {ElCard},
    name: 'test',
    data() {
      return {
        loading:true,
        tableData: [
          {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          phone:'14337164402'
        },
          {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          phone:'15337164402'
        },
          {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          phone:'16337164402'
        },
          {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          phone:'17337164402'
        }
        ],
        cols: [
//          {prop: 'index', label: '序号'},
          {prop: 'date', label: '日期'},
          {prop: 'name', label: '姓名'},
          {prop: 'address', label: '地址'},
        ]
      }
    },
    methods: {
      addCol(){
        this.cols.push({prop: 'phone', label: '电话'})
      },
      handleClick(row) {
        console.log(row);
        alert(JSON.stringify(row));
      }
    }
  }
</script>
<style>
  .app-container {
    padding: 20px;
  }

</style>

