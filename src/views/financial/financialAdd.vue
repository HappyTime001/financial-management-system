<template>
<div v-cloak>
    
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <el-form-item label="时间" prop="financialDate">
            <el-col :span="11" >
                
                <el-date-picker v-model="ruleForm.financialDate" :editable="dateEditable" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1" :change="dateChange()" range-separator="~">
                    </el-date-picker>
            </el-col>
      </el-form-item>
      <el-form-item label="公司入款" prop="companyIncome">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.companyIncome" ></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="线上支付" prop="onlinePay">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.onlinePay"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="人工存入" prop="manualDeposit">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.manualDeposit"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="充值合计" >
            <el-col :span="11" >
                <el-input type="number" v-model="rechargeTotal" readonly></el-input>
                <!-- {{rechargeTotal}} -->
            </el-col>
      </el-form-item>
      

      
      <el-form-item label="人工扣款" prop="manualDeductions">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.manualDeductions"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="出款金额" prop="expendTotal">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.expendTotal"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="充提差" >
            <el-col :span="11" >
                <el-input type="number" v-model="rechargeBalance" readonly></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="唯一充值用户" prop="prepaidUser">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.prepaidUser"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="ARPPU" >
            <el-col :span="11" >
                <el-input type="number" v-model="ARPPU" readonly></el-input>
            </el-col>
      </el-form-item>
    

      <el-form-item label="唯一提款用户" prop="drawingsUsr">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.drawingsUsr"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="流水" prop="watercourse">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.watercourse"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="损益" prop="downProfit">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.downProfit"></el-input>
            </el-col>
      </el-form-item>
     
      <el-form-item label="存款优惠" prop="depositDiscounts">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.depositDiscounts"></el-input>
            </el-col>
      </el-form-item>

      <el-form-item label="活动优惠" prop="activityDiscounts">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.activityDiscounts"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="日返水" prop="returnMoney">
            <el-col :span="11" >
                <el-input type="number" v-model="ruleForm.returnMoney"></el-input>
            </el-col>
      </el-form-item>
      <el-form-item label="净利润" >
            <el-col :span="11" >
                <el-input type="number" v-model="upProfits" readonly></el-input>
            </el-col>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
