// https://umijs.org/config/
import {
  defineConfig
} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const {
  REACT_APP_ENV
} = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [{
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [{
      name: 'login',
      path: '/user/login',
      component: './user/login',
    },],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [{
      path: '/',
      component: '../layouts/BasicLayout',
      authority: ['admin', 'user'],
      routes: [{
        path: '/',
        redirect: '/welcome',
      },
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        component: './Admin',
        authority: ['admin'],
        routes: [{
          path: '/admin/sub-page',
          name: 'sub-page',
          icon: 'smile',
          component: './Welcome',
          authority: ['admin'],
        },],
      },
      // 数据分析tab
      {
        path: '/dataAnalysis',
        name: 'dataAnalysis',
        icon: 'area-chart',
        routes: [{
          path: '/dataAnalysis/managementData',
          name: 'managementData',
          icon: 'bar-chart',
          component: './DataAnalysis/managementData'
        },
        {
          path: '/dataAnalysis/schoolData',
          name: 'schoolData',
          icon: 'dot-chart',
          component: './DataAnalysis/schoolData'
        },
        {
          path: '/dataAnalysis/personData',
          name: 'personData',
          icon: 'line-chart',
          component: './DataAnalysis/personData'
        },
        ],
      },
      // 题库运营tab
      {
        path: '/questionBank',
        name: 'questionBank',
        icon: 'bank',
        // component: './Admin',
        routes: [
          {
            path: '/questionBank/share',
            name: 'share',
            icon: 'share-alt',
            component: './questionBank/share',

            authority: ['admin'],
          },
          {
            hideInMenu: true,
            path: '/questionBank/share/detail/:id',
            component: './questionBank/share/detail',
          },
          {
            path: '/questionBank/manage',
            name: 'manage',
            icon: 'diff',
            component: './questionBank/manage'
          },
          {
            hideInMenu: true,
            path: '/questionBank/manage/detail/:id',
            component: './questionBank/detail',
          },
          {
            path: '/questionBank/fast',
            name: 'fast',
            icon: 'pull-request',
            component: './Welcome'
          },
          {
            path: '/questionBank/personalQuestion',
            name: 'personalQuestion',
            icon: 'user-add',
            component: './MyQuestion/List',
          },
          {
            hideInMenu: true,
            path: '/questionBank/personalQuestion/create',
            component: './MyQuestion/Create'
          },
          {
            hideInMenu: true,
            path: '/questionBank/personalQuestion/edit/:id',
            component: './MyQuestion/Create'
          },
          {
            hideInMenu: true,
            path: '/questionBank/personalQuestion/detail/:id',
            component: './questionBank/detail',
          },
        ],
      },
      // 审核管理tab
      {
        path: '/auditManage',
        name: 'auditManage',
        icon: 'audit',
        routes: [{
          path: '/auditManage/publishAudit',
          name: 'publishAudit',
          icon: 'file-protect',
          component: './Audit/SubQuestion'
        },
        {
          path: '/auditManage/wrongAudit',
          name: 'wrongAudit',
          icon: 'exception',
          component: './Audit/WrongQuestion'
        },
        {
          hideInMenu: true,
          path: '/auditManage/wrongAudit/detail/:id',
          component: './questionBank/detail',
          // component: './Welcome'
        },
        {
          hideInMenu: true,
          path: '/auditManage/publishAudit/detail/:id',
          component: './questionBank/detail',
          // component: './Welcome'
        }
        ],
      },
      // 组织管理tab
      {
        path: '/organizationManage',
        name: 'organizationManage',
        icon: 'reconciliation',
        routes: [{
          path: '/organizationManage/school',
          name: 'school',
          icon: 'read',
          component: './OrgManagement/schoolManagement'
        },
        {
          path: '/organizationManage/person',
          name: 'person',
          icon: 'idcard',
          component: './OrgManagement/personManagement'
        },
        {
          path: '/organizationManage/school/new',
          component: './OrgManagement/schoolNew',
        },
        {
          path: '/organizationManage/school/edit',
          component: './OrgManagement/schoolEdit',
        },
        ],
      },
      {
        path: '/systemConfig',
        name: 'systemConfig',
        icon: 'reconciliation',
        routes: [{
          path: '/systemConfig/subjectManage',
          name: 'subjectManage',
          icon: 'read',
          component: './systemConfig/subjectManage'
        }]
      }
      ],
    },
    {
      component: './404',
    },
    ],
  },
  {
    component: './404',
  },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
