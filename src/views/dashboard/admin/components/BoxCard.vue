<template>
    <div class='height300'>
      <div class='progress-item' v-for='(item,index) in rankList' :key='index' v-if='rankList!=0'>
           <p class='name'>{{item.name}}</p>
          <el-progress :percentage="item.count" :stroke-width='15' :color='colorList[index]' ></el-progress>
      </div>
      <div v-if='rankList==0' class='noData'><div>暂无销量统计</div></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props:{
    rankList: {
      type: Array,
      default: ()=>[]
    },
    colorList: {
      type: Array,
      default: ()=>[]
    },
  },
  data() {
    return {
//      statisticsData: {
//        article_count: 1024,
//        pageviews_count: 1024
//      },
//      rankList:[
//        {name:'宁普',count:70},
//        {name:'钟尧',count:56},
//        {name:'王健',count:33},
//        {name:'王安',count:21},
//        {name:'晨阳',count:16},
//      ],
//      colorList:['#2fbbf9','#f03333','#256789','#B6A2DE','#edf666']
    }
  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .progress-item {
    font-size: 15px;
    padding-top: 19px;
    .name{
      margin-bottom: 2px;
      margin-top:0;
    }
    &:first-child{
      padding-top: 0;
    }
  }

  .height300 {
    height: 300px;
    width: 100%;
  }
  .noData{
    display: flex; justify-content: space-between;align-items: center;width: 100%;height: 100%;
    div{
      width: 100%;text-align: center
    }
  }
</style>
<style>
  .el-progress-bar{width: 93%}
</style>
