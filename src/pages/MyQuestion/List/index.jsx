import React, { useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import QuestionList from '@/components/QuestionList'
import QuestionsearchHeader from '@/components/QuestionsearchHeader'
import {getPersonalQuestionList, getTags} from '@/services/myQuestion/create'
import styles from './index.less'
import {getWrongQuestionList} from "@/services/audit";
import { connect } from 'umi';


const MyQuestion = (props) => {
  const {currentUser} = props
  const selectOptions = [
    {
      defaultValue: null,
      placeHolder: '请选择题型',
      queryKey: 'type',
      options: [
        {
          label: '全部题型',
          value: null
        },
        {
          label: '单选题',
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
      defaultValue: null,
      placeHolder: '请选择难度',
      queryKey: 'difficultyLevels',
      options: [
        {
          label: '全部难度',
          value: null
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
      defaultValue: null,
      placeHolder: '请选择',
      queryKey: 'tagIds',
      options: new Promise((resolve) => {
        getTags().then(res => resolve([
          {
            label: '全部标签',
            value: null
          },
          ...res.data.map(x => {
            return { label: x.value, value: `${x.id}` }
          })
        ]))
      })
    }
  ]
  const [query, setQuery] = useState({})
  return <PageHeaderWrapper>
    <div className={styles.content}>
      <div className={styles.head}>
        <QuestionsearchHeader
          selectOptions={selectOptions}
          onQuery={(querys) => {
            setQuery(querys)
          }} />
        {
          !currentUser.onlyTeacherAuthority && 
          <Button type='primary' className={styles.btns}>
            <Link to="/questionBank/personalQuestion/create">新建</Link>
          </Button>
        }
      </div>
        <QuestionList
            modifyRequest={getPersonalQuestionList}
            className={styles.questionTable}
            query={{
              ...query
            }}
            isAudit={false}
            // 审核通过发布的权限
            isExamine={false}
            // edit
            // sub
            // rev
            // del
            // verb
            notAllowBtns={['verb', 'rev']}
            detailUrl="/questionBank/personalQuestion/detail/"
        />

    </div>

  </PageHeaderWrapper>
}
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(MyQuestion);
// export default MyQuestion
// export default MyQuestion