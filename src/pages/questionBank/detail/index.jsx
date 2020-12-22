/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react'
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { StarOutlined, BookOutlined, BugFilled, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Row, Button, Divider, Dropdown, Menu, Modal, Input } from 'antd'
import { getQuestionDetail } from '@/services/questions/detail';
import { changeQuestionStatus } from '@/services/audit';
import { deleteQuestion } from '@/services/myQuestion/create';
import { QuestionTypesDetail } from '@/components/Enums';
import { Link } from 'react-router-dom'
import styles from './index.less'

const { TextArea } = Input
const QuestionDeailHeader = (props) => {

  const { className, data = {}, isAudit } = props
  const {
    subjectTreeFullNames,
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
  const auditRender = () => {
    return <>
      <Row className={styles.row}>
        <Col span={12}>
          <span className={styles.title}>说明/原因：</span>
          <span>{remark}</span>
        </Col>
        <Col span={12}>
          <span className={styles.title}>状态：</span>
          <span>{statusRender()}</span>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col span={12}>
          <span className={styles.title}>提交人：</span>
          <span>{submitUserName}</span>
        </Col>
        <Col span={12}>
          <span className={styles.title}>提交时间：</span>
          <span>{submitTime}</span>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col span={12}>
          <span className={styles.title}>审核人：</span>
          <span>{auditUserName || '-'}</span>
        </Col>
        <Col span={12}>
          <span className={styles.title}>提交时间：</span>
          <span>{auditTime}</span>
        </Col>
      </Row>
    </>
  }
  return <div className={className}>
    <Row className={styles.row}>
      <Col span={12}>
        <span className={styles.title}>科目课程：</span>
        <span>{subjectTreeFullNames}</span>
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

    {isAudit ? auditRender() : normalRender()}

  </div>
}

const QuestionDeatailContent = (props) => {
  const { className, data = {} } = props
  const { question, options = [], answer, analysis } = data
  return <div className={className}>
    {/* <div className={styles.line}>
      <div>tags</div>
      <div>
        <span><StarOutlined />{11 || 0}</span>
        <span><BookOutlined />{11 || 0}</span>
      </div>
    </div> */}
    <div>
      <div className={styles.question}>
        <div className={styles.desc} dangerouslySetInnerHTML={{ '__html': question || '' }} />
        <div className={styles.select}>
          {options?.map(x => <span key={x} dangerouslySetInnerHTML={{ '__html': x || '' }} />)}
        </div>
      </div>
      <div className={styles.answer}>
        <div className={styles.title}>解答：</div>
        <div className={styles.desc}>{answer}</div>
        <div className={styles.desc} dangerouslySetInnerHTML={{ '__html': analysis || '' }} />
      </div>
    </div>
  </div>
}
const RejectModal = (props) => {
  const { visible, id, onCancel } = props
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const cancel = <Button key="cancel" onClick={onCancel}>取消</Button>
  const done = <Button key="done" type='primary' loading={loading} onClick={() => {
    changeQuestionStatus({
      status: 3,
      id,
      remark: input
    }).then(res => {
      setLoading(false)
      onCancel()
      if(res.code < 300) {
        history.goBack()
      }
    })
  }}>确定</Button>
  return <Modal
    title="未通过理由"
    visible={visible}
    footer={[cancel, done]}>
    <TextArea
      autoSize={{ minRows: 3, maxRows: 5 }}
      placeholder="请输入未通过理由"
      value={input}
      onChange={({ target: { value } }) => {
        setInput(value)
      }} />
  </Modal>
}
const useDetail = (params) => {
  const [detail, setDetail] = useState({})
  useEffect(() => {
    getQuestionDetail(params).then(res => {
      if (res.code < 300) {
        setDetail(res.data)
      }
    })
  }, [])
  return detail
}
const QuestionDetail = (props) => {
  const { match = {}, location = {} } = props
  const { params } = match
  const {state = {}} = location
  const { isAudit, isWrong } = state
  const detail = useDetail(params)
  const [showModal, setShowModal] = useState(false)
  const backList = () => {
    history.goBack()

  }
  const onBtnClick = (t) => {
    let title = ''
    let onOk
    if (t === 'del') {
      title = '删除后将不能找回，确认删除？'
      onOk = () => {
        return new Promise((resolve) => {
          deleteQuestion({
            id: detail.id
          }).then(res => {
            if(res.code < 300) {
              history.goBack()
            }
            return Promise.resolve()
          }).then(resolve)
        })
      }
    }
    if (t === 'sub') {
      title = '提交新题审核？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 1,
            id: detail.id
          }).then(res => {
            if(res.code < 300) {
              history.goBack()
            }
            return Promise.resolve()
          }).then(resolve)
        })
      }
    }
    if (t === 'rev') {
      title = '撤回新题审核？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 1,
            id: detail.id
          }).then(res => {
            if(res.code < 300) {
              history.goBack()
            }
            return Promise.resolve()
          }).then(resolve)
        })
      }
    }
    if (t === 'iserr') {
      title = '判定是错题，并在题库中下架？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 10,
            id: detail.id,
            remark: '错题'
          }).then(res => {
            if(res.code < 300) {
              history.goBack()
            }
            return Promise.resolve()
          }).then(resolve)
        })
      }
    }
    if (t === 'noerr') {
      title = '不是错题？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 11,
            id: detail.id
          }).then(res => {
            if(res.code < 300) {
              history.goBack()
            }
            return Promise.resolve()
          }).then(resolve)
        })
      }
    }
    if (t === 'audit') {
      title = '审核通过并将此题发布至题库？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 2,
            id: detail.id
          }).then(res => {
            if(res.code < 300) {
              history.goBack()
            }
            return Promise.resolve()
          }).then(resolve)
        })
      }
    }
    if (t === 'reject') {
      setShowModal(true)
      return 
    }
    Modal.confirm({
      title: '注意',
      icon: <ExclamationCircleOutlined />,
      content: title,
      okText: '确认',
      cancelText: '取消',
      onOk
    })
  }
  const btnsRender = () => {
    const edit = <Button key="edit" >
      <Link to={`/questionBank/personalQuestion/edit/${detail.id}`}>编辑</Link>
    </Button>
    const sub = <Button key="sub" onClick={() => {
      onBtnClick('sub')
    }}>提交审核</Button>
    const rev = <Button key="rev" onClick={() => {
      onBtnClick('rev')
    }}>撤回审核</Button>
    const del = <Button key="del" style={{ color: 'red' }} onClick={() => {
      onBtnClick('del')
    }}>删除</Button>
    const isErr = <Button
      key="iserr"
      type='primary'
      onClick={() => {
        onBtnClick('iserr')
      }}>错题并下架</Button>
    const noErr = <Button key="noerr" onClick={() => {
      onBtnClick('noerr')
    }}>不是错题</Button>
    const audit = <Button
      key="audit"
      type='primary'
      onClick={() => {
        onBtnClick('audit')
      }}>通过并发布</Button>
    const reject = <Button key="reject" onClick={() => {
      onBtnClick('reject')
    }}>未通过</Button>
    let btnList = []
    switch (detail.status) {
      case 0:
      case 3:
        if (!isAudit) (btnList = [edit, sub, del])
        break;
      case 1:
        btnList = isAudit ? [isErr, noErr] : [rev]
        if (!isWrong) btnList = [audit, reject]
        break;
      case 2:
        // btnList = [edit, del]
        break;
      case 4:
        btnList = [edit, del]
        break;
      case 10:
      case 11:
        break
      default:
        btnList = [edit, sub, del]
        break
    }
    return btnList.map(btn => {
      return btn
    })
  }
  return <PageHeaderWrapper >
    <div className={styles.detail}>
      <QuestionDeailHeader className={styles.header} data={detail} isAudit={isAudit} />
      <QuestionDeatailContent className={styles.content} data={detail} />
      <div className={styles.tool}>
        <div>
          <Button onClick={backList}>返回列表</Button>
        </div>

        <div className={styles.btns}>
          {btnsRender()}
        </div>
      </div>
    </div>
    <RejectModal visible={showModal} onCancel={() => setShowModal(false)} />
  </PageHeaderWrapper>
}
export default QuestionDetail