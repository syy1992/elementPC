<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" v-if='showLogin==false'>
      <h3 class="title">账号登录</h3>
      <!--<el-form-item prop="username">-->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
        <div class='phone-login' @click='resetForm("loginForm");showLogin=true'>手机号登录</div>
    </el-form>
    <el-form ref="loginForm2" :model="loginForm2" :rules="loginRules2" class="login-form" auto-complete="on" label-position="left" v-if='showLogin==true'>
      <h3 class="title">手机号登录</h3>
      <!--<el-form-item prop="username">-->
      <el-form-item prop="phone">
        <span class="svg-container">
          <i class='iconfont icon-phone'></i>
          <!--<svg-icon icon-class="phone" />-->
        </span>
        <el-input v-model="loginForm2.phone" name="phone" type="text" auto-complete="on" placeholder="手机号" />
      </el-form-item>
      <div style='position: relative'>
        <el-form-item prop="code" style='width: 280px'>
           <span class="svg-container">
            <i class='iconfont icon-duanxinyanzhengma'></i>
          </span>
            <el-input v-model="loginForm2.code" name="code" type="text" auto-complete="on" placeholder="验证码"  />
        </el-form-item>
        <el-button @click.prevent="getValidateCodeQuery" v-if="sendAuthCode"  type='primary' class='blue-btn w146'>发送验证码</el-button>
        <el-button type="info" plain disabled v-if="!sendAuthCode" class='blue-btn'>{{auth_time}} 秒后重新发送</el-button>
      </div>
      <el-form-item>
        <el-button :loading="loading" type="primary"style="width:100%;" @click.native.prevent="handleLogin2">
          登录
        </el-button>
      </el-form-item>
      <div class='phone-login' @click='resetForm("loginForm2");showLogin=false'>账号登录</div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername,isvalidPhone,isvalidNumCode } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validNumCode = (rule, value, callback) => {
      if (!isvalidNumCode(value)) {
        callback(new Error('验证码为6位数字'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    }
    return {
      auth_time:60,
      auth_timetimer:'',
      showLogin:false,
      sendAuthCode:true,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        password: [{ required: true, trigger: 'change', validator: validatePass }]
      },
      loginForm2: {
        phone: '',
        code: ''
      },
      loginRules2: {
        phone: [{ required: true, trigger: 'change', validator: validatePhone }],
        code: [{ required: true, trigger: 'change', validator: validNumCode }]
//        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' },
//       { validator:this.validatorFn,trigger: 'blur'} ]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
//    ...mapActions({add_Routes: 'add_Routes'}), //add by syy
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
//    validatorFn( value, callback,source){
//      if( value.length == 4 ){
//        let yan = source.code
//        let url = process.env.BASE_URL+process.env.commonPort+ '/captcha/validate';
//        let pars = {code: yan};
//        this.$http.get(url, {params: pars}).then(response => {
//          if( response.data.res == false ){
//            var errors = '验证码错误';
//            callback(errors)
//          }
//          callback()
//        })
//      }
//    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
//          this.loading = true
          let url =process.env.BASE_URL+process.env.commonPort+ '/dingPC/manage/userLogin';
          let params=this.loginForm
          this.$http.post(url, params).then((response) => {
            // 重定向到首页
            if(response.data.resCode=='0000'){
//              this.loading = false

              this.$store.commit('login', true) //fixme
              this.$store.commit('SET_TOKEN', response.data.data.token)
              this.$store.commit('SET_NAME', response.data.data.userName)
              this.$store.commit('SET_USERDATA', response.data.data)
//                sessionStorage.setItem('role',  response.data.data.userType)
              this.$message.success(response.data.resMsg)
              this.$router.push({ path:  '/dashboard',})
              this.$store.commit('SET_AVATAR', 'http://wx.qlogo.cn/mmopen/CJ35Z2cnZA23C2wPPPegBFOLkWp9QDrOkaN23LxKewH9IA8pjPghiaH1IJJAgbWAZ3aSfAJXwG6qRpbianTKEQuqTJTaArGfWo/64')

            }

              // 将路由信息，菜单信息，用户信息存到sessionStorage里
//              sessionStorage.setItem('menuData', JSON.stringify(res.data.data.permissions))
//              sessionStorage.setItem('user', this.user.username)
//              sessionStorage.setItem('routes', JSON.stringify(res.data.routerData))
//              this.add_Routes(res.data.routerData) //触发vuex里的增加路由
//            }





          }).catch(error => {
//            this.loading = false
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //验证码计时器
    getValidateCodeQuery(){
      let url = process.env.BASE_URL+process.env.commonPort+ '/dingPC/manage/getCode4Login';
      let params={"phone":this.loginForm2.phone,"type":0};
      if (!this.loginForm2.phone) {
          this.$message.error('手机号不能为空')
        return ;
      }
      if (!isvalidPhone(this.loginForm2.phone)) {
        this.$message.error('手机号错误')
        return ;
      }else{
        this.$http.get(url,{params:params}).then((response) => {
          if (response.data.resCode == '0000') {
              this.getAuthCode()
          }
          console.log(data);
        }).catch(function (error) {
          console.log(error)
        });
        }

    },
    getAuthCode() {
      this.sendAuthCode = false;
      this.auth_time = 60;
      this.auth_timetimer = setInterval(() => {
        this.auth_time--;
        if (this.auth_time <= 0) {
          this.sendAuthCode = true;
          clearInterval(this.auth_timetimer);
        }
      }, 1000);
    },
    handleLogin2(){
      this.$refs.loginForm2.validate(valid => {
        if (valid) {

            //并且验证码正确
          let url = process.env.BASE_URL+process.env.commonPort+ '/dingPC/manage/userLogin4PhoneCode';
          let params={
              userPhone:this.loginForm2.phone,
              checkCode:this.loginForm2.code
          }
          this.$http.post(url, params).then((response) => {
            // 重定向到首页
            if (response.data.resCode == '0000') {
              this.$store.commit('login', true) //fixme

              this.$store.commit('SET_TOKEN', response.data.data.token)
              this.$store.commit('SET_NAME', response.data.data.userName)
              this.$store.commit('SET_USERDATA', response.data.data)
              this.$message.success(response.data.resMsg)
              this.$router.push({path: '/dashboard',})
              this.$store.commit('SET_AVATAR', 'http://wx.qlogo.cn/mmopen/CJ35Z2cnZA23C2wPPPegBFOLkWp9QDrOkaN23LxKewH9IA8pjPghiaH1IJJAgbWAZ3aSfAJXwG6qRpbianTKEQuqTJTaArGfWo/64')
            }

            }).catch(error => {
//            this.loading = false
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    i{color: #889aa4;font-size: 16px}
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .phone-login {
    color: #eee;
    float: right;
    font-size: 13px;
    cursor: pointer;
  }
}
.blue-btn{position: absolute;right: 1px;top: 4px;line-height: 20px;}
.w146{width: 146px}
  /*.mgt10{margin-top: 10px}*/
</style>
