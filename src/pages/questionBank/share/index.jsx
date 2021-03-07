import React, { useState, useEffect } from 'react'
import { Table, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getQuestionShareList, cancelShare, deleteSharePaper, getPaperOwnList } from '@/services/questions/share'
import styles from './index.less'
import QuestionsearchHeader from '../../../components/QuestionsearchHeader'
import RadioSearch from '../../../components/RadioSearch'
import { connect } from 'umi';


const columns = [
  { dataIndex: 'paperName', title: '名称' },
  // { dataIndex: 'type', title: '类型 >', render: (type) => type === 1 ? '试卷' : '练习' },
  { dataIndex: 'topicNum', title: '题数 >'},
  { dataIndex: 'difficultyLevel', title: '难度 >' },
  { dataIndex: 'treeFullNames', title: '科目/年级 >' },
  { dataIndex: 'printNum', title: '打印份数' },
  { dataIndex: 'status', title: '状态', render: (status) => status === 6 ? '共享' : '不共享' },
  { dataIndex: 'id', title: '操作', render: (id) => <Link to={`/questionBank/share/detail/${id}`}>查看</Link> }
]
const selectOptions = [
//   {
//   defaultValue: null,
//   placeHolder: '请选择',
//   queryKey: 'type',
//   options: [
//     {
//       value: null,
//       label: '全部类型'
//     },
//     {
//       value: '1',
//       label: '试卷'
//     },
//     {
//       value: '2',
//       label: '练习'
//     }
//   ]
// },
  {
    defaultValue: null,
    placeHolder: '请选择',
    queryKey: 'difficultyLevels',
    options: [
      {
        value: null,
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
// const useList = (query, page) => {
//   const [list, setList] = useState([])
//   const [total, setTotal] = useState(0)
//   useEffect(() => {
//     const params = {
//       pageNum: page.pageNum,
//       pageSize: page.pageSize,
//       ...query
//     }
//     getQuestionShareList(params).then(response => {
//       if (response.code < 300) {
//         const { data = {} } = response
//         setList(data.records)
//         setTotal(data.total)
//       }
//     })
//   }, [query, page])
//   return [list, total]
// }
const QuestionShare = (props) => {
  const {currentUser} = props
  let searchOptions = [{
    value: '6',
    label: '共享'
  },
    {
      value: '5',
      label: '非共享'
    }]
  if (currentUser.onlyTeacherAuthority) {
    searchOptions = [{
      value: '6',
      label: '共享'
    },
      {
        value: '5',
        label: '非共享'
      },{
        value: '99',
        label: '个人卷库'
      }]
  }

  const [query, setQuery] = useState({ status: '6' })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [page, setPage] = useState({
    pageNum: 1,
    pageSize: 10,
  })
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  useEffect(() => {
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...query
    }
    if (query.status === '99') {
      delete params.status
      getPaperOwnList(params).then(response => {
        if (response.code < 300) {
          const { data = {} } = response
          setList(data.records)
          setTotal(data.total)
        }
      })
    } else {
      getQuestionShareList(params).then(response => {
        if (response.code < 300) {
          const { data = {} } = response
          setList(data.records)
          setTotal(data.total)
        }
      })
    }
  }, [query, page])
  // const useList = (query, page) => {
  //   useEffect(() => {
  //     const params = {
  //       pageNum: page.pageNum,
  //       pageSize: page.pageSize,
  //       ...query
  //     }
  //     getQuestionShareList(params).then(response => {
  //       if (response.code < 300) {
  //         const { data = {} } = response
  //         setList(data.records)
  //         setTotal(data.total)
  //       }
  //     })
  //   }, [query, page])
  //   return [list, total]
  // }
  // const [list, total] = useList(query, page)
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
  const personBtnClick = () => {
    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...query
    }
    if (query.status === '99') {
      
    }
    getPaperOwnList(params).then(response => {
      if (response.code < 300) {
        const { data = {} } = response
        setList(data.records)
        setTotal(data.total)
      }
    })
  }
  const onBtnClick = (s) => {
    if (query.status === '6') {
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
              status: 5
            })
          })).then(() => {
            pageChange(1, 10)
          })
        }
      })
    } else if (s) {
      Modal.confirm({
        centered: true,
        okText: '确定',
        cancelText: '取消',
        title: '系统提示',
        content: '确定分享？',
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
      {
        !currentUser.onlyTeacherAuthority && 
        <span>
          <Button
            disabled={!selectedRowKeys.length}
            onClick={onBtnClick}>{query.status === '6' ? '取消共享' : '删除'}</Button>
            {
              query.status === '5' ? <Button
              disabled={!selectedRowKeys.length}
              onClick={() => onBtnClick(5)}>共享</Button>
              : ''
            }
          {selectedRowKeys.length ? <span>{`已选中${selectedRowKeys.length * 1}项`}</span> : null}
          {/* <Button onClick={personBtnClick}>个人卷库</Button> */}
        </span>
      }
    </span>

    <Table
      rowKey={record => record.id}
      columns={columns}
      dataSource={list}
      pagination={pagination}
      rowSelection={rowSelection} />
  </PageHeaderWrapper>
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(QuestionShare);

// export default QuestionShare