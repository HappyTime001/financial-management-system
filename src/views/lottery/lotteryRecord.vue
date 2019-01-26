<template>
  <div class="userList-container">
    
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="会员名" :clearable="true" v-model="listQuery.userName">
      </el-input>

      <el-date-picker
        style="vertical-align: top;"
        v-model="listQuery.queryDate"
        format="yyyy-MM-dd"
        :editable="dateEditable"
        type="daterange"
        align="right"
        placeholder="选择日期范围"
        :picker-options="pickerOptions2">
      </el-date-picker>
      <el-select v-model="listQuery.type" :clearable="true" placeholder="类型" style="vertical-align: top;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload" >导出</el-button>
      
      <!-- <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>
      
      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button> -->
    </div>
   
    <!-- 表格 -->
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <!-- <el-table-column type="selection" width="65">
         </el-table-column> -->

          <el-table-column align="center" label='序号' width="100px">
            <template scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>

          <el-table-column label="用户名" width="">
            <template scope="scope">
              {{scope.row.userName}}
            </template>
          </el-table-column>

          <el-table-column label="红包金额" width="">
            <template scope="scope">
              {{scope.row.money}}
            </template>
          </el-table-column>

          <el-table-column label="类型" width="">
            <template scope="scope">
              <span v-if="scope.row.type=='1'">红包</span>
              <span v-else>爆竹</span>
             
            </template>
          </el-table-column>

          <el-table-column label="时间" width="">
            <template scope="scope">
              {{scope.row.createDate | formatDate2 }}
            </template>
          </el-table-column>
          
    </el-table>

    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
        options: [
          /*{
            value: null,
            label: '全部'
          },*/
          {
            value: 1,
            label: '红包'
          }, {
            value: 2,
            label: '爆竹'
          }, 
        ],
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
            currPage: 1,
            pageSize: 10,
            userName: '',
            queryDate: '',
            type: '',
        },
        importMemberExcel: api.importMemberExcel,
        //新增弹窗表单
        temp: {
          'userName': '',
          'password': '',
          'nickname': '',
          'role': '10010',
          'remark': ''
        },
        userQuery : {
            userName: ''
        },
        userQueryList: [],

        userRoles: [{value : "是", label : "是"}, {value : "否", label : "否"}],
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
        //新增弹窗表单可见
        dialogFormVisible: false,

        //修改弹窗表单
        ruleForm: {
          'userName': '',
          'nickname': '',
          'role': '',
          'remark': ''
        },
        //修改弹窗表单可见
        dialogRuleFormVisible: false,

        multipleSelection: [],

        //修改密码弹窗
        passwordForm: {
            '_id': '',
            'newPassword':'',
            'newPassword2':''
        },
        passwordFormRules: {
            newPassword: [
                { required: true, trigger: 'blur', message: '新密码不能为空！'},
            ],
            newPassword2: [
                { required: true, trigger: 'blur', message: '重复密码不能为空！'},
                { required: true, trigger: 'blur' , validator: validateNewPassword2}
            ]
        },
        //修改密码弹窗可见
        changepassFormVisible: false
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
    vm.getList();
  },
  methods: {
    //excel上传
    handleChange(file, fileList) {
        // this.fileList3 = fileList.slice(-3);
        // console.log(file,'--------',fileList)
    },
    handleProgress:function(event, file, fileList){
        let vm = this;
       
        vm.listLoading = true;
    },
    handleSuccess:function(response, file, fileList){
        let vm = this;

        vm.listLoading = false;
        vm.$message({
            showClose: true,
            message: '导入成功',
            type: 'success'
        });
        //上传成功 重新加载列表
        vm.getList();
    },
    initTemp(){
      let vm = this;
      vm.temp = {
          'userName': '',
          'password': '',
          'nickname': '',
          'role': '',
          'remark': ''
      }
    },
    initPassTemp() {
      let vm = this;
      vm.passwordForm = {
        'changePassId': '',
        'newPassword':'',
        'newPassword2':''
      }
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

        global.get( api.lotteryRecordList, { params: par },function(res){
                // console.log('获取到数据-------：',JSON.stringify(res) )
                let data = res.body;
               if(data.resultCode == 0){ 
                    
                    vm.list = data.data.data;
                    console.log('列表数据：',vm.list);
                    vm.listQuery.currPage = data.data.currPage;
                    vm.listQuery.pageSize = data.data.pageSize;
                    vm.total = data.data.total;

                    vm.listLoading = false;
                    
               }else{
                    Message({
                        showClose: true,
                        message: res.body.resultMsg,
                        type: 'error'
                    });
                    vm.listLoading = false;
               }
        }, function(res){
            vm.listLoading = false;
        }, false)
    },
    //编辑
    handleEdit(index,row){
        let vm = this;
        vm.dialogRuleFormVisible = true;
        console.log('编辑的row：',index,'-----',row);
        vm.getFormData(row._id);
    },

    //根据id查询表单数据
    getFormData (id){
        var vm = this;
        global.get( api.queryMemberItem, { params:{ 'id': id } }, function(res){
            console.log('-------根据id获取表单信息：',JSON.stringify(res) )
            if(res.body.resultCode == 0){
                var res = res.body.data;
                console.log('=====',res);
                vm.ruleForm = res;
                console.log('vm.ruleForm=====',vm.ruleForm);
            }else{
                Message({
                    showClose: true,
                    message: res.body.resultMsg,
                    type: 'error'
                });
            }
        },function(res){
            //失败回调
        },true)
    },

    //提交修改表单
    submitForm(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
            if (valid) {
                console.log('提交入参：',this.ruleForm);
                global.post( api.modifyMember, this.ruleForm, null, function(res){
                    Message({
                        showClose: true,
                        message: '提交成功',
                        type: 'success'
                    })
                    vm.getList();
                    /*setTimeout(()=>{
                        vm.getList();
                    },2000)*/
                },function(res){
                    alert('插入数据失败，接口返回的数据为：',res)
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
        vm.dialogRuleFormVisible = false;
    },

    //单个删除
    handleDelete(index,row){
        let vm = this;
        console.log('单个删除选择的row：',index,'-----',row);
        //前端删除。
        // vm.list.splice(index,1)
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            vm.delFun(row);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
        });
    },
    //调取接口的删除方法
    delFun(row){
      let vm = this;
      global.get( api.deleteUser, { params: {'id': row._id} },function(res){
          vm.getList();  
      },function(res){
          alert('删除报错')
          vm.listLoading = false;
      }, false)
    },
    //批量删除
    handleDelAll(){
        let vm = this;
        //判断是否选中删除行
        if(vm.multipleSelection.length === 0){
            this.$message({
              type: 'info',
              message: '请选择删除内容!'
            });
            return ;
        }
        console.log('批量删除选择的row：',vm.multipleSelection)
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定批量删除',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            //前端依次执行单个删除操作
            for (var index in vm.multipleSelection) {
                console.log('======',vm.multipleSelection[index])
                vm.delFun(vm.multipleSelection[index]);
            };
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
        }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
        });
    },
    //复选框
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    //操作分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //操作分页
    handleCurrentChange(val) {
        console.log('--------',val)
        this.listQuery.currPage = val;
        this.getList();
    },
    //搜索
    handleFilter() {
        this.getList();
    },
    //新增
    handleCreate() {
        //每次点击新增时 重置下新增表单数据，避免双向绑定的影响
        this.initTemp();
        this.dialogFormVisible = true;
    },
    //新增时验证账户是否重复
    isExistUser(value, callback){
        let vm = this;
        vm.userQuery.userName = value;
        global.get( api.existUser, { params: vm.userQuery },function(res){
            console.log('userQueryList列表数据：',res);
            let data = res.body;
            if(data.resultCode == 0){ 
                vm.userQueryList = data.data;
                if(vm.userQueryList.length > 0){
                  callback(false);
                  return;
                }
                callback(true);
            }else{
                Message({
                    showClose: true,
                    message: "",
                    type: 'error'
                });
            }
        }, function(res){
            vm.listLoading = false;
        }, false)
    },
    //新增提交
    handleCreateSubmit(formName){
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //密码加密
            vm.temp.password = md5('@lss'+vm.temp.password);

            console.log('提交入参：',vm.temp);

            global.post( api.addUser, vm.temp, null, function(res) {
                console.log('插入数据成功，接口返回的数据为：',res)
                //正式编程以下代码请放到接口成功回调函数中
                vm.$message({
                    showClose: true,
                    message: '提交成功，正在刷新数据...',
                    type: 'success'
                })
                setTimeout(()=>{
                    vm.getList();
                },2000)

                vm.dialogFormVisible = false;
            }, function(){
                console.log('插入数据失败')
                vm.dialogFormVisible = false;
            }, false)
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
    },
    togglePasswordType() {
        if (this.passwordType === 'text') {
          this.passwordType = 'password'
        } else {
          this.passwordType = 'text'
        }
    },
    handleChangePass(index, row) {
        let vm = this;
        //每次点击修改密码时 重置下新增表单数据，避免双向绑定的影响
        vm.initPassTemp();
        vm.changepassFormVisible = true;
        vm.passwordForm._id = row._id;
    },
    handlePwdModifySubmit(formName){
        let vm = this;
        this.$refs[formName].validate((valid) => {
            if (valid) {
                //密码加密
                vm.passwordForm.newPassword = md5('@lss'+vm.passwordForm.newPassword);
                vm.passwordForm.newPassword2 = md5('@lss'+vm.passwordForm.newPassword2);

                vm.passwordForm = {
                    '_id' : vm.passwordForm._id,
                    'password' : vm.passwordForm.newPassword
                }

                console.log('修改密码提交入参===：',vm.passwordForm);

                global.post( api.modifyUser, vm.passwordForm, null, function(res) {
                    console.log('插入数据成功，接口返回的数据为：',res)
                    vm.$message({
                        showClose: true,
                        message: '修改密码成功！',
                        type: 'success'
                    })
                    setTimeout(()=>{
                        vm.getList();
                    },2000)

                    vm.changepassFormVisible = false;
                }, function(){
                    console.log('修改密码失败！')
                    vm.changepassFormVisible = false;
                }, false)
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    //导出操作
    handleDownload() {
      let vm = this;

      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['用户名','红包金额','类型','时间'];
        const filterVal = ['userName','money','type','createDate'];
        const list = vm.list;
        const data = vm.formatJson(filterVal, list);

        let date = formatDate(new Date())
        export_json_to_excel(tHeader, data, '导出的抽奖记录列表excel '+date);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
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
