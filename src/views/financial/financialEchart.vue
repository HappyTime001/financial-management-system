<template>
  <div class="app-container">
   
    <!-- 搜索条件 -->
    <div class="filter-container">
        <!-- <el-select v-model="selectValue" placeholder="请选择">
            <el-option v-for="item in selectOpt" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select> -->

          <el-date-picker
            v-model="listQuery.queryDate"
            format="yyyy-MM-dd"
            :editable="dateEditable"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            :picker-options="pickerOptions2">
          </el-date-picker>
     

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <!-- <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>

      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button> -->
     
    </div>

    
   
    <!-- 图表 -->
    <el-row :gutter="20" style="margin-top:20px;">
       <!--  <div id="income">
          
        </div> -->

        <div id="chartLine" style="width:100%; height:400px;"></div>

        <!-- <el-col :span="20">
            <div id="income">
              
            </div>
        </el-col>

        <el-col :span="12">
            <div id="interest">
              
            </div>
        </el-col> -->

    </el-row>

  </div>
</template>

<script>
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import {formatDate} from '@/filters/index';
var echarts = require('echarts');

export default {
  data() {
    return {
        list: null,
        selectOpt: [
            {
              value: 'companyIncome',
              label: '公司入款'
            }, {
              value: 'onlinePay',
              label: '线上支付'
            }, {
              value: 'manualDeposit',
              label: '人工存入'
            }, {
              value: 'rechargeTotal',
              label: '充值合计'
            }, 
        ],
        selectValue: '',

        dateEditable:false,
        pickerOptions2: {
              shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              }, {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
        },
        listQuery: {
            // currPage: 1,
            // pageSize: 10,

            queryDate: '',
            
               
        },
    }
  },
  mounted() {
        var vm = this;
        
        vm.getList();

        // vm.drawLineChart();

   },
    
  methods: {
    drawLineChart0(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('income'));
        
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        // 指定图表的配置项和数据
        var option = {
                color: colors,

                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data:['2015 降水量', '2016 降水量']
                },
                grid: {
                    top: 70,
                    bottom: 50
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '降水量  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
                    },
                    // {
                    //     type: 'category',
                    //     axisTick: {
                    //         alignWithLabel: true
                    //     },
                    //     axisLine: {
                    //         onZero: false,
                    //         lineStyle: {
                    //             color: colors[0]
                    //         }
                    //     },
                    //     axisPointer: {
                    //         label: {
                    //             formatter: function (params) {
                    //                 return '降水量  ' + params.value
                    //                     + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                    //             }
                    //         }
                    //     },
                    //     data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
                    // }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    // {
                    //     name:'2015 降水量',
                    //     type:'line',
                    //     xAxisIndex: 1,
                    //     smooth: true,
                    //     data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    // },
                    {
                        name:'2016 降水量',
                        type:'line',
                        smooth: true,
                        data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
                    }
                ]
            };
        
        
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // 处理点击事件并且跳转到相应的百度搜索页面
        // myChart.on('click', function (params) {
        //     window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(params.name));
        // });
    },

    //绘制图表
    drawLineChart: function(xAxisData,seriesData) {
        let vm = this;

        vm.chartLine = echarts.init(document.getElementById('chartLine'));
        vm.chartLine.setOption({
            //标题组件，包含主标题和副标题。
            title: {
                // text: '财务情况'
            },
            //提示框组件。
            tooltip: {
                trigger: 'axis'
            },
            //图例组件。
            legend: {
                type: 'scroll',
                // show: false,
                left: '20px',
                top: '5px',
                // orient: 'vertical',//纵向
                // selectedMode: 'multiple',
                
                data: [
                    '公司入款','线上支付', '人工存入','充值合计','ARPPU',
                    '人工扣款','出款金额', '充提差','流水','损益',
                    '净利润','存款优惠', '活动优惠','日返水',
                ], //配置项可设置颜色
                selected: {
                    '公司入款': true,
                    '线上支付': false,
                    '人工存入': false,
                    '充值合计': false,
                    'ARPPU': false,

                    '人工扣款': false,
                    '出款金额': false,
                    '充提差': false,
                    '流水': false,
                    '损益': false,

                    '净利润': false,
                    '存款优惠': false,
                    '活动优惠': false,
                    '日返水': false,
                    

                }
            },
            //直角坐标系内绘图网格
            grid: {
                // show: true,
                left: '10px',
                right: '50px',
                bottom: '3%',
                containLabel: true
            },
            //直角坐标系 grid 中的 x 轴
            xAxis: {
                type: 'category',
                name: '日期',
                boundaryGap: false,
                data: xAxisData
                //['2011-1-1', '2012-1-2', '2013', '2014', '2015', '2016', '2017']
            },
            //直角坐标系 grid 中的 y 轴
            yAxis: {
                type: 'value',
                name: '金额（元）',
                // data:[0,50,100,200,8000]
            },
            //系列列表。每个系列通过 type 决定自己的图表类型
            series: [
                {
                    name: '公司入款',
                    type: 'line',
                    smooth: true,       //是否平滑曲线显示。
                    data: seriesData.companyIncome
                    
                },
                {
                    name: '线上支付',
                    type: 'line',
                    smooth: true,
                    data: seriesData.onlinePay
                },
                {
                    name: '人工存入',
                    type: 'line',
                    smooth: true,
                    data: seriesData.manualDeposit
                },
                {
                    name: '充值合计',
                    type: 'line',
                    smooth: true,       
                    data: seriesData.rechargeTotal
                    
                },
                {
                    name: 'ARPPU',
                    type: 'line',
                    smooth: true,
                    data: seriesData.ARPPU
                },



                {
                    name: '人工扣款',
                    type: 'line',
                    smooth: true,       //是否平滑曲线显示。
                    data: seriesData.manualDeductions
                    
                },
                {
                    name: '出款金额',
                    type: 'line',
                    smooth: true,
                    data: seriesData.expendTotal
                },
                {
                    name: '充提差',
                    type: 'line',
                    smooth: true,
                    data: seriesData.rechargeBalance
                },
                {
                    name: '流水',
                    type: 'line',
                    smooth: true,       
                    data: seriesData.watercourse
                    
                },
                {
                    name: '损益',
                    type: 'line',
                    smooth: true,
                    data: seriesData.downProfit
                },

                {
                    name: '净利润',
                    type: 'line',
                    smooth: true,       //是否平滑曲线显示。
                    data: seriesData.upProfits
                    
                },
                {
                    name: '存款优惠',
                    type: 'line',
                    smooth: true,
                    data: seriesData.depositDiscounts
                },
                {
                    name: '活动优惠',
                    type: 'line',
                    smooth: true,
                    data: seriesData.activityDiscounts
                },
                {
                    name: '日返水',
                    type: 'line',
                    smooth: true,       
                    data: seriesData.returnMoney
                    
                },
                


            ]
        });
    },
    //把list数据周转成echart需要的格式
    listData2echartData: function(){
        let vm = this;
        let listData = vm.list;
        console.log('列表数据：',listData);

        let seriesData = {

            financialDate : [],             //时间

            companyIncome : [],         //公司入款
            onlinePay : [],             //线上支付
            manualDeposit : [],         //人工存入
            rechargeTotal : [],         //充值合计
            ARPPU : [],                 //ARPPU

            manualDeductions : [],         //人工扣款
            expendTotal : [],             //出款金额
            rechargeBalance : [],         //充提差
            watercourse : [],           //流水
            downProfit : [],                 //损益

            upProfits : [],                 //净利润
            depositDiscounts : [],             //存款优惠
            activityDiscounts : [],         //活动优惠
            returnMoney : []               //日返水
        
        };
        // let financialDate,companyIncome,onlinePay,manualDeposit=[[],[],[],[],];
         

        for(var index in listData){
            for(var key in seriesData){  
                // alert(key); 
                seriesData[key].push(listData[index][key])
            }
            // //时间
            // seriesData.financialDate.push(listData[index]['financialDate'])
            // //数据
            // seriesData.companyIncome.push(listData[index]['companyIncome'])
            // seriesData.onlinePay.push(listData[index]['onlinePay'])
            // seriesData.manualDeposit.push(listData[index]['manualDeposit'])
        }
        //集成在到seriesData中
        // seriesData.companyIncome = companyIncome;
        // seriesData.onlinePay    = onlinePay;
        // seriesData.manualDeposit = manualDeposit;
        
        console.log('seriesData：',seriesData);
        //数据转换完，进行图表绘制，传参
        vm.drawLineChart(seriesData.financialDate,seriesData)

    },
    //获取列表数据
    getList() {
        let vm = this;

        vm.listLoading = true;
       
        let par = vm.listQuery;
        console.log('入参1：',par)
        if(par.queryDate){
            let beginDate = formatDate(par.queryDate[0]);
            let endDate = formatDate(par.queryDate[1]);
            par.beginDate = beginDate;
            par.endDate = endDate;
        }
        console.log('入参2：',par)

        global.get( api.financialList,{params: par },function(res){
                //console.log('-------获取到数据：',JSON.stringify(res) )
                let data = res.body;
               if(data.resultCode == 0){ 
                    
                    vm.list = data.data.data;
                    // console.log('列表数据：',vm.list);

                    vm.listData2echartData()
                    //数据回来 再执行图表绘制
                    // vm.drawLineChart();

                    // vm.listQuery.currPage = data.data.currPage;
                    // vm.listQuery.pageSize = data.data.pageSize;
                    // vm.total = data.data.total;

                    vm.listLoading = false;
                    
               }else{
                    //alert(res.body.resultMsg)
                    Message({
                        showClose: true,
                        message: res.body.resultMsg,
                        type: 'error'
                    });
                    vm.listLoading = false;
               }
               
                
        },function(res){
            
            vm.listLoading = false;
        },false)

    },
    
    //搜索
    handleFilter() {
      this.getList();
    },
    

    
  }
};
</script>

<style scoped>
    #income,#interest{
        width: 100%;
        height: 400px;
    }

</style>
