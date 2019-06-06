<template>
  <div :class="className" :style="{height:height,width:width}"></div>
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
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    },
    premiumList:{
      type: Array,
      default: ()=>[]
    },
    timeList:{
      type: Array,
      default: ()=>[]
    },
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart(this.chartData)
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
//    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
//    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

//    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
//    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ timeList, premiumList } = {}) {
      this.chart.setOption({
//        title: {
//          subtext: '单位(元)',
//          left: '0',
//          bottom:'0',
//        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: timeList
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel:{formatter:'{value} 元'}
          }
        ],
        series: [
          {
            name: '保费',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {
              color: '#2d8cf0'
            }},
            data: premiumList,
            animationDuration: 2800,
          animationEasing: 'cubicInOut'
          }
        ]


//        xAxis: {
//          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
//          boundaryGap: false,
//          axisTick: {
//            show: false
//          }
//        },
//        grid: {
//          left: 10,
//          right: 10,
//          bottom: 20,
//          top: 30,
//          containLabel: true
//        },
//        tooltip: {
//          trigger: 'axis',
//          axisPointer: {
//            type: 'cross'
//          },
//          padding: [5, 10]
//        },
//        yAxis: {
//          axisTick: {
//            show: false
//          }
//        },
////        legend: {
////          data: ['期望', '周']
////        },
//        series: [{
//          name: '期望', itemStyle: {
//            normal: {
//              color: '#FF005A',
//              lineStyle: {
//                color: '#FF005A',
//                width: 2
//              }
//            }
//          },
//          smooth: true,
//          type: 'line',
//          data: expectedData,
//          animationDuration: 2800,
//          animationEasing: 'cubicInOut'
//        },
//        {
//          name: '周',
//          smooth: true,
//          type: 'line',
//          itemStyle: {
//            normal: {
//              color: '#3888fa',
//              lineStyle: {
//                color: '#3888fa',
//                width: 2
//              },
//              areaStyle: {
//                color: '#f3f8ff'
//              }
//            }
//          },
//          data: actualData,
//          animationDuration: 2800,
//          animationEasing: 'quadraticOut'
//        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
