// eslint-disable-next-line import/no-extraneous-dependencies
// import {
// parse
// } from 'url';

function getDataAnalysisCount(req, res) {
  const data = {
    "haveNoApprovals": 32,
    "publishSubjects": 4242,
    "publishSubjectsChainRatio": 0.42,
    "sevenDayApprovals": 123,
    "sevenDayNewSubjects": 42,
    "shareHomework": 423,
    "shareHomeworkChainRatio": -1.2,
    "todayApprovals": 423,
    "todayNewSubjects": 23,
    "todayNewSubjectsChainRatio": 0.42
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function getDataAnalysisBar(req, res) {
  const data = {
    xAxis: ['语文', '数学', '英语', '科学', '语文', '数学', '英语'],
    dataSource: [10, 52, 200, 334, 390, 330, 220]
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function getDataAnalysisUserCount(req, res) {
  const data = {
    "composePaper": 213,
    "printHomework": 423,
    "printSubject": 323,
    "teacherOnline": 22,
    "teacherSubject": 111
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function getDataAnalysisSchoolCount(req, res, ) {
  const data = {
    "composePaper": 234,
    "composePaperPrint": 22,
    "composePaperShare": 33,
    "printHomework": 11,
    "printHomeworkTotal": 332,
    "printSubject": 23,
    "teacherOnline": 12,
    "teacherOnlineRate": 33,
    "teacherSubject": 4124,
    "teacherSubjectCollect": 44,
    "teacherSubjectReference": 23
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

function getDataAnalysisPersonCount(req, res, ) {
  const data = {
    "composePaper": 234,
    "composePaperPrint": 22,
    "composePaperShare": 33,
    "printHomework": 11,
    "printHomeworkTotal": 332,
    "printSubject": 23,
    "teacherSubject": 4124,
    "teacherSubjectCollect": 44,
    "teacherSubjectReference": 23
  }
  const result = {
    data,
    "code": 200,
    "message": null
  };
  return res.json(result);
}

export default {
  'GET /v1/dataAnalysis/operates/count': getDataAnalysisCount,
  'GET /v1/dataAnalysis/userData/count': getDataAnalysisUserCount,
  'GET /v1/dataAnalysis/operates/histogram': getDataAnalysisBar,
  'GET /v1/dataAnalysis/school/count': getDataAnalysisSchoolCount,
  'GET /v1/dataAnalysis/person/count': getDataAnalysisPersonCount,

};
