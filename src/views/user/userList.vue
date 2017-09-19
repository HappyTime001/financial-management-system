<template>
  <div class="app-container">
    
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="账号" v-model="listQuery.userName">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      
      <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>

      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
     
    </div>
   
    <!-- 表格 -->
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column type="selection" width="65">
         </el-table-column>

          <el-table-column align="center" label='序号' width="">
            <template scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>

          <el-table-column label="账号" width="">
            <template scope="scope">
              {{scope.row.userName}}
            </template>
          </el-table-column>

          <el-table-column label="姓名" width="">
            <template scope="scope">
              {{scope.row.nickname}}
            </template>
          </el-table-column>

          <el-table-column label="角色" width="">
            <template scope="scope">
              {{scope.row.permissions | roleFilterTip}}
            </template>
          </el-table-column>

          <el-table-column label="备注" width="">
            <template scope="scope">
              {{scope.row.remark}}
            </template>
          </el-table-column>

          <el-table-column align="center"  label="操作" >
              <template scope="scope">
                 <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                 <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
          </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
          <el-form class="small-space" :model="temp" :rules="rules" ref="temp" label-position="left" label-width="80px" style='width: 430px; margin-left:50px;'>

            <el-form-item label="账号" prop="userName">
              <el-input v-model="temp.userName"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password"></el-input>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input v-model="temp.nickname"></el-input>
            </el-form-item>

            <el-form-item label="用户权限" prop="permissions">
                <el-col :span="10" >
                    <el-select v-model="temp.permissions" placeholder="用户权限"  >
                       <el-option class="user_permissions" v-for="item in  userRoles" :key="item.key" :label="item.label" :value="item.key">
                       </el-option>
                    </el-select>
                 </el-col>
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
           
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
           
            <el-button type="primary" @click="handleCreateSubmit('temp')">确 定</el-button>
          </div>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑信息" :visible.sync="dialogRuleFormVisible">
          <el-form class="small-space" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="80px" style='width: 430px; margin-left:50px;'>

            <el-form-item label="账号" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input v-model="ruleForm.nickname"></el-input>
            </el-form-item>

            <el-form-item label="用户权限" prop="permissions">
                <el-col :span="10" >
                    <el-select v-model="ruleForm.permissions" placeholder="用户权限"  >
                       <el-option class="user_permissions" v-for="item in  userRoles" :key="item.key" :label="item.label" :value="item.key">
                       </el-option>
                    </el-select>
                 </el-col>
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="ruleForm.remark"></el-input>
            </el-form-item>
           
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRuleFormVisible = false">取 消</el-button>
           
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          </div>
    </el-dialog>

  </div>
</template>

<script>
import { Message } from 'element-UI';
import { global } from '@/global/global';
import { api } from '@/global/api';

export default {
  data() {
    return {
        list: null,//表格list [].push({})
        total: null,
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10,
            userName: ''
        },
        //新增弹窗表单
        temp: {
          'userName': '',
          'password': '',
          'nickname': '',
          'permissions': 3,
          'remark': ''
        },
        userRoles: [{key : 1, label : "超级管理员"}, {key : 2, label : "管理员"}, {key : 3, label : "一般会员"}],
        rules: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, message: '1个字符以上', trigger: 'blur' }
          ],
          // permissions: [
          //   { required: true, message: '请选择用户权限', trigger: 'change' }
          // ],
        },
        dialogFormVisible: false,
        //弹窗修改表单
        ruleForm: {
          'userName': '',
          'password': '',
          'nickname': '',
          'permissions': '',
          'remark': ''
        },
        dialogRuleFormVisible: false,
        multipleSelection: []
    }
  },
  filters: {
      roleFilterTip(role) {
          const roleMap = ['超级管理员', '管理员', '一般会员'];
          return roleMap[role - 1];
      }
  },
  mounted() {
    let vm = this;
    vm.getList();
  },
  methods: {
    initTemp(){
      let vm = this;
      vm.temp = {
          'userName': '',
          'password': '',
          'nickname': '',
          'permissions': '',
          'remark': ''
      }
    },
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        global.get( api.userList, { params: vm.listQuery },function(res){
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
        global.get( api.queryUserItem, { params:{ 'id': id } }, function(res){
            console.log('-------根据id获取表单信息：',JSON.stringify(res) )
            if(res.body.resultCode == 0){
                var res = res.body.data;

                console.log('=====',res);

                if(res.permissions === 1) {
                    res.permissions = "超级管理员"
                }else if(res.permissions === 2) {
                    res.permissions = "管理员"
                }else {
                    res.permissions = "一般会员"
                }

                vm.ruleForm = res
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
                global.post( api.modifyUser, this.ruleForm, null, function(res){
                    Message({
                        showClose: true,
                        message: '提交成功，正在跳转页面……',
                        type: 'success'
                    })
                    setTimeout(()=>{
                        vm.getList();
                    },2000)
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
        //判断是否选中删除内容
        if(vm.multipleSelection.length === 0){
            this.$message({
              type: 'info',
              message: '请选择删除内容!'
            });
            return ;
        }
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
    //新增提交
    handleCreateSubmit(formName){
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
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
        
    }
  }
};
</script>

<style scoped>
  .user_permissions {
    background-color: #fff;
  }
</style>
