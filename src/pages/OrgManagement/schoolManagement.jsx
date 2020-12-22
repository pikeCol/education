import { Button, Table } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getSchool } from '@/pages/OrgManagement/service';
import { history } from 'umi'
import styles from './style.less';

console.log(history);
const toDetail = (data) => {
  // history.push(`./school/${data.id}`)
  history.push({
    pathname: `./school/schoolDetail`,
    name: 'schoolDetail',
    query: {
      id: data.id
    }
  })
}
const columns = [
  {
    title: '学校名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      let theHtml
      switch (status * 1) {
        case 0:
          theHtml = (<span>正常</span>)
          break;
        case 1:
          theHtml = (<span>未生效</span>)
          break;
        default:
          theHtml = (<></>)
          break;
      }
      return theHtml
    },

  },
  {
    title: '人员账号数',
    dataIndex: 'accountsNum',
    key: 'accountsNum',
  },
  {
    title: '生效时间',
    key: 'effectiveTime',
    dataIndex: 'effectiveTime',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => {
      return (
        <span>
          <a onClick={() => toDetail(record)}>详情</a>
        </span>
      )
    },
  },
];

const getSchoolList = async (data) => {
  const res = await getSchool(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null
}
const IndexHtml = () => {
  const [schoolData, setSchoolData] = useState([]);
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const handleAdd = useCallback(
    () => {
      history.push({
        pathname: `./school/new`,
        name: 'schoolNew'
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
    const theData = {
      pageNum,
      pageSize
    }
    setLoading(true)
    getSchoolList(theData).then(res => {
      setLoading(false)
      if (res.records) {
        setSchoolData(res.records)
        setTotal(res.total)
      }
    })
  }, [pageNum, pageSize]);
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
      <PageHeaderWrapper />
      <div className={styles.bg} >
        <div style={{ textAlign: 'right', marginTop: 15, marginBottom: 15 }}>
          <Button type="primary" onClick={handleAdd}>新增学校</Button>
        </div>
        <Table loading={loading} scroll={{ x: 600 }} columns={columns} dataSource={schoolData} rowKey="id" pagination={
          pagination
        } />
      </div>
    </>
  );
};

export default IndexHtml;
