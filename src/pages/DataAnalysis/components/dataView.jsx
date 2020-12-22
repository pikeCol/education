import { Spin, Empty } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from '../style.less';
import Bar from '../../../components/Charts/Bar'
import { getDataAnalysisCount, getDataAnalysisBar } from '../service';

const updateTime = (data) => {
  return (<div className={styles.updateTime}>
    数据更新于 {data}
  </div>)
}
const formatCount = (data) => {
  const negative = data * 1 < 0
  return (<span style={{ color: negative ? '#32CD32' : '#FF4500' }}>{negative ? '' : '+'}{data * 100}%</span>)
}
const tabBoxes = (data) => {
  return (<div className={styles.tabBoxes}>
    <div className={styles.tabBox}>
      <div className={styles.header}>题库已发布题数</div>
      <div className={styles.content}>{data.publishSubjects}</div>
      <div className={styles.footer}>环比上周&nbsp;&nbsp;&nbsp;{formatCount(data.publishSubjectsChainRatio)}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>共享作业卷数量</div>
      <div className={styles.content}>{data.shareHomework}</div>
      <div className={styles.footer}>环比上周&nbsp;&nbsp;&nbsp;{formatCount(data.shareHomeworkChainRatio)}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>今日新题</div>
      <div className={styles.content}>{data.todayNewSubjects}</div>
      <div className={styles.footer}>近7日新题 {data.sevenDayNewSubjects}&nbsp;&nbsp;&nbsp;环比上周  {formatCount(data.todayNewSubjectsChainRatio)}</div>
    </div>
    <div className={styles.tabBox}>
      <div className={styles.header}>今日审核</div>
      <div className={styles.content}>{data.todayApprovals}</div>
      <div className={styles.footer}>近7日审核 {data.sevenDayApprovals}&nbsp;&nbsp;&nbsp;剩余未审核 {data.haveNoApprovals}</div>
    </div>
  </div>)
}
const getCount = async () => {
  const res = await getDataAnalysisCount()
  if (res.code < 300) {
    return res.data
  }
  return null

}
const getBar = async () => {
  const res = await getDataAnalysisBar()
  if (res.code < 300) {
    return res.data
  }
  return null

}
const TheView = (data) => {
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState();
  const [barData, setBarData] = useState();
  useEffect(() => {
    Promise.all([getCount(), getBar()]).then(res => {
      setLoading(false)
      setCountData(res[0])
      setBarData({
        ...res[1],
        title: '已发布题目统计 / 共享作业卷统计'
      })
    });
  }, []);
  return (
    <Spin spinning={loading} delay={500}>
      {updateTime('2020.4.12 14:00:23')}
      {countData && tabBoxes(countData)}
      {barData && <Bar id={data.id} style={{ minWidth: 600, overflowX: 'auto' }} chartData={barData} />}
      {!barData && <Empty style={{ margin: '20px auto' }} />}
    </Spin>
  );
};

export default TheView;
