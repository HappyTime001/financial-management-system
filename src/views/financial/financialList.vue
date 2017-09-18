<template>
  <div class="app-container">
   
    <!-- 搜索条件 -->
    <div class="filter-container">
     
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
      <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>

      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
     
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

          <el-table-column label="时间" width="">
            <template scope="scope">
              {{scope.row.financialDate | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="公司入款" width="">
            <template scope="scope">
              {{scope.row.companyIncome}}
            </template>
          </el-table-column>
          <el-table-column label="线上支付" width="">
            <template scope="scope">
              {{scope.row.onlinePay}}
            </template>
          </el-table-column>
          <el-table-column label="人工存入" width="">
            <template scope="scope">
              {{scope.row.manualDeposit}}
            </template>
          </el-table-column>
          <el-table-column label="充值合计" width="">
            <template scope="scope">
              {{scope.row.rechargeTotal}}
            </template>
          </el-table-column>

          <el-table-column label="ARPPU" width="">
            <template scope="scope">
              {{scope.row.ARPPU}}
            </template>
          </el-table-column>
          <el-table-column label="人工扣款" width="">
            <template scope="scope">
              {{scope.row.manualDeductions}}
            </template>
          </el-table-column>
          <el-table-column label="出款金额" width="">
            <template scope="scope">
              {{scope.row.expendTotal}}
            </template>
          </el-table-column>
          <el-table-column label="充提差" width="">
            <template scope="scope">
              {{scope.row.rechargeBalance}}
            </template>
          </el-table-column>
          <el-table-column label="唯一充值用户" width="">
            <template scope="scope">
              {{scope.row.prepaidUser}}
            </template>
          </el-table-column>

          <el-table-column label="唯一提款用户" width="">
            <template scope="scope">
              {{scope.row.drawingsUsr}}
            </template>
          </el-table-column>
          <el-table-column label="流水" width="">
            <template scope="scope">
              {{scope.row.watercourse}}
            </template>
          </el-table-column>
          <el-table-column label="损益" width="">
            <template scope="scope">
              {{scope.row.downProfit}}
            </template>
          </el-table-column>
          <el-table-column label="净利润" width="">
            <template scope="scope">
              {{scope.row.upProfits}}
            </template>
          </el-table-column>
          <el-table-column label="存款优惠" width="">
            <template scope="scope">
              {{scope.row.depositDiscounts}}
            </template>
          </el-table-column>

          <el-table-column label="活动优惠" width="">
            <template scope="scope">
              {{scope.row.activityDiscounts}}
            </template>
          </el-table-column>
          <el-table-column label="日返水" width="">
            <template scope="scope">
              {{scope.row.returnMoney}}
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
    <el-dialog title="表单新增" :visible.sync="dialogFormVisible">
          <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
         
           

            <el-form-item label="字段1">
              <el-input v-model="temp.chnlId"></el-input>
            </el-form-item>

            <el-form-item label="字段2">
              <el-input v-model="temp.hisChnlId"></el-input>
            </el-form-item>

            <el-form-item label="字段3">
              <el-input v-model="temp.chnlName"></el-input>
            </el-form-item>

            <el-form-item label="字段4">
              <el-input v-model="temp.state"></el-input>
            </el-form-item>

           
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
           
            <el-button type="primary" @click="handleCreateSubmit">确 定</el-button>
          </div>
    </el-dialog>

  </div>
</template>

<script>
// import { getList } from 'api/article';
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import {formatDate} from '@/filters/index';


export default {
  data() {
    return {
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
        list: null,//表格list [].push({})
        total: null,
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10,

            queryDate: '',
            
               
        },
        temp: {
          "chnlId": "",
          "hisChnlId": "",
          "chnlName": "",
          "state": "",
          "isavailable": "",
          "orderNum": 10
        },
        typeOptions:[
          { key: '001', display_name: '类型1' },
          { key: '002', display_name: '类型2' },
          { key: '003', display_name: '类型3' }
         
        ],
        dialogFormVisible: false,
        multipleSelection: []

    }
  },
  //过滤器--时间格式化。临时写法
  filters: {
        formatDate: function(value) {
            return formatDate(value);
            
            // let _year = new Date(value).getFullYear(),
            //     _month = new Date(value).getMonth()+1,
            //     _date = new Date(value).getDate();

            // let formatDate = _year+'-'+_month+'-'+_date
            // return formatDate;
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
          "chnlId": "",
          "hisChnlId": "",
          "chnlName": "",
          "state": "",
          "isavailable": "",
          "orderNum": 10
      }
    },
    //获取列表数据
    getList() {
        let vm = this;

        vm.listLoading = true;
       
        let par = vm.listQuery;
        console.log('入参1：',par)
        let beginDate = formatDate(par.queryDate[0]);
        let endDate = formatDate(par.queryDate[1]);
        par.beginDate = beginDate;
        par.endDate = endDate;

        console.log('入参2：',par)

        global.get( api.financialList,{params: par },function(res){
                //console.log('-------获取到数据：',JSON.stringify(res) )
                let data = res.body;
               if(data.resultCode == 0){ 
                    
                    vm.list = data.data.data;
                    console.log('列表数据：',vm.list);
                    vm.listQuery.currPage = data.data.currPage;
                    vm.listQuery.pageSize = data.data.pageSize;
                    vm.total = data.data.total;

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
    //编辑
    handleEdit(index,row){
        let vm = this;
        console.log('编辑的row：',index,'-----',row);
        //跳页面进行修改
        //this.$router.push('/example/form'); 
        this.$router.push( { path: '/financialManage/financialUpdate', query: { id: row._id } } ); //带参跳转
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
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });          
        });

        
        

    },
    //调取删除接口的删除方法
    delFun(row){
      let vm = this;
      global.get( api.financialDel,{params: {'id':row['_id']} },function(res){
              //console.log('-------获取到数据：',JSON.stringify(res) )
            vm.getList();  
             
              
      },function(res){
          alert('删除报错')
          vm.listLoading = false;
      },false)
    },
    //批量删除
    handleDelAll(){
        let vm = this;
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
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });          
        });
    },
    //搜索
    handleFilter() {
      this.getList();
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
    //新增
    handleCreate() {
        //每次点击新增时 重置下新增表单数据，避免双向绑定的影响
        // this.initTemp();

        // this.dialogFormVisible = true;
        //跳到新增页面
        this.$router.push('/financialManage/financialAdd')
    },
    //新增提交
    handleCreateSubmit(){
        let vm = this;
        console.log('新增入参：',vm.temp)

        //这里作演示用，正式新增 请提交到接口
        vm.list.push(vm.temp)
        console.log('新增后',vm.list)
        
        this.dialogFormVisible = false;
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },

    handleDownload() {
      let vm = this;

      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['时间', '公司入款', '线上支付', '人工存入', '充值合计'];
        const filterVal = ['financialDate', 'companyIncome', 'onlinePay', 'manualDeposit', 'rechargeTotal'];
        const list = vm.list;
        const data = vm.formatJson(filterVal, list);

        let date = formatDate(new Date())
        export_json_to_excel(tHeader, data, '导出的列表excel '+date);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
};
</script>
