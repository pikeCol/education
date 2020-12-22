import { DatePicker, Spin, Empty } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import Bar from '../../../components/Charts/Bar';
import { getDataAnalysisUserCount, getDataAnalysisBar } from '../service';
import styles from '../style.less';

const { RangePicker } = DatePicker;
const updateTime = (data) => {
  return (<div className={styles.updateTime}>
    数据更新于 {data}
  </div>)
}
const basicBoxes = (data) => {
  return (<div className={styles.basicBoxes}>
    <div className={styles.tabBox}>
      <div className={styles.header}>打印作业卷</div>
      <div className={styles.content}>{data.printHomework}份</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>组卷数量</div>
      <div className={styles.content}>{data.composePaper}套</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>教师出题</div>
      <div className={styles.content}>{data.teacherSubject}道</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>教师上线人数</div>
      <div className={styles.content}>{data.teacherOnline}人</div>
    </div>
  </div>)
}
const dateType = [
  { name: '今日', value: 0 },
  { name: '本周', value: 1 },
  { name: '本月', value: 2 },
  { name: '本年', value: 3 },
]
const getCount = async (data) => {
  const res = await getDataAnalysisUserCount(data)
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
  const [loading, setLoading] = useState(false);
  const [dateVal, setDateVal] = useState();
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
  useEffect(() => {
    setLoading(true)
    const theData = {
      startDate: date[0],
      endDate: date[1],
    }
    Promise.all([getCount(theData), getBar(theData)]).then(res => {
      setLoading(false)
      setCountData(res[0])
      setBarData({
        ...res[1],
        title: '打印作业卷科目'
      })
    });
  }, [date]);
  return (
    <Spin spinning={loading} delay={500}>
      {updateTime('2020.4.12 14:00:23')}
      <div className={styles.dateBoxes}>
        <RangePicker value={dateVal} onChange={handleDatepicker} style={{ marginRight: 15 }} />
        {dateType.map(item => (
          <span key={item.value} onClick={() => handleDatepicker(item.value)}>{item.name}</span>
        ))}
      </div>
      {countData && basicBoxes(countData)}
      {barData && <Bar id={data.id} style={{ minWidth: 600, overflowX: 'auto' }} chartData={barData} />}
      {!barData && <Empty style={{ margin: '20px auto' }} />}
    </Spin>
  );
};

export default TheView;
