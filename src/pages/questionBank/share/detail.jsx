import React, { useState, useEffect } from 'react'
import { getShareDetail } from '@/services/questions/detail';
import { Table, Button, Row, Col } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './detail.less'
import { QuestionTypesDetail } from '@/components/Enums';

const QuestionDeailHeader = (props) => {

  const { className, data = {} } = props
  const {
    treeFullNames,
    type,
    tags = [],
    difficultyLevel,
    status = 0,
    submitTime,
    remark,
    submitUserName,
    auditTime,
    auditUserName
  } = data
  const starRender = () => {
    const star = '⭐'
    const arr = Array(difficultyLevel).fill(star)
    return arr.join('')
  }
  const statusRender = () => {
    switch (status) {
      case 0:
        return '未提交'
      case 1:
        return '待审核'
      case 2:
        return '发布中'
      case 3:
        return '审核拒绝'
      case 4:
        return '下架'

      default:
        return '未知'
    }
  }
  const normalRender = () => {
    return <Row className={styles.row}>
      <Col span={12}>
        <span className={styles.title}>状态：</span>
        <span>{statusRender()}</span>
      </Col>
      <Col span={12}>
        <span className={styles.title}>发布时间：</span>
        <span>{submitTime}</span>
      </Col>
    </Row>
  }
  return <div className={className}>
    <Row className={styles.row}>
      <Col span={12}>
        <span className={styles.title}>科目课程：</span>
        <span>{treeFullNames}</span>
      </Col>
      <Col span={12}>
        <span className={styles.title}>题型：</span>
        <span>{QuestionTypesDetail[type]?.title || ''}</span>
      </Col>
    </Row>
    <Row className={styles.row}>
      <Col span={12}>
        <span className={styles.title}>题目标签：</span>
        <span>{tags?.map(x => { return x.value })}</span>
      </Col>
      <Col span={12}>
        <span className={styles.title}>难度：</span>
        <span>{starRender()}</span>
      </Col>
    </Row>

    {normalRender()}

  </div>
}

const typeEnum = {
  '1': '试卷',
  '2': '练习题'
}
const contentEnum = {
  '选择题': "1",
  '多选题': "2",
  '填空题': "3",
  '判断题': "4",
  '解答题': "5",
}

const useDetail = (params) => {
  const [detail, setDetail] = useState({})
  useEffect(() => {
    getShareDetail(params).then(res => {
      if (res.code < 300) {
        const content = Object.keys(res.data.content).map(x => {
          return {
            name: x,
            ...res.data.content[x]
          }
        })
        setDetail(res.data)
      }
    })
  }, [])
  return detail
}

const QuestionDeatailContent = (props) => {
  const { className, data = {}, title } = props

  const ct =  data.contents.map(v => {
    const { question, options = [], answer, analysis } = v
      return <div key={v.id}>
          <div className={styles.question}>
            <div className={styles.desc} dangerouslySetInnerHTML={{ '__html': question || '' }} />
            <div className={styles.select}>
              {options?.map(x => <span key={x} dangerouslySetInnerHTML={{ '__html': x || '' }} />)}
            </div>
          </div>
        </div>
    });
  
  return <div className={className}>
    <h3>{title}</h3>
    {ct}
  </div>
  

}


const ShareDetail = (props) => {
  const { match = {}, location = {}} = props
  const { params } = match
  const detail = useDetail(params)

  const onBtnClick = () => {}

  return <PageHeaderWrapper>
  <div className={styles.detail}>
      <QuestionDeailHeader className={styles.header} data={detail} />
      {
        detail.content && Object.keys(detail.content).map((v, index) => {
          return <QuestionDeatailContent key={index} className={styles.content} data={detail.content[v]} title={v}/>
        })
      }
      <div className={styles.tool}>
        <div>
          <Button onClick={backList}>返回列表</Button>
        </div>

        <div className={styles.btns}>
          <Button onClick={() => {
            onBtnClick()
          }}>打印</Button>
        </div>
      </div>
      {/* <QuestionDeatailContent className={styles.content} data={detail} /> */}
  </div>  
  </PageHeaderWrapper>
}

export default ShareDetail