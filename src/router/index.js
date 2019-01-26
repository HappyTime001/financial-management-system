import Vue from 'vue';
import Router from 'vue-router';

const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow
// 所以只在生产中使用延迟加载

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');
const sendPWD = _import('login/sendpwd');
const reset = _import('login/reset');

/* components */
// const Tinymce = _import('components/tinymce');
// const Mixin = _import('components/mixin');

/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');


const PersonalInfo = _import('index/personalInfo');
const Readme = _import('index/readme');

/* 系统管理*/
const PermissionsManage = _import('systemSet/permissionsManage');
/*用户管理*/
const UserList = _import('user/userList');
/* 数据管理*/
const FinancialList = _import('financial/financialList');
const FinancialAdd = _import('financial/financialAdd');
const FinancialUpdate = _import('financial/financialUpdate');
const FinancialEchart = _import('financial/financialEchart');

/*抽奖管理*/ 
const MemberManage = _import('lottery/memberManage')
const LotteryRecord = _import('lottery/lotteryRecord')
const LotteryTest = _import('lottery/lotteryTest')
Vue.use(Router);

 /**
  * icon : 菜单图标
  * hidden : true不显示在菜单栏
  * redirect : noredirect 为不重定向
  * noDropdown : true 不显示子菜单
  * meta : { role: ['admin'] }  will control the page role
  **/

const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/authredirect', component: authRedirect, hidden: true },
  { path: '/sendpwd', component: sendPWD, hidden: true },
  { path: '/reset', component: reset, hidden: true },
  { path: '/404', component: Err404, hidden: true },  //假地址时重定向
  { path: '/401', component: Err401, hidden: true },  //无权限时重定向

  {
    path: '/',
    //component: Layout,
    redirect: '/financialManage/financialList',  //重定向到默认首页
   
    hidden: true,
    
  },
  {
    path: '/index',
    component: Layout,
    redirect: 'noredirect',
    name: '',
    // icon: 'EXCEL',
    noDropdown: true,
    children: [
        { path: 'readme', component: Readme, name: '系统说明' },
        { path: 'personalInfo', component: PersonalInfo, name: '个人信息' }
    ]
  },
  

  {
    path: '/errorpage',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    // icon: '404',
    children: [
      { path: '401', component: Err401, name: '401' },
      { path: '404', component: Err404, name: '404' }
    ]
  },
  {
    path: '/systemSet',
    component: Layout,
    redirect: 'noredirect',
    name: '系统设置',
    // icon: '404',
    children: [
      { path: 'permissionsManage', component: PermissionsManage, name: '权限管理' },
      
    ]
  },
  
  {
    path: '/financialManage',
    component: Layout,
    redirect: 'noredirect',
    name: '数据管理',
    // icon: '404',
    children: [
      { path: 'financialList', component: FinancialList, name: '数据列表' },
      { path: 'financialAdd', component: FinancialAdd, name: '数据添加' },
      { path: 'financialUpdate', component: FinancialUpdate, name: '数据修改' },
      { path: 'financialEchart', component: FinancialEchart, name: '图表呈现' },
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    name: '账号管理',
    children: [
      { path: 'userList', component: UserList, name: '账号列表' } 
    ]
  },

  {
    path: '/lottery',
    component: Layout,
    redirect: 'noredirect',
    name: '抽奖管理',
    children: [
      { path: 'memberManage', component: MemberManage, name: '会员管理' },
      { path: 'lotteryRecord', component: LotteryRecord, name: '抽奖记录' },
      { path: 'lotteryTest', component: LotteryTest, name: '抽奖测试' },
    ]
  },
  
  // { path: '/', redirect: '/excel', hidden: true },
  { path: '*', redirect: '/404', hidden: true }
  

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: '首页',
  //   hidden: true,
  //   children: [{ path: 'dashboard', component: dashboard, name: '首页'  }]
  // },

  
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

// export const asyncRouterMap = [
  
// ];
