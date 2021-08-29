import { DatePicker, Spin, Select, Empty, Table } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { getSchool } from '@/pages/OrgManagement/service';
import {
  getDataAnalysisSchoolCount,
  getDataAnalysisBar,
  getDataAnalysisLoginDetail,
  getDataAnalysisDownDetail,
} from '../service';
import styles from '../style.less';
import Bar from '../../../components/Charts/Bar';
import { withRouter } from 'umi';
import { getDaysInMonth } from '@/utils/utils';

const monthFormat = 'YYYY-MM';
const { RangePicker } = DatePicker;
const { Option } = Select;
const updateTime = (data) => {
  return <div className={styles.updateTime}>数据更新于 {data}</div>;
};
const tabBoxes = (data) => {
  return (
    <div className={styles.tabBoxes}>
      <div className={styles.tabBox}>
        <div className={styles.header}>打印作业卷</div>
        <div className={styles.content}>{data.printHomework}套</div>
        <div className={styles.footer}>累计打印&nbsp;&nbsp;&nbsp;{data.printHomeworkTotal}</div>
      </div>
      <div className={styles.tabBox}>
        <div className={styles.header}>组卷</div>
        <div className={styles.content}>{data.composePaper}套</div>
        <div className={styles.footer}>共享 {data.composePaperShare}</div>
      </div>
      <div className={styles.tabBox}>
        <div className={styles.header}>出题</div>
        <div className={styles.content}>{data.teacherSubject}道</div>
        <div className={styles.footer}>
          收藏 {data.teacherSubjectCollect}&nbsp;&nbsp;&nbsp;引用 {data.teacherSubjectReference}
        </div>
      </div>
      <div className={styles.tabBox}>
        <div className={styles.header}>教师上线</div>
        <div className={styles.content}>{data.teacherOnline}人</div>
        <div className={styles.footer}>上线率&nbsp;&nbsp;&nbsp;{data.teacherOnlineRate * 100}%</div>
      </div>
    </div>
  );
};
const dateType = [
  { name: '今日', value: 0 },
  { name: '本周', value: 1 },
  { name: '本月', value: 2 },
  { name: '本年', value: 3 },
];
const getSchoolList = async (data) => {
  const res = await getSchool(data);
  // console.log(res)
  if (res.code < 300) {
    return res.data;
  }
  return null;
};
const getCount = async (data) => {
  const res = await getDataAnalysisSchoolCount(data);
  // console.log(res)
  if (res.code < 300) {
    return res.data;
  }
  return null;
};
const getBar = async (data) => {
  const res = await getDataAnalysisBar(data);
  // console.log(res)
  if (res.code < 300) {
    return res.data;
  }
  return null;
};

