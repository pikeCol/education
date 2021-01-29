import { Button, Table, Modal, Select} from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getAccounts } from '@/pages/OrgManagement/service';
import { getSchool } from '@/pages/OrgManagement/service';
import styles from './style.less';
import { history } from 'umi'
import { Link } from 'react-router-dom'

const { Option } = Select;
const getAccountsList = async (data) => {
  const res = await getAccounts(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null
}
const SchoolManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountData, setAccountData] = useState();
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageNum, setPageNum] = useState(1)
  const [schoolData, setSchoolData] = useState([]);
  const [school, setSchool] = useState();

  const [loading, setLoading] = useState(false)
  const handleSearch = () => {
    setLoading(true)
    const theData = {
      pageNum,
      pageSize,
      schoolId: school
    }
    getAccountsList(theData).then(res => {
      console.log(res);
      setAccounts(res.records)
      setTotal(res.total)
      setLoading(false)
    })
  }
  const handleAdd = useCallback(
    () => {
      history.push({
        pathname: `./person/new`,
        name: 'personNew',
      })
    },
    []
  )
  const getSchoolList = async (data) => {
    const res = await getSchool(data)
    // console.log(res)
    if (res.code < 300) {
      return res.data
    }
    return null

  }
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
  }, [])

  const handleDelOk = useCallback(
    () => {
      console.log('handleDelOk')
    },
    []
  )
  const handleCancel = useCallback(
    () => {
      setAccountData(null)
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
  const handleSchoolSelect = (val) => {
      setSchool(val)
  }
  const confirm = useCallback((data) => {
    console.log(data)
    setAccountData(data)
    Modal.confirm({
      title: '提示',
      content: '是否删除角色',
      onOk: handleDelOk,
      onCancel: handleCancel
    });
  }, []);
  useEffect(() => {
    setLoading(true)
    const theData = {
      pageNum,
      pageSize,
      schoolId: ''
    }
    getAccountsList(theData).then(res => {
      console.log(res);
      setAccounts(res.records)
      setTotal(res.total)
      setLoading(false)
    })
  }, [pageNum, pageSize])
  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: handlePageChange,
    onShowSizeChange: handleSizeChange,
    total,
  }
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
      dataIndex: 'roleNames',
      key: 'roleNames',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        // console.log(record)
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Link type="link" to={{
                pathname: `/organizationManage/person/new`,
                query: {
                  id: record.id
                }
              }}>详情</Link>
            {/* <a onClick={() => confirm(record)}>删除</a> */}
          </div>
        )
      },
    },
  ];
  return (
    <>
      <PageHeaderWrapper />
      <div className={styles.bg} >
        <div style={{ textAlign: 'left', marginTop: 15, marginBottom: 15 }}>
          学校:
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
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button type="primary" style={{ marginLeft: 15 }} onClick={handleAdd}>新增</Button>
        </div>
        <Table loading={loading} scroll={{ x: 600 }} columns={columns} dataSource={accounts} rowKey="id" pagination={
          pagination
        } />
      </div>
    </>
  );
};

export default SchoolManagement;
