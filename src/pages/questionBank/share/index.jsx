import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getQuestionShareList, cancelShare, deleteSharePaper } from '@/services/questions/share'
import styles from './index.less'
import QuestionsearchHeader from '../../../components/QuestionsearchHeader'
import RadioSearch from '../../../components/RadioSearch'


const columns = [
  { dataIndex: 'paperName', title: '名称' },
  { dataIndex: 'type', title: '类型 >', render: (type) => type === '0' ? '试卷' : '练习' },
  { dataIndex: 'topicNum', title: '题数 >'},
  { dataIndex: 'difficultyLevel', title: '难度 >' },
  { dataIndex: 'treeFullNames', title: '科目/年级 >' },
  { dataIndex: 'printNum', title: '打印份数' },
  { dataIndex: 'status', title: '状态', render: (status) => status === '0' ? '共享' : '不共享' }
]
const selectOptions = [{
  defaultValue: '0',
  placeHolder: '请选择',
  queryKey: 'types',
  options: [
    {
      value: '0',
      label: '全部类型'
    },
    {
      value: '1',
      label: '试卷'
    },
    {
      value: '2',
      label: '练习'
    }
  ]
},
{
  defaultValue: '0',
  placeHolder: '请选择',
  queryKey: 'degreeOfDifficulty',
  options: [
    {
      value: '0',
      label: '全部难度'
    },
    {
      value: '1',
      label: '1'
    },
    {
      value: '2',
      label: '2'
    },
    {
      value: '3',
      label: '3'
    },
    {
      value: '4',
      label: '4'
    },
    {
      value: '5',
      label: '5'
    }
  ]
}]
const searchOptions = [{
  value: '6',
  label: '共享'
},
{
  value: '5',
  label: '非共享'
}]
const useList = (query, page) => {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...query
    }
    getQuestionShareList(params).then(response => {
      if (response.code < 300) {
        const { data = {} } = response
        setList(data.records)
        setTotal(data.total)
      }
    })
  }, [query, page])
  return [list, total]
}
const QuestionShare = () => {
  const [query, setQuery] = useState({ status: '0' })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState({
    pageNum: 1,
    pageSize: 10,
  })
  const [list, total] = useList(query, page)
  const onQuery = (current) => {
    setQuery(current)
  }
  const onSearch = (status, input) => {
    setQuery({
      ...query,
      status,
      keyword: input
    })
  }

  const pageChange = (pageNum, pageSize) => {
    setPage({
      ...page,
      pageNum,
      pageSize
    })
  }
  const onBtnClick = () => {
    if (query.status === '0') {
      Modal.confirm({
        centered: true,
        okText: '确定',
        cancelText: '取消',
        title: '系统提示',
        content: '确定取消分享？',
        onOk() {
          Promise.all(selectedRowKeys.map(id => {
            return cancelShare({
              id,
              status: 6
            })
          })).then(() => {
            pageChange(1, 10)
          })
        }
      })
    } else {
      Modal.confirm({
        centered: true,
        okText: '确定',
        cancelText: '取消',
        title: '系统提示',
        content: '确定删除作业卷？',
        onOk() {
          Promise.all(selectedRowKeys.map(id => {
            return deleteSharePaper({
              id
            })
          })).then(() => {
            pageChange(1, 10)
          })
        }
      })
    }


  }
  const pagination = {
    current: page.pageNum,
    pageSize: page.pageSize,
    total,
    showTotal: num => `共 ${num} 条数据`,
    onChange: pageChange
  }
  const rowSelection = {
    type: 'checkBox',
    selectedRowKeys,
    onChange: (keys) => { setSelectedRowKeys(keys) }
  }

  return <PageHeaderWrapper className={styles.page} >
    <QuestionsearchHeader
      selectOptions={selectOptions}
      onQuery={onQuery} />
    <span>
      <RadioSearch
        defaultValue="0"
        options={searchOptions}
        onSearch={onSearch} />
      <span>
        <Button
          disabled={!selectedRowKeys.length}
          onClick={onBtnClick}>{query.status === '0' ? '取消共享' : '删除'}</Button>
        {selectedRowKeys.length ? <span>{`已选中${selectedRowKeys.length * 1}项`}</span> : null}
      </span>
    </span>

    <Table
      rowKey={record => record.id}
      columns={columns}
      dataSource={list}
      pagination={pagination}
      rowSelection={rowSelection} />
  </PageHeaderWrapper>
}
export default QuestionShare