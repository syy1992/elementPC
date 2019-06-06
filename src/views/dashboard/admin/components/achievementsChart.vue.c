<template>
    <div  ref='chart' :style="{height:height,width:width,padding:'10px 0'}"></div>
</template>
<script>
    import echarts from "echarts";  //引入echarts
    require('echarts/theme/macarons') // echarts theme
    import { debounce } from '@/utils'
    export default {
        name:'AchievementsChart',
        props: {
            xAxisdata:{
              type: Array,
              default: []
            },
          seriesdata1:{
              type: Array,
              default: []
            },
          seriesdata2:{
              type: Array,
              default: []
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
//        methods: {
//            //初始化图表
//            initChart(xAxisdata,seriesdata1,seriesdata2) {
//               let _this=this;
//               let colors = ['#5793f3', '#675bba'];
//               let  option = {
//                    color: colors,
//                   "title": {
//                       "text": "保费、出单量统计",
//                       x: "45%",
//                       textStyle: {
//                           color: '#90979c',
//                           fontSize: '22',
//                       },
//                   },
//                   "tooltip": {
//                       "trigger": "axis",
//                       "axisPointer": {
//                           "type": "shadow",
//                           textStyle: {
//                               color: "#fff"
//                           }
//
//                       },
//                   },
//                    grid: {
//                        right: '10%'
//                    },
//
//                    xAxis: [
//                        {
//                            type: 'category',
//                            axisTick: {
//                                alignWithLabel: true
//                            },
////                            data: ['产品1','产品2','产品3','产品4','产品5','产品6','产品7','产品8','产品9','产品10','产品11','产品12']
////                            data: _this.xAxisdata
//                            data: xAxisdata
//                        }
//                    ],
//                    yAxis: [
//                        {
//                            type: 'value',
//                            name: '出单量',
//                            min: 0,
////                            max: 250,
//                            position: 'right',
//                            axisLine: {
//                                lineStyle: {
//                                    color: colors[0]
//                                }
//                            },
//                            axisLabel: {
//                                formatter: '{value} 次'
//                            },
//                            splitLine: {    //网格线
//                              lineStyle: {
//                                type: 'dashed'    //设置网格线类型 dotted：虚线   solid:实线
//                              },
//                              show: true //隐藏或显示
//                            }
//                        },
//
//
//                        {
//                            type: 'value',
//                            name: '保费',
//                            min: 0,
//                          /*  max: 25,*/
//                            position: 'left',
//                            axisLine: {
//                                lineStyle: {
//                                    color: colors[1]
//                                }
//                            },
//                            axisLabel: {
//                                formatter: '{value} 元'
//                            },
//                            splitLine :{    //网格线
//                              lineStyle:{
//                                type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
//                              },
//                              show:true //隐藏或显示
//                            }
//                        }
//                    ],
//                   "dataZoom": [{
//                       "show": true,
//                       "height": 30,
//                       "xAxisIndex": [
//                           0
//                       ],
//                       bottom: 0,
//                       "start": 10,
//                       "end": 80,
//                       handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
//                       handleSize: '110%',
//                       handleStyle: {
//                           color: "#d3dee5",
//
//                       },
//                       textStyle: {
//                           color: "#000"
//                       },
//                       borderColor: "#90979c"
//
//
//                   }, {
//                       "type": "inside",
//                       "show": true,
//                       "height": 15,
//                       "start": 1,
//                       "end": 35
//                   }],
//                    series: [
//                        {
//
//                            name:'出单量',
//                            type:'bar',
//                            barMaxWidth:40,//最大宽度
////                            data:[5, 10, 7, 23, 25, 76, 135, 162, 32, 20, 64, 33]
////                            data:_this.seriesdata1
//                            data:seriesdata1
//                        },
//                        {
//                            name:'保费',
//                            type:'line',
//                            yAxisIndex: 1,
////                            data:[12000.0, 22000.2, 33220.3, 40010.5, 11226.3, 13000.2, 25178.3, 20923.4, 22533.0, 16090.5, 17772.0, 36001.2]
////                            data:_this.seriesdata2
//                            data:seriesdata2
//                        }
//                    ]
//                };
//                this.chart = echarts.init(this.$refs.chart);   //定义
////                this.chart.showLoading();  //等待的显示
//                this.chart.setOption(option);  //展示
//                this.chart.resize(); //刷新画布
//            },
//            resize() {
//                if (this.chart) {
//                    this.chart.resize();
//                }
//            }
//        },
//        created() {
//          this.$nextTick(() => {     //初始化
//            this.initChart(this.xAxisdata,this.seriesdata1,this.seriesdata2);
////                this.getChartData(this.productNos);
////                this.getChartData();
//            window.addEventListener("resize", () => {
//              this.resize();           //监听屏幕大小，来刷新画布
//            });
//          });
//        },
//        mounted() {
//          window.addEventListener("resize", () => {
//            this.resize();           //监听屏幕大小，来刷新画布
//          });
//
//        },




      mounted() {
        this.initChart(this.xAxisdata,this.seriesdata1,this.seriesdata2)
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
        initChart(xAxisdata,seriesdata1,seriesdata2) {
//          this.chart = echarts.init(this.$el, 'macarons')
          this.chart = echarts.init(this.$el, 'macarons')
          let _this=this;
          let colors = ['#5793f3', '#675bba'];
          this.chart.setOption({
            color: colors,
            "title": {
              "text": "保费、出单量统计",
              x: "45%",
              textStyle: {
                color: '#90979c',
                fontSize: '22',
              },
            },
            "tooltip": {
              "trigger": "axis",
              "axisPointer": {
                "type": "shadow",
                textStyle: {
                  color: "#fff"
                }

              },
            },
            grid: {
              right: '10%'
            },

            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
//                            data: ['产品1','产品2','产品3','产品4','产品5','产品6','产品7','产品8','产品9','产品10','产品11','产品12']
//                            data: _this.xAxisdata
                data: xAxisdata
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '出单量',
                min: 0,
//                            max: 250,
                position: 'right',
                axisLine: {
                  lineStyle: {
                    color: colors[0]
                  }
                },
                axisLabel: {
                  formatter: '{value} 次'
                },
                splitLine: {    //网格线
                  lineStyle: {
                    type: 'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                  },
                  show: true //隐藏或显示
                }
              },


              {
                type: 'value',
                name: '保费',
                min: 0,
                /*  max: 25,*/
                position: 'left',
                axisLine: {
                  lineStyle: {
                    color: colors[1]
                  }
                },
                axisLabel: {
                  formatter: '{value} 元'
                },
                splitLine :{    //网格线
                  lineStyle:{
                    type:'dashed'    //设置网格线类型 dotted：虚线   solid:实线
                  },
                  show:true //隐藏或显示
                }
              }
            ],
            "dataZoom": [{
              "show": true,
              "height": 30,
              "xAxisIndex": [
                0
              ],
              bottom: 0,
              "start": 10,
              "end": 80,
              handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '110%',
              handleStyle: {
                color: "#d3dee5",

              },
              textStyle: {
                color: "#000"
              },
              borderColor: "#90979c"


            }, {
              "type": "inside",
              "show": true,
              "height": 15,
              "start": 1,
              "end": 35
            }],
            series: [
              {

                name:'出单量',
                type:'bar',
                barMaxWidth:40,//最大宽度
//                            data:[5, 10, 7, 23, 25, 76, 135, 162, 32, 20, 64, 33]
//                            data:_this.seriesdata1
                data:seriesdata1
              },
              {
                name:'保费',
                type:'line',
                yAxisIndex: 1,
//                            data:[12000.0, 22000.2, 33220.3, 40010.5, 11226.3, 13000.2, 25178.3, 20923.4, 22533.0, 16090.5, 17772.0, 36001.2]
//                            data:_this.seriesdata2
                data:seriesdata2
              }
            ]
          })
        }
      }


    };
</script>