const TheView = (props) => {
  const { schoolId } = props.location.query;

  const [date, setDate] = useState([
    moment().format('YYYY-01-01 00:00:00'),
    moment().format('YYYY-MM-DD HH:mm:ss'),
  ]);
  const [school, setSchool] = useState(schoolId);
  const [dateVal, setDateVal] = useState();
  const [schoolData, setSchoolData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState();
  const [barData, setBarData] = useState();

  // 登陆
  const [tDate, setTDate] = useState(moment(new Date(), monthFormat)); //教师时间
  const [tTotal, setTTotal] = useState(0); //教师时间
  const [tParam, setTParam] = useState({ pageNum: 1, pageSize: 10 }); //教师时间
  const [tCol, settCol] = useState([]);
  const [tdScource, settdScource] = useState([]);

  // 下载

  const [downloadDate, setdownloadDate] = useState(moment(new Date(), monthFormat)); //教师时间
  const [downloadTotal, setdownloadTotal] = useState(0); //教师时间
  const [dParam, setdParam] = useState({ pageNum: 1, pageSize: 10 }); //教师时间
  const [dCol, setdCol] = useState([]);
  const [downloadScource, setdownloadScource] = useState([]);

  useEffect(() => {
    const md = moment(downloadDate).format(monthFormat);
    const days = getDaysInMonth(md);
    const td = [{ dataIndex: 'name', title: '教师名字', width: 100 }];
    for (let index = 0; index < days; index++) {
      td.push({
        dataIndex: index + 1,
        title: index + 1,
      });
    }

    getDataAnalysisDownDetail({
      month: md,
      schoolId,
      ...dParam,
    }).then((res) => {
      setTTotal(res.data.total);
      setdownloadScource(res.data.records);
    });

    setdCol(td);
  }, [downloadDate, schoolId, dParam]);

  useEffect(() => {
    const md = moment(tDate).format(monthFormat);
    const days = getDaysInMonth(md);
    const td = [{ dataIndex: 'name', title: '教师名字', width: 100 }];
    for (let index = 0; index < days; index++) {
      td.push({
        dataIndex: index + 1,
        title: index + 1,
      });
    }

    getDataAnalysisLoginDetail({
      month: md,
      schoolId,
      ...tParam,
    }).then((res) => {
      setTTotal(res.data.total);
      settdScource(res.data.records);
    });

    settCol(td);
  }, [tDate, schoolId, tParam]);

  const handleDatepicker = useCallback((datas, dateStrings) => {
    if (typeof datas === 'number') {
      setDateVal(null);
      switch (datas) {
        case 0:
          setDate([moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')]);
          break;
        case 1:
          setDate([
            moment().weekday(-7).format('YYYY-MM-DD 00:00:00'),
            moment().format('YYYY-MM-DD HH:mm:ss'),
          ]);
          break;
        case 2:
          setDate([moment().format('YYYY-MM-01 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')]);
          break;
        case 3:
          setDate([moment().format('YYYY-01-01 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')]);
          break;
        default:
          break;
      }
    } else {
      setDateVal(datas);
      setDate([`${dateStrings[0]} 00:00:00`, `${dateStrings[1]} 23:59:59`]);
    }
  }, []);
  const handleSchoolSelect = useCallback((val) => {
    setDateVal(null);
    setSchool(val);
  }, []);
  useEffect(() => {
    const theData = {
      pageNum: 1,
      pageSize: 999,
    };
    getSchoolList(theData).then((res) => {
      if (res.records.length > 0) {
        setSchoolData(res.records);
        setSchool(res.records[0].id);
      }
    });
  }, []);
  useEffect(() => {
    if (!school) {
      return;
    }
    setLoading(true);
    const theData = {
      beginDate: date[0],
      endDate: date[1],
      school,
    };
    Promise.all([getCount(theData)]).then((res) => {
      setLoading(false);
      setCountData(res[0]);
      setBarData({
        data: res[0]?.result,
        title: '打印作业卷科目',
      });
    });
  }, [date, school]);
  return (
    <Spin spinning={loading} delay={500}>
      {updateTime(countData?.updateTime)}
      <div className={styles.dateBoxes}>
        {/*        <div className={styles.schoolBoxes}>
          账号数据:
          <Select
            showSearch
            style={{ width: 200, margin: 'auto 15px' }}
            placeholder="请选择学校"
            optionFilterProp="children"
            onSelect={handleSchoolSelect}
            value={school}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {schoolData.map(item => (
              <Option value={item.id} key={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>*/}
        <RangePicker value={dateVal} onChange={handleDatepicker} style={{ marginRight: 15 }} />
        {dateType.map((item) => (
          <span key={item.value} onClick={() => handleDatepicker(item.value)}>
            {item.name}
          </span>
        ))}
      </div>
      {countData && tabBoxes(countData)}
      {barData && (
        <Bar id={props.id} style={{ minWidth: 600, overflowX: 'auto' }} chartData={barData} />
      )}
      {schoolData.length === 0 && <Empty style={{ margin: '20px auto' }} />}
      <div className={styles.theader}>
        <h3>教师登陆情况</h3>
        <DatePicker
          value={tDate}
          format={monthFormat}
          onChange={(d) => setTDate(d)}
          picker="month"
        />
      </div>
      <Table
        dataSource={tdScource}
        columns={tCol}
        scroll={{
          x: 1500,
        }}
        pagination={{
          showTotal: (t) => `共${t}条记录`,
          total: tTotal,
          onChange: (pageNum, pageSize) => setTParam({ pageNum, pageSize }),
        }}
      />

      <div className={styles.theader}>
        <h3>教师下载情况</h3>
        <DatePicker
          value={downloadDate}
          format={monthFormat}
          onChange={(d) => setdownloadDate(d)}
          picker="month"
        />
      </div>
      <Table
        dataSource={downloadScource}
        columns={dCol}
        scroll={{
          x: 1500,
        }}
        pagination={{
          showTotal: (t) => `共${t}条记录`,
          total: downloadTotal,
          onChange: (pageNum, pageSize) => setdParam({ pageNum, pageSize }),
        }}
      />
    </Spin>
  );
};

export default withRouter(TheView);
