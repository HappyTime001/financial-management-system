<template>
    <div>
        <!-- 注意：路由表不能配置在后端，不然前端无法配置跳转到某些路由，例如提交成功后返回至某个固定路由 lss 2017-6-27 -->
        <!-- 菜单权限json（调试专用）：==={{ routes | json }} -->
        <template v-if="routes">
            <!-- 一级菜单 示例-->
           <!--  <router-link  to="/index/readme"  v-if="routes['/index/readme']" >
                <el-menu-item index="/index/readme">
                    <i class="el-icon-star-on" aria-hidden="true"></i> 系统说明
            
                </el-menu-item>
            </router-link> -->

            <!-- <router-link  to="/index/personalInfo"  v-if="routes['/index/personalInfo']" >
                <el-menu-item index="/index/personalInfo">
                    <i class="fa fa-home" aria-hidden="true"></i> 首页
            
                </el-menu-item>
            </router-link> -->

            
            

            <el-submenu index="数据管理" v-if="routes['/financialManage/financialList'] || routes['/financialManage/financialEchart']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 数据管理
                </template>
                    <router-link  class="menu-indent" to="/financialManage/financialList" >
                        <el-menu-item index="/financialManage/financialList">
                            基础数据
                        </el-menu-item>
                    </router-link>
                    <!-- <router-link  class="menu-indent" to="/financialManage/financialAdd" >
                        <el-menu-item index="/financialManage/financialAdd">
                            财务信息添加
                        </el-menu-item>
                    </router-link> -->
                    <router-link  class="menu-indent" to="/financialManage/financialEchart" >
                        <el-menu-item index="/financialManage/financialEchart">
                            图表呈现
                        </el-menu-item>
                    </router-link>
            </el-submenu>

            <el-submenu index="账号管理" v-if="routes['/user/userList']">
            
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 账号管理
                </template>
                    <router-link  class="menu-indent" to="/user/userList" v-if="routes['/user/userList']">
                        <el-menu-item index="/user/userList">
                            账号列表
                        </el-menu-item>
                    </router-link>
            </el-submenu>

            <el-submenu index="账号管理" >
            
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 抽奖管理
                </template>
                    <router-link  class="menu-indent" to="/lottery/memberManage" >
                        <el-menu-item index="/lottery/memberManage">
                            会员管理
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/lottery/lotteryRecord" >
                        <el-menu-item index="/lottery/lotteryRecord">
                            抽奖记录
                        </el-menu-item>
                    </router-link>
                    <router-link  class="menu-indent" to="/lottery/lotteryTest" >
                        <el-menu-item index="/lottery/lotteryTest">
                            抽奖测试
                        </el-menu-item>
                    </router-link>
            </el-submenu>

            <!-- <el-submenu index="系统管理" v-if="routes['/systemSet/permissionsManage'] || routes['/systemSet/loginLog']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 系统管理
                </template>
              
                    
                    <router-link  class="menu-indent" to="/systemSet/loginLog" v-if="routes['/systemSet/loginLog']">
                        <el-menu-item index="/systemSet/loginLog">
                            操作记录
                        </el-menu-item>
                    </router-link>
               
            </el-submenu> -->

        </template>    
        

    </div>
</template>

<script>
    //获取vuex中的菜单权限 进行菜单show展示。登陆成功时直接 返回菜单json 并包含帐户信息
    export default {
      name: 'SidebarItem',
      props: {
        routes: {
          // type: Array
        }
      },

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .wscn-icon {
        margin-right: 10px;
    }
    .fa{
        margin-right: 10px;
    }
    .hideSidebar .menu-indent{
        display: block;
        text-indent: 10px;
    }
</style>

