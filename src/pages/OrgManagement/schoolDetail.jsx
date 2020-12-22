import { Button, Table, Empty } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getSchoolDetail, getAccounts } from '@/pages/OrgManagement/service';
import { history } from 'umi'
import styles from './style.less';

const { location: { query } } = history
const columns = [
  {
    title: '昵称',
    dataIndex: 'nick',
    key: 'nick',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '科目年级',
    dataIndex: 'subjectInfo',
    key: 'subjectInfo',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
  },
]
const getDetail = async (data) => {
  const res = await getSchoolDetail(data)
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
const formatStatus = (status) => {
  let theHtml
  switch (status) {
    case 0:
      theHtml = (<span>11</span>)
      break;
    case 1:
      theHtml = (<span style={{ color: '#32CD32' }}>正常</span>)
      break;
    case 2:
      theHtml = (<span>22</span>)
      break;
    default:
      theHtml = (<></>)
      break;
  }
  return theHtml
}
const IndexHtml = () => {
  // const [school, setSchool] = useState(query.id);
  const [schoolData, setSchoolData] = useState();
  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const handleEdit = useCallback(
    () => {
      history.push({
        pathname: `./edit`,
        name: 'schoolEdit',
        query: {
          id: query.id
        }
      })
    },
    []
  )
  const handlePageChange = useCallback(
    (page) => {
      setPageNum(page)
    },
    []
  )
  const handleSizeChange = useCallback(
    (current, size) => {
      setPageNum(current)
      setPageSize(size)
    },
    []
  )
  useEffect(() => {
    getDetail({ id: query.id }).then(res => {
      console.log(res);
      setSchoolData(res)
    })
  }, [])
  useEffect(() => {
    if (!query.id) { return }
    setLoading(true)
    const theData = {
      school: query.id,
      pageNum,
      pageSize,
    }
    getAccountsList(theData).then(res => {
      console.log(res);
      setAccounts(res.records)
      setTotal(res.total)
      setLoading(false)
    })
  }, [pageNum, pageSize])
  const pagination = useMemo(() => {
    return {
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: handlePageChange,
      onShowSizeChange: handleSizeChange,
      total,
    }
  }, [handlePageChange, handleSizeChange, total])
  return (
    <>
      <PageHeaderWrapper title="学校详情" />
      {schoolData ? <div className={styles.bg} >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>{schoolData.name}</div>
          <Button type="primary" onClick={handleEdit}>编辑</Button>
        </div>
        <div>
          {formatStatus(schoolData.status)}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{schoolData.effectiveTime.join(' 至 ')}
        </div>
        <div>
          {schoolData.remarks}
        </div>
        <hr />
        <div>人员账号</div>
        <Table loading={loading} scroll={{ x: 600 }} columns={columns} dataSource={accounts} rowKey="id" pagination={
          pagination
        } />
        <div />
      </div> : <Empty style={{ margin: '20px auto' }} />}
    </>
  );
};

export default IndexHtml;
