<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--<div class='card-panel' @click="handleSetLineChartData('newVisitis')">-->
      <div class='card-panel' >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总保费</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="dayData.allPremium" :duration="1000"></count-to>
          <!--<count-to class="card-panel-num" :startVal="0" :endVal="1022400" :duration="1000"></count-to>-->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--<div class="card-panel" @click="handleSetLineChartData('messages')">-->
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总单数</div>
          <!--<count-to class="card-panel-num" :startVal="0" :endVal="1802" :duration="1000"></count-to>-->
          <count-to class="card-panel-num" :startVal="0" :endVal="dayData.allContract" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--<div class="card-panel" @click="handleSetLineChartData('purchases')">-->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日保费</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="dayData.dayPremium" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <!--<div class="card-panel" @click="handleSetLineChartData('shoppings')">-->
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">今日单量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="dayData.dayContract" :duration="1000"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props:{
    dayData:{
      type: Object,
      default: null
    }
  },
  data(){
      return {
//          dayData:{}
      }
  },
  methods: {
      getHomeData(){
        this.$emit('handleHomeData',this.dayData)
//        let url=process.env.BASE_URL+process.env.commonPort+ '/dingPC/common/homeData';
//        this.$http.post(url, {}).then((response) => {
//            console.log(response)
////          this.loading = false
//
//        }).catch(() => {
////          this.loading = false
//        })
      }
//    handleSetLineChartData(type) {
//      this.$emit('handleSetLineChartData', type)
//    }
  },
  created(){
      this.getHomeData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  $type: screen;
  $proto: min-width;
  $proto2: max-width;
  $value: 750px;
 .svg-icon{
    width: 1em;
    height: 1em;
    vertical-align: -.15em;
    fill: currentColor;
    overflow: hidden;
  }
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    /*&:hover {*/
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #F25962;
      }
      .icon-message {
        background: #2EC7CA;
      }
      .icon-money {
        background: #5AB1EF;
      }
      .icon-shoppingCard {
        background: #FFAE6C
      }
    /*}*/
    /*.icon-people {*/
      /*color: #40c9c6;*/
    /*}*/
    /*.icon-message {*/
      /*color: #36a3f7;*/
    /*}*/
    /*.icon-money {*/
      /*color: #f4516c;*/
    /*}*/
    /*.icon-shoppingCard {*/
      /*color: #34bfa3*/
    /*}*/





    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      @media #{$type} and ($proto2: $value) {
        margin: 26px 0 0 10px;
      }

    }
    .card-panel-icon {
      float: left;
      /*font-size: 48px;*/
      @media #{$type} and ($proto: $value) {
        font-size: 48px;
      }
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
     /* margin: 26px  20px;*/
      @media #{$type} and ($proto: $value) {
        margin: 26px  20px;
      }
      @media #{$type} and ($proto2: $value) {
        margin: 26px 0 26px 5px;
      }
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
        @media #{$type} and ($proto2: $value) {
          line-height: 16px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
          margin-bottom: 12px;
        }
      }
      .card-panel-num {
        font-size: 20px;
        @media #{$type} and ($proto2: $value) {
          font-size: 14px;
        }
      }


    }
  }
}
</style>
