import { Button, Table, Modal } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getAccounts } from '@/pages/OrgManagement/service';
import styles from './style.less';

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
  const [loading, setLoading] = useState(false)
  const handleImport = useCallback(
    () => {
      console.log('handleAdd');
    },
    []
  )
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
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        // console.log(record)
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <a>角色变更</a>
            <a onClick={() => confirm(record)}>删除</a>
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
          <Button type="primary" onClick={handleImport}>导入</Button>
        </div>
        <Table loading={loading} scroll={{ x: 600 }} columns={columns} dataSource={accounts} rowKey="id" pagination={
          pagination
        } />
      </div>
    </>
  );
};

export default SchoolManagement;
