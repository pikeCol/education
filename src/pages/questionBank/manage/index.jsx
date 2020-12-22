import React, { useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Pagination } from 'antd'
import QuestionList from '@/components/QuestionList'
import { getTags } from '@/services/myQuestion/create';
import QuestionsearchHeader from '../../../components/QuestionsearchHeader'
import RadioSearch from '../../../components/RadioSearch'
import styles from './index.less'


const selectOptions = [
  {
    defaultValue: '0',
    placeHolder: '请选择题型',
    queryKey: 'type',
    options: [
      {
        label: '全部题型',
        value: '0'
      },
      {
        label: '选择题',
        value: '1'
      },
      {
        label: '多选题',
        value: '2'
      },
      {
        label: '填空题',
        value: '3'
      },
      {
        label: '判断题',
        value: '4'
      },
      {
        label: '解答题',
        value: '5'
      }
    ]
  },
  {
    defaultValue: '0',
    placeHolder: '请选择难度',
    queryKey: 'difficultLevels',
    options: [
      {
        label: '全部难度',
        value: '0'
      },
      {
        label: '一星',
        value: '1'
      },
      {
        label: '二星',
        value: '2'
      },
      {
        label: '三星',
        value: '3'
      },
      {
        label: '四星',
        value: '4'
      },
      {
        label: '五星',
        value: '5'
      }
    ]
  },
  {
    defaultValue: '0',
    placeHolder: '请选择难度',
    queryKey: 'tagIds',
    options: new Promise((resolve) => {
      getTags().then(res => resolve([
        {
          label: '全部标签',
          value: '0'
        },
        ...res.data?.map(x => {
          return { label: x.value, value: `${x.id}` }
        })
      ]))
    })
  }]
const searchOptions = [{
  value: '2',
  label: '已发布'
},
{
  value: '4',
  label: '下架'
}
  // {
  //   value: '1',
  //   label: '发布审核中'
  // }
]
const Bank = () => {
  const [query, setQuery] = useState({ status: '2' })
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
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
  const onBtnClick = () => {
    // Modal.confirm({
    //   centered: true,
    //   okText: '确定',
    //   cancelText: '取消',
    //   title: '系统提示',
    //   content: '确定取消分享？',
    //   onOk() {

    //   }
    // })
  }
  return <PageHeaderWrapper className={styles.page}>
    <QuestionsearchHeader
      selectOptions={selectOptions}
      onQuery={onQuery} />
    <span>
      <RadioSearch
        defaultValue="2"
        options={searchOptions}
        onSearch={onSearch} />
      {/* <span>
        <Button
          disabled={!selectedRowKeys.length}
          onClick={onBtnClick}>下架</Button>
        {selectedRowKeys.length ? <span>{`已选中${selectedRowKeys.length * 1}项`}</span> : null}
      </span> */}
    </span>
    <QuestionList className={styles.questionTable}
      query={{
        ...query,
        queryType: 2
      }}
      detailUrl="/questionBank/manage/detail/" />
  </PageHeaderWrapper>
}
export default Bank