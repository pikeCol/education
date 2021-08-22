import { DatePicker, Spin, Select, Empty, Table } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { getSchool } from '@/pages/OrgManagement/service';
import { getDataAnalysisSchoolOverall, getDataAnalysisOverall } from '../service';
import styles from '../style.less';
import { history } from 'umi';


const monthFormat = 'YYYY-MM';
const { RangePicker } = DatePicker;
const { Option } = Select;


const columns = [
  {
    title: '学校名称',
    dataIndex: 'schoolName',
  },
  {
    title: '教师人数',
    dataIndex: 'teacherNum',
  },
  {
    title: '在线人数',
    dataIndex: 'onlinePeople',
  },
  {
    title: '今日下载人数',
    dataIndex: 'downloadPeople',
  },
  {
    title: '操作',
    dataIndex: 'schoolId',
    render: (t) => <a onClick={() => history.push(`/dataAnalysis/schoolDetail?schoolId=${t}`)}>详情</a>
  },
]

const tabBoxes = (data) => {
  return (<div className={styles.tabBoxes}>
    <div className={styles.tabBox}>
      <div className={styles.header}>当前总人数</div>
      <div className={styles.content}>{data.totalPeople}人</div>
      <div className={styles.footer}>可查看学校&nbsp;&nbsp;&nbsp;{data.rangeSchoolNum}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>今日在线人数</div>
      <div className={styles.content}>{data.onlinePeople}人</div>
      <div className={styles.footer}>在线占比 {data.onlinePeopleRate}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>今日下载人数</div>
      <div className={styles.content}>{data.downloadPeople}次</div>
      <div className={styles.footer}>下载占比 {data.downloadPeopleRate}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>7日在线率</div>
      <div className={styles.content}>{data.sevenOnlinePeopleRate}</div>
    </div>
  </div>)
}
const dateType = [
  { name: '今日', value: 0 },
  { name: '本周', value: 1 },
  { name: '本月', value: 2 },
  { name: '本年', value: 3 },
]
const getSchoolList = async (data) => {
  const res = await getDataAnalysisSchoolOverall(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null

}


const TheView = (data) => {
  const [date, setDate] = useState([moment().format('YYYY-01-01 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')]);
  const [school, setSchool] = useState();
  const [dateVal, setDateVal] = useState();
  const [schoolData, setSchoolData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState();

  const [tDate, setTDate] = useState(moment(new Date, monthFormat)) //教师时间
  const [tTotal, setTTotal] = useState(0) //教师时间
  const [tParam, setTParam] = useState({pageNum: 1, pageSize: 10}) //教师时间


  const handleDatepicker = useCallback((datas, dateStrings) => {
    if (typeof datas === 'number') {
      setDateVal(null)
      switch (datas) {
        case 0:
          setDate([moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')])
          break;
        case 1:
          setDate([moment().weekday(-7).format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')])
          break;
        case 2:
          setDate([moment().format('YYYY-MM-01 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')])
          break;
        case 3:
          setDate([moment().format('YYYY-01-01 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')])
          break;
        default:
          break;
      }
    } else {
      setDateVal(datas)
      setDate([
        `${dateStrings[0]} 00:00:00`,
        `${dateStrings[1]} 23:59:59`
      ])
    }
  }, [])
  const handleSchoolSelect = useCallback(
    (val) => {
      setDateVal(null)
      setSchool(val)
    }, [])
  useEffect(() => {
    const theData = {
      ...tParam,
      beginDate: date[0],
      endDate: date[1],
    }
    getSchoolList(theData).then(res => {
      if (res.records.length > 0) {
        setSchoolData(res.records)
        setTTotal(res.total)
      }
    })
  }, [tParam, date]);

  useEffect(() => {
    getDataAnalysisOverall().then(res => {
      setLoading(false)
      setCountData(res.data)
    });
  }, []);
  return (
    <Spin spinning={loading} delay={500}>
      {countData && tabBoxes(countData)}
      {schoolData.length === 0 && <Empty style={{ margin: '20px auto' }} />}
      <div className={styles.theader}>
        <h3>教师登陆情况</h3>
        <DatePicker value={tDate} format={monthFormat} onChange={(d) => setTDate(d)} picker="month"/>
        <div className={styles.dateBoxes}>
          {dateType.map(item => (
            <span key={item.value} onClick={() => handleDatepicker(item.value)}>{item.name}</span>
          ))}
        </div>
      </div>
      <Table
          dataSource={schoolData}
          columns={columns}
          pagination={{
            showTotal: t => `共${t}条记录`,
            total: tTotal,
            onChange: (pageNum, pageSize) => setTParam({pageNum, pageSize})
          }}
        />
    </Spin>
  );
};

export default TheView;
