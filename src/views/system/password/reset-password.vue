<template>
  <div class='app-container'>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width:600px; text-align: center; margin: auto;padding: 50px 30px">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input type="password" v-model.trim="ruleForm.oldPwd" auto-complete="off" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwdOne">
          <el-input type="password" v-model.trim="ruleForm.newPwdOne" auto-complete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwdTwo">
          <el-input type="password" v-model.trim="ruleForm.newPwdTwo" auto-complete="off" placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="loading">提交</el-button>
          <el-button  @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>


  </div>
</template>
<script>
  import ElCard from "../../../../node_modules/element-ui/packages/card/src/main";
  //import { post } from '@/libs/axios-cfg'
  export default {
    components: {ElCard},
    data(){
      return {
//        show:true,
        loading:false,
        ruleForm: {
          "oldPwd":"",
          "newPwdOne":"",
          "newPwdTwo":""
        },
        rules:{
          oldPwd: [
            {required: true, message: "请输入原密码",trigger: 'change'},
//            {pattern:/^(\w){6,18}$/,message:'新密码应为数字英文下划线组成的6-18位字符'}
          ],
          newPwdOne: [
            {required: true, message: "请输入新密码",trigger: 'change'},
            {pattern:/^[A-Za-z0-9]{6,12}$/,message:'新密码应为数字英文组成的6-12位字符'}
          ],
          newPwdTwo:{
            required: true,trigger: 'change',
            validator:(rule, value, callback, source, options) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.newPwdOne) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            }
          }
        }
      }
    },
    methods:{
        //提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
//            alert('更改成功');//这里就是符合规则，然后去调对应的接口
//            this.showMessage('更改成功','success')
            this.setPassword()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setPassword(){
        let url=process.env.BASE_URL+process.env.commonPort+'/dingPC/manage/updateUserPwd';
        this.loading=true
        let params={
          "oldPwd":this.ruleForm.oldPwd,
          "newPwdOne":this.ruleForm.newPwdOne,
          "newPwdTwo":this.ruleForm.newPwdTwo
        };
        this.$http.post(url, params).then((response) => {
          this.loading=false
          if (response.data.resCode === '0000') {
            this.showMessage('更改成功','success')
            let _this=this
            setTimeout(_this.resetForm('ruleForm'),500)
          }

        }).catch(error => {
          this.loading=false
          console.log(error)
        })
      },
      //重置
      resetForm(formName){
        this.$refs[formName].resetFields();
      },
      showMessage(txt,type){
        this.$message({
          message: txt,
          type: type
        });
      }
    }

  };
</script>
<style scoped>
</style>
