import React, { useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import QuestionList from '@/components/QuestionList'
import QuestionsearchHeader from '@/components/QuestionsearchHeader'
import { getTags, getMyQuestionList } from '@/services/myQuestion/create'
import { getWrongQuestionList } from '@/services/audit'
import RadioSearch from '@/components/RadioSearch'
import styles from './index.less'


const WrongQuestion = (props) => {
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
        getTags().then(res => {
          if (res.code < 300) {
            resolve([
              {
                label: '全部标签',
                value: '0'
              },
              ...res.data.map(x => {
                return { label: x.value, value: `${x.id}` }
              })
            ])
          }
        })
      })
    }
  ]
  const searchOptions = [{
    value: '1',
    label: '待审核'
  },
  {
    value: '10',
    label: '不是错题'
  },
  {
    value: '11',
    label: '是错题'
  }]
  const [query, setQuery] = useState({ status: 1 })
  const onSearch = (status, input) => {
    setQuery({
      ...query,
      status: [status]
    })
  }
  return <PageHeaderWrapper>
    <div className={styles.content}>
      <div className={styles.head}>
        <QuestionsearchHeader
          selectOptions={selectOptions}
          onQuery={(querys) => {
            setQuery(querys)
          }} />
        <RadioSearch
          defaultValue="1"
          options={searchOptions}
          onSearch={onSearch} />
      </div>
      <QuestionList
        modifyRequest={getWrongQuestionList}
        className={styles.questionTable}
        isAudit
        isWrong
        query={{
          ...query
        }}
        detailUrl="/auditManage/wrongAudit/detail/"
      />

    </div>

  </PageHeaderWrapper>
}
export default WrongQuestion