<template>
  <div class="userList-container">
    
    <!-- 条件 -->
    <div class="filter-container">
      <p>以下3个参数为必填</p>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="会员名" :clearable="true" v-model="listQuery.userName">
      </el-input>

      <el-date-picker
        style="vertical-align: top;"
        v-model="listQuery.queryDate"
        format="yyyy-MM-dd"
        :editable="dateEditable"
        type="date"
        align="right"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-select v-model="listQuery.type" :clearable="true" placeholder="类型" style="vertical-align: top;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">模拟抽奖测试提交</el-button>

      <div class="">
        <p>接口返回结果：</p>
        <p v-html="resResult"></p>
      </div>
    </div>
   
  </div>
</template>

<script>
import { Message } from 'element-UI';
import { global } from '@/global/global';
import { api } from '@/global/api';
import md5 from 'blueimp-md5';
import {formatDate} from '@/filters/index';

export default {
  data() {
    const validateUserName = (rule, value, callback) => {
        let vm = this;
        vm.isExistUser(value, function(result){
            if(!result){
                //此处，需要交给接口校验账户名是否重复
                callback(new Error('用户名重复， 请重新输入'));
            }else{
                callback();
            }
        });
    }
    const validateNewPassword2 = (rule, value, callback) => {
        if (value !== this.passwordForm.newPassword) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
    };
    return {
        list: null,//表格list [].push({})
        total: null,
        showFileList:false,
        listLoading: false,
        dateEditable:false,
        resResult: null,
        options: [
          /*{
            value: null,
            label: '全部'
          },*/
          {
            value: '1',
            label: '红包'
          }, {
            value: '2',
            label: '爆竹'
          }, 
        ],
        
        listQuery: {
            currPage: 1,
            pageSize: 10,
            userName: '',
            queryDate: '',
            type: '1',
        },
        
        userQuery : {
            userName: ''
        },
        userQueryList: [],
        passwordType: 'password',
        rules: {
          /*userName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
            { required: true, trigger: 'blur' , validator: validateUserName}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, message: '1个字符以上', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择用户权限', trigger: 'change' }
          ]*/
        },
        
    }
  },
  filters: {
      roleFilterTip(role) {
          const roleMap = ['超级管理员', '管理员', '一般会员'];
          return roleMap[role - 10010];
      }
  },
  mounted() {
    let vm = this;
    //vm.getList();
  },
  methods: {
    
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        vm.resResult = ''

        let par = vm.listQuery;
        console.log('入参1：',par)
        if(!par.userName || !par.queryDate || !par.type){
          alert('条件不能为空')
          return false
        }
        //par.queryDate = new Date(par.queryDate)
        /*if(par.queryDate){
            let beginDate = formatDate(par.queryDate);
            
            par.beginDate = beginDate;
            par.endDate = beginDate;
        }*/

        console.log('入参2：',par)
        let _url = par.type == 1 ? api.lotteryType1:api.lotteryType2

        global.post( _url , par,null,function(res){
                // console.log('获取到数据-------：',JSON.stringify(res) )
                let data = res.body;
               if(data.resultCode == 0){ 
                    
                    vm.resResult = data;
                    console.log('列表数据：',vm.resResult);
                    
                    
               }else{
                    Message({
                        showClose: true,
                        message: res.body.resultMsg,
                        type: 'error'
                    });
                    
               }
        }, function(res){
            vm.listLoading = false;
        }, false)
    },
    
    //搜索
    handleFilter() {
        this.getList();
    },
    
    togglePasswordType() {
        if (this.passwordType === 'text') {
          this.passwordType = 'password'
        } else {
          this.passwordType = 'text'
        }
    },
    
  }
};
</script>

<style scoped>
  .upload-demo{
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
  }
  .userList-container {
    padding: 10px;
  }
  .userList-container .el-icon-information {
      position: absolute;
      right: -18px;
      top: 10px;
  }
</style>
