import { DatePicker, Spin, Select, Empty } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { getSchool } from '@/pages/OrgManagement/service';
import { getDataAnalysisSchoolCount, getDataAnalysisBar } from '../service';
import styles from '../style.less';
import Bar from '../../../components/Charts/Bar';

const { RangePicker } = DatePicker;
const { Option } = Select;
const updateTime = (data) => {
  return (<div className={styles.updateTime}>
    数据更新于 {data}
  </div>)
}
const tabBoxes = (data) => {
  return (<div className={styles.tabBoxes}>
    <div className={styles.tabBox}>
      <div className={styles.header}>打印作业卷</div>
      <div className={styles.content}>{data.printHomework}套</div>
      <div className={styles.footer}>累计打印&nbsp;&nbsp;&nbsp;{data.printHomeworkTotal}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>组卷</div>
      <div className={styles.content}>{data.composePaper}套</div>
      <div className={styles.footer}>共享 {data.composePaperShare}&nbsp;&nbsp;&nbsp;被打印 {data.composePaperPrint}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>出题</div>
      <div className={styles.content}>{data.teacherSubject}道</div>
      <div className={styles.footer}>收藏 {data.teacherSubjectCollect}&nbsp;&nbsp;&nbsp;引用 {data.teacherSubjectReference}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>教师上线</div>
      <div className={styles.content}>{data.teacherOnline}人</div>
      <div className={styles.footer}>上线率&nbsp;&nbsp;&nbsp;{data.teacherOnlineRate * 100}%</div>
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
  const res = await getSchool(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null

}
const getCount = async (data) => {
  const res = await getDataAnalysisSchoolCount(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null

}
const getBar = async (data) => {
  const res = await getDataAnalysisBar(data)
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
  const [barData, setBarData] = useState();
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
      pageNum: 1,
      pageSize: 999
    }
    getSchoolList(theData).then(res => {
      if (res.records.length > 0) {
        setSchoolData(res.records)
        setSchool(res.records[0].id)
      }
    })
  }, []);
  useEffect(() => {
    if (!school) { return }
    setLoading(true)
    const theData = {
      startDate: date[0],
      endDate: date[1],
      school,
    }
    Promise.all([getCount(theData), getBar(theData)]).then(res => {
      setLoading(false)
      setCountData(res[0])
      setBarData({
        ...res[1],
        title: '打印作业卷科目'
      })
    });
  }, [date, school]);
  return (
    <Spin spinning={loading} delay={500}>
      {updateTime('2020.4.12 14:00:23')}
      <div className={styles.dateBoxes}>
        <div className={styles.schoolBoxes}>
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
        </div>
        <RangePicker value={dateVal} onChange={handleDatepicker} style={{ marginRight: 15 }} />
        {dateType.map(item => (
          <span key={item.value} onClick={() => handleDatepicker(item.value)}>{item.name}</span>
        ))}
      </div>
      {countData && tabBoxes(countData)}
      {barData && <Bar id={data.id} style={{ minWidth: 600, overflowX: 'auto' }} chartData={barData} />}
      {schoolData.length === 0 && <Empty style={{ margin: '20px auto' }} />}
    </Spin>
  );
};

export default TheView;
