import { DatePicker, Spin, Select, Empty } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { getSchool, getAccounts } from '@/pages/OrgManagement/service';
import { getDataAnalysisPersonCount } from '../service';
import styles from '../style.less';

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
const getAccountsList = async (data) => {
  const res = await getAccounts(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null
}
const getCount = async (data) => {
  const res = await getDataAnalysisPersonCount(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null

}
const TheView = () => {
  const [date, setDate] = useState([moment().format('YYYY-01-01 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')]);
  const [school, setSchool] = useState();
  const [account, setAccount] = useState();
  const [dateVal, setDateVal] = useState();
  const [schoolData, setSchoolData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState();
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
  const handleAccountSelect = useCallback(
    (val) => {
      setDateVal(null)
      setAccount(val)
    }, [])
  useEffect(() => {
    const theData = {
      pageNum: 1,
      pageSize: 999
    }
    getSchoolList(theData).then(res => {
      if (res.records && res.records.length > 0) {
        setSchoolData(res.records)
        setSchool(res.records[0].id)
      }
    })
  }, []);
  useEffect(() => {
    if (!school) { return }
    const theData = {
      school,
    }
    getAccountsList(theData).then(res => {
      setAccountsData(res.records)
      const theId = res.records[0] ? res.records[0].id : null
      setAccount(theId)
    });
  }, [school]);
  useEffect(() => {
    if (!account) { return }
    setLoading(true)
    const theData = {
      startDate: date[0],
      endDate: date[1],
      school,
      account
    }
    Promise.all([getCount(theData)]).then(res => {
      setLoading(false)
      setCountData(res[0])
    });
  }, [date, account]);
  return (
    <Spin spinning={loading} delay={500}>
      {updateTime('2020.4.12 14:00:23')}
      <div className={styles.dateBoxes} style={{ marginBottom: 15 }}>
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
        <Select
          showSearch
          style={{ width: 200, margin: 'auto 15px' }}
          placeholder="请选择人员"
          optionFilterProp="children"
          onSelect={handleAccountSelect}
          value={account}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {accountsData.map(item => (
            <Option value={item.id} key={item.id}>{item.nick}</Option>
          ))}
        </Select>
      </div>
      <div className={styles.dateBoxes}>
        <RangePicker value={dateVal} onChange={handleDatepicker} style={{ marginRight: 15 }} />
        {dateType.map(item => (
          <span key={item.value} onClick={() => handleDatepicker(item.value)}>{item.name}</span>
        ))}
      </div>
      {countData && tabBoxes(countData)}
      {accountsData.length === 0 && <Empty style={{ margin: '20px auto' }} />}
    </Spin>
  );
};

export default TheView;
