// @ts-nocheck
import { ApplyPluginsType, dynamic } from '/Users/pikeman/Downloads/github/TestBankPlatform/node_modules/@umijs/runtime';
import { plugin } from './plugin';
import LoadingComponent from '@/components/PageLoading/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/user",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__UserLayout' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/layouts/UserLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "name": "login",
        "path": "/user/login",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__login' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/user/login'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__SecurityLayout' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/layouts/SecurityLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/layouts/BasicLayout'), loading: LoadingComponent}),
        "authority": [
          "admin",
          "user"
        ],
        "routes": [
          {
            "path": "/",
            "redirect": "/welcome",
            "exact": true
          },
          {
            "path": "/welcome",
            "name": "welcome",
            "icon": "smile",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Welcome' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/Welcome'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "path": "/admin",
            "name": "admin",
            "icon": "crown",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Admin' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/Admin'), loading: LoadingComponent}),
            "authority": [
              "admin"
            ],
            "routes": [
              {
                "path": "/admin/sub-page",
                "name": "sub-page",
                "icon": "smile",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Welcome' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/Welcome'), loading: LoadingComponent}),
                "authority": [
                  "admin"
                ],
                "exact": true
              }
            ]
          },
          {
            "path": "/dataAnalysis",
            "name": "dataAnalysis",
            "icon": "area-chart",
            "routes": [
              {
                "path": "/dataAnalysis/managementData",
                "name": "managementData",
                "icon": "bar-chart",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataAnalysis__managementData' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/DataAnalysis/managementData'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/dataAnalysis/schoolData",
                "name": "schoolData",
                "icon": "dot-chart",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataAnalysis__schoolData' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/DataAnalysis/schoolData'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/dataAnalysis/personData",
                "name": "personData",
                "icon": "line-chart",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataAnalysis__personData' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/DataAnalysis/personData'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/questionBank",
            "name": "questionBank",
            "icon": "bank",
            "routes": [
              {
                "path": "/questionBank/share",
                "name": "share",
                "icon": "share-alt",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__questionBank__share' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/questionBank/share'), loading: LoadingComponent}),
                "authority": [
                  "admin"
                ],
                "exact": true
              },
              {
                "path": "/questionBank/manage",
                "name": "manage",
                "icon": "diff",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__questionBank__manage' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/questionBank/manage'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "hideInMenu": true,
                "path": "/questionBank/manage/detail/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__questionBank__detail' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/questionBank/detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/questionBank/fast",
                "name": "fast",
                "icon": "pull-request",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Welcome' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/Welcome'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/questionBank/personalQuestion",
                "name": "personalQuestion",
                "icon": "user-add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MyQuestion__List' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/MyQuestion/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "hideInMenu": true,
                "path": "/questionBank/personalQuestion/create",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MyQuestion__Create' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/MyQuestion/Create'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "hideInMenu": true,
                "path": "/questionBank/personalQuestion/edit/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MyQuestion__Create' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/MyQuestion/Create'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "hideInMenu": true,
                "path": "/questionBank/personalQuestion/detail/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__questionBank__detail' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/questionBank/detail'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/auditManage",
            "name": "auditManage",
            "icon": "audit",
            "routes": [
              {
                "path": "/auditManage/publishAudit",
                "name": "publishAudit",
                "icon": "file-protect",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Audit__SubQuestion' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/Audit/SubQuestion'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/auditManage/wrongAudit",
                "name": "wrongAudit",
                "icon": "exception",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Audit__WrongQuestion' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/Audit/WrongQuestion'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "hideInMenu": true,
                "path": "/auditManage/wrongAudit/detail/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__questionBank__detail' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/questionBank/detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "hideInMenu": true,
                "path": "/auditManage/publishAudit/detail/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__questionBank__detail' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/questionBank/detail'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/organizationManage",
            "name": "organizationManage",
            "icon": "reconciliation",
            "routes": [
              {
                "path": "/organizationManage/school",
                "name": "school",
                "icon": "read",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__OrgManagement__schoolManagement' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/OrgManagement/schoolManagement'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/organizationManage/person",
                "name": "person",
                "icon": "idcard",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__OrgManagement__personManagement' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/OrgManagement/personManagement'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/organizationManage/school/new",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__OrgManagement__schoolNew' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/OrgManagement/schoolNew'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/organizationManage/school/edit",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__OrgManagement__schoolEdit' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/OrgManagement/schoolEdit'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/systemConfig",
            "name": "systemConfig",
            "icon": "reconciliation",
            "routes": [
              {
                "path": "/systemConfig/subjectManage",
                "name": "subjectManage",
                "icon": "read",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__systemConfig__subjectManage' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/systemConfig/subjectManage'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/pikeman/Downloads/github/TestBankPlatform/src/pages/404'), loading: LoadingComponent}),
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
