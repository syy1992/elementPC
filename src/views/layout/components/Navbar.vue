<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <i class="el-icon-caret-bottom">
          <span>{{name}}</span>
        </i>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
      <!--<img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
      <img :src="avatar" class="user-avatar">
    </el-dropdown>
  <span class='small-nav'>
      <el-tooltip effect="dark" content="全屏" placement="bottom" >
      <screenfull class="screenfull right-menu-item"></screenfull>
    </el-tooltip>
    <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item" ></theme-picker>
      </el-tooltip>
    <!--<el-color-picker v-model="color"   size="mini"></el-color-picker>-->
  </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import ThemePicker from '@/components/ThemePicker'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    ThemePicker
  },
  data(){
      return {
        color:'#409EFF'
      }
  },
  computed: {
    avatar () {
      return localStorage.avatarImgPath;
    },
    name () {
      return localStorage.username;
    },
    ...mapGetters([
      'sidebar',
//      'name',
//      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then((response) => {
          if(response.data.resCode=='0000'){
              this.$message({
                  message: response.data.resMsg,
                  type: 'success',
                  duration:1000
                })
            this.$router.push({path:'/login',redirect:'/'})
          }


//        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $type: screen;
  $proto: max-width;
  $value: 750px;
.navbar {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .small-nav{
    float: right;
    display: flex;
    margin-right: 20px;
    @media #{$type} and ($proto: $value) {
     display: none;
    }
  }
  .screenfull {
    width: 20px;
    height: 20px;
    margin: 16px 8px 11px 8px;
  }

  .screenfull-svg{
    display: inline-block;
    position: absolute;
  }

  .avatar-container {
    height: 50px;
    display: flex;
     float:right;
    margin-right: 20px;
    .avatar-wrapper {
      cursor: pointer;
      padding-top: 15px;
      position: relative;
      line-height: initial;

      .el-icon-caret-bottom {
        top: 25px;
        font-size: 12px;
        margin-right: 10px;
      }
    }
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 5px 0;
  }

  .el-color-picker {
    height: 25px;
    width: 25px;
    margin: 13px 5px 0 5px;
  }
}
</style>

