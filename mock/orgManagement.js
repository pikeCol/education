// eslint-disable-next-line import/no-extraneous-dependencies
// import {
// parse
// } from 'url';

function getSchool(req, res, ) {
  const data = {
    "pageNum": 1,
    "pageSize": 10,
    "records": [{
        "accountsNum": 32,
        "effectiveTime": '2020-10-01 至 2022-10-01',
        "id": 1,
        "name": '杭二中',
        "status": 1
      },
      {
        "accountsNum": 32,
        "effectiveTime": '2020-10-01 至 2022-10-01',
        "id": 2,
        "name": '杭中',
        "status": 1
      },
      {
        "accountsNum": 32,
        "effectiveTime": '2020-10-01 至 2022-10-01',
        "id": 3,
        "name": '二中',
        "status": 1
      }
    ],
    "total": 99
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function getAccounts(req, res, ) {
  const data = {
    "pageNum": 1,
    "pageSize": 10,
    "records": [{
      "createTime": '2020-12-23 23:23:23',
      "id": 1,
      "mail": '3424@QQ.COM',
      "nick": '也校长',
      "phone": '13912345678',
      "role": '管理员',
      "subjectInfo": '科学'
    }, {
      "createTime": '2020-08-23 13:23:23',
      "id": 11,
      "mail": '3412324@QQ.COM',
      "nick": '王先生',
      "phone": '13212345678',
      "role": '财务',
      "subjectInfo": '地理'
    }, {
      "createTime": '2020-10-23 03:23:23',
      "id": 111,
      "mail": '3222424@QQ.COM',
      "nick": '哈校长',
      "phone": '13312345678',
      "role": '政教处',
      "subjectInfo": '-'
    }],
    "total": 99
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function postNewSchool(req, res, ) {
  const data = {}
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function getSchoolDetail(req, res, ) {
  const data = {
    "accountsNum": 23,
    "adminNick": '刷刷刷',
    "adminPhone": 13912345678,
    "effectiveTime": ['2012-12-21 21:23:12', '2043-01-21 21:23:12'],
    "id": 1,
    "name": 'sdasdas',
    "remarks": '2323',
    "status": 1
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

export default {
  'GET /v1/orgManager/schools': getSchool,
  'GET /v1/orgManager/schools/accounts': getAccounts,
  'GET /v1/orgManager/schools/:id': getSchoolDetail,
  'POST /v1/orgManager/schools': postNewSchool,
};
