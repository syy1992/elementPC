<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
        :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
        <!--{{generateTitle(tag.title)}}-->
        {{tag.title}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
    <!--<ul  v-show="visible" :style="{left:left+'px',top:top+'px'}" class='contextmenu'>-->
      <!--&lt;!&ndash;<li @click="closeSelectedTag(selectedTag)">{{tagsView.close}}</li>&ndash;&gt;-->
      <!--<li @click="closeSelectedTag(selectedTag)">关闭</li>-->
      <!--<li @click="closeOthersTags">关闭其他</li>-->
      <!--&lt;!&ndash;<li @click="closeOthersTags">{{tagsView.closeOthers}}</li>&ndash;&gt;-->
      <!--&lt;!&ndash;<li @click="closeAllTags">{{tagsView.closeAll}}</li>&ndash;&gt;-->
      <!--<li @click="closeAllTags">关闭所有</li>-->
    <!--</ul>-->


    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
//import { generateTitle } from '@/utils/i18n'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
//    generateTitle, // generateTitle by vue-i18n
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
//      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
//      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },

    closeOthersTags(){
      const curItem =this.$store.state.tagsView.visitedViews.filter(item => {
        return item.path === this.$route.fullPath;
      })
//      let obj={ path: '/dashboard', title: '首页' }
//      this.$router.push('/dashboard')
      this.$store.state.tagsView.visitedViews= curItem;
      localStorage.visitedViews = JSON.stringify(curItem);
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/dashboard')
      let visitedViews = this.$store.state.tagsView.visitedViews;
      localStorage.visitedViews = JSON.stringify(visitedViews);
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      this.left = e.clientX
      this.top = e.clientY
      let visitedViews = this.$store.state.tagsView.visitedViews;
      localStorage.visitedViews = JSON.stringify(visitedViews);
    },
    closeMenu() {
      this.visible = false
    },
    handleTags(command){
//        console.log('command='+command)
//      command === 'other' ? this.closeOthersTags() : this.closeAllTags();
      if( command === 'other'){
        this.closeOthersTags()
        this.$router.push({
          name: 'dashboard'
        });
      }else {
        this.closeAllTags()
        this.$router.push({
          name: 'dashboard'
        });
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  position: relative;
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        /*background-color: #42b983;*/
        background-color: #409EFF;
        color: #fff;
        border-color: #409EFF;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }

  .tags-close-box {
    position: absolute;
    right: 15px;
    top: 2px;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    width: 110px;
    height: 30px;
/*    background: #fff;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);*/
    z-index: 10;
  }

}
</style>
<style>
  .el-dropdown-menu{min-width: 70px;text-align: center}
</style>