</div>
</template>
<script>
    import { Message } from 'element-ui';
    import {global} from 'src/global/global';
    import {api} from 'src/global/api';
    import {formatDate} from '@/filters/index';

    export default {
        data() {
          return {
            dateEditable:false,
            pickerOptions0: {
                readonlyDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            //日期配置
            pickerOptions1: {
                      shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                          picker.$emit('pick', new Date());
                        }
                      }, {
                        text: '昨天',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24);
                          picker.$emit('pick', date);
                        }
                      }, {
                        text: '一周前',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                          picker.$emit('pick', date);
                        }
                      }]
            },
            //表单属性
            ruleForm: {
              financialDate: new Date(),        //时间
              companyIncome: '',        //公司入款
              onlinePay: '',            //线上支付
              manualDeposit: '',        //人工存入
              //rechargeTotal: '',      //充值合计 公司入款+线上支付+人工存入
              //ARPPU: '',
              manualDeductions: '',
              expendTotal: '',
              // rechargeBalance: '',
              prepaidUser: '',      
              drawingsUsr: '',
              watercourse: '',
              downProfit: null,
              // upProfits: null,
              depositDiscounts: null,
              activityDiscounts: null,
              returnMoney: null,
            },
            //表单校验
            rules: {
              financialDate: [
                { required: true, message: '请选择日期', trigger: 'blur' },
                // { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
              ],
              companyIncome:[
                { required: true, message: '请输入公司入款', trigger: 'blur' },
              ],
              onlinePay:{ required: true, message: '不能为空！', trigger: 'blur' },
              manualDeposit:{ required: true, message: '不能为空！', trigger: 'blur' },
              manualDeductions:{ required: true, message: '不能为空！', trigger: 'blur' },
              expendTotal:{ required: true, message: '不能为空！', trigger: 'blur' },
              prepaidUser:{ required: true, message: '不能为空！', trigger: 'blur' },
              drawingsUsr:{ required: true, message: '不能为空！', trigger: 'blur' },
              watercourse:{ required: true, message: '不能为空！', trigger: 'blur' },
              downProfit:{ required: true, message: '不能为空！', trigger: 'blur' },
              depositDiscounts:{ required: true, message: '不能为空！', trigger: 'blur' },
              activityDiscounts:{ required: true, message: '不能为空！', trigger: 'blur' },
              returnMoney:{ required: true, message: '不能为空！', trigger: 'blur' },

              
            }
          };
        },
        //属性计算
        computed:{
            //充值合计 = 公司入款+线上支付+人工存入
            rechargeTotal: function(){
                let vm = this;
                let _rechargeTotal = Number(vm.ruleForm.companyIncome)+Number(vm.ruleForm.onlinePay)+Number(vm.ruleForm.manualDeposit)

                return _rechargeTotal;
            },
            //ARPPU = 充值合计/唯一充值用户 
            ARPPU: function(){
                let vm = this;
                let _prepaidUser = vm.ruleForm.prepaidUser?Number(vm.ruleForm.prepaidUser):1;

                return Number(vm.rechargeTotal) / _prepaidUser
            },
            //充提差 = 充值合计-出款金额
            rechargeBalance: function(){
                let vm = this;
                let _rechargeBalance = Number(vm.rechargeTotal)-Number(vm.ruleForm.expendTotal)
                return _rechargeBalance;
            },
            //净利润 = 损益 - 存款优惠 - 活动优惠 - 日返水 
            upProfits: function(){
                let vm = this;
                let _upProfits = Number(vm.ruleForm.downProfit)-Number(vm.ruleForm.depositDiscounts)-Number(vm.ruleForm.activityDiscounts)-Number(vm.ruleForm.returnMoney)

                console.log(_upProfits,typeof _upProfits)
                return !_upProfits ? 0 :  _upProfits;
            }
        },
        mounted() {
            var vm = this;

            //修改时再调用
            //vm.getFormData();

        },
        methods: {
            dateChange: function(){
                let vm = this;
                let _date = vm.ruleForm.financialDate;
                //框架校验需为string类型，
                //console.log("时间类型:", typeof _date.toString())
                vm.ruleForm.financialDate =  formatDate(vm.ruleForm.financialDate.toString());

                // let _year = new Date(vm.ruleForm.financialDate).getFullYear();
            },

            //根据id查询表单数据
            getFormData:function(){
                var vm = this;
                var data = this.$route.query;
                console.log('获取到url参数：',data);
                
            },
            submitForm(formName) {
              let vm = this;
              
              this.$refs[formName].validate((valid) => {
                if (valid) {
                      let par = vm.ruleForm;
                          par.rechargeTotal = vm.rechargeTotal;
                          par.ARPPU = vm.ARPPU;
                          par.rechargeBalance = vm.rechargeBalance;
                          par.upProfits = vm.upProfits;  

                      console.log('提交入参：',JSON.stringify(par) );

                      global.post(api.financialAdd,par,null,function(res){
                          console.log('插入数据成功，接口返回的数据为：',res)
                          //正式编程以下代码请放到接口成功回调函数中
                          Message({
                              showClose: true,
                              message: '提交成功，正在跳转页面……',
                              type: 'success'
                          })
                          setTimeout(()=>{
                              //this.$router.push('/');
                              vm.$router.push('/financialManage/financialList')
                          },2000)
                      },function(){
                          
                          
                      })
                      
                } else {
                    Message({
                        showClose: true,
                        message: '请按要求完善表单填写！',
                        type: 'warning'
                    })
                  console.log('error submit!!');
                  return false;
                }
              });
            },
            resetForm(formName) {
              this.$refs[formName].resetFields();
              // 等同于
              // this.ruleForm = {
              //   name: '',
              //   region: '',
              //   date1: '',
              //   date2: '',
              //   delivery: false,
              //   type: [],
              //   resource: '',
              //   desc: ''
              // }
            }
        }
      }
</script>

<style scoped>
/*[v-cloak] {
  display: none;
}*/
.component-item{
  margin-top: 100px;
}
.code-part{
  margin-top: 20px;
}
/*清除number默认属性*/

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0; 
}
input[type="number"]{-moz-appearance:textfield;}

input[readonly]{
        background-color: #eef1f6 !important;
        border-color: #d1dbe5;
        color: #bbb;
        cursor: not-allowed;
    }
</style>
