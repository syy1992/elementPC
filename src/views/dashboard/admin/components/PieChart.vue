<template>
  <div class='height300'>
    <div :class="className" id='chart' :style="{height:height,width:width}" v-show='productList.length!=0'></div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    productNameList: {
      type: Array,
      default: ()=>[]
    },
    productList: {
      type: Array,
      default: ()=>[]
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
      this.$nextTick(()=>{
        this.initChart(this.productNameList,this.productList)
      })

    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(nameList,productList) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          bottom: '10',
          data:nameList
//          data:['校方公责险', '组织方责任险', '复兴重大疾病险', '展会险', '车险']
        },
        calculable: true,
        series: [
          {
            name: '热门产品',
            type: 'pie',
            roseType: 'radius',
            radius: [25, 90],
            center: ['55%', '48%'],
            data: productList,
//            data: [
//              { value: 320, name: '校方公责险' },
//              { value: 240, name: '组织方责任险' },
//              { value: 149, name: '复兴重大疾病险' },
//              { value: 100, name: '展会险' },
//              { value: 59, name: '车险' }
//            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
  .height300{
    width: 100%;
    height: 300px;
  }
</style>
