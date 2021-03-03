/* eslint-disable react/no-danger */
import React, { useState, useContext } from 'react'
import { StarOutlined, BookOutlined, BugFilled, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { changeQuestionStatus } from '@/services/audit';
import { deleteQuestion } from '@/services/myQuestion/create';
import styles from './index.less'
import { QuestionTypesDetail } from '../Enums'

const CellBtnWrapper = (props) => {
  const { btn, key = '', audits = [] } = props

  return (
    audits.indexOf(key) !== -1 ? null : btn
  )
}

const DetailUrl = {
  person: '/questionBank/personalQuestion/detail/',
  question: '/questionBank/manage/detail/'
}
const QuestionCellContext = React.createContext(DetailUrl.person)

const colors = {
  warn: '#F1AE35',
  fail: '#6C6C6C',
  success: '#3CC42F',
  disabled: '#CCCCCC'
}
const QuestionStatus = {
  0: {
    title: '未提交',
    color: colors.disabled
  },
  1: {
    title: '审核中',
    color: colors.warn
  },
  2: {
    title: '审核通过',
    color: colors.success
  },
  3: {
    title: '审核未通过',
    color: colors.disabled
  },
  4: {
    title: '下架',
    color: colors.disabled
  },
  10: {
    title: '不是错题',
    color: colors.disabled
  },
  11: {
    title: '错题',
    color: colors.fail
  },
}
const statusRender = (status, reason) => {
  // eslint-disable-next-line default-case
  const statuData = QuestionStatus[status]
  const style = {
    color: statuData.color
  }
  if (status === 3) {
    style.display = 'inline-block'
    style['white-space'] = 'nowrap'
    return <span style={style}>
      <div >{statuData.title}</div>
      {reason ? <BugFilled title={reason} style={{ color: 'red' }} /> : null}
    </span>
  }
  return <span style={style}>{statuData.title}</span>
}
const QuestionCell = (props) => {
  const { data = {}, isAudit, isWrong, url, onStateChange, notAllowBtns = [], isExamine, putOn } = props
  console.log('QuestionCell========', isAudit, isWrong)
  const { question,
    difficultyLevel = 0,
    type,
    tags = [],
    remark,
    status,
    favorityCount,
    referenceCount } = data
  const onBtnClick = (t) => {
    let title = ''
    let onOk
    if (t === 'del') {
      title = '删除后将不能找回，确认删除？'
      onOk = () => {
        return new Promise((resolve) => {
          deleteQuestion({
            id: data.id
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
            id: data.id,
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
            id: data.id
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
            id: data.id
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
            id: data.id
          }).then(resolve)
        })
      }
    }
    if (t === 'verb') {
      title = '确定下架当前题目？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 4,
            id: data.id
          }).then(resolve)
        })
      }
    }

    if (t === 'up') {
      title = '确定上架当前题目？'
      onOk = () => {
        return new Promise((resolve) => {
          changeQuestionStatus({
            status: 2,
            id: data.id
          }).then(resolve)
        })
      }
    }
    let temp = onOk
    if (onStateChange) {
      temp = () => {
        return new Promise((resolve) => {
          onOk().then(r => {
            onStateChange()
            resolve()
          })
        })
      }
    }
    Modal.confirm({
      title: '注意',
      icon: <ExclamationCircleOutlined />,
      content: title,
      okText: '确认',
      cancelText: '取消',
      onOk: temp
    })
  }
  const menuRender = () => {

    const edit = notAllowBtns.indexOf('edit') !== -1 ? null : <Button key="edit" type='link'>
      <Link to={`/questionBank/personalQuestion/edit/${data.id}`}>编辑</Link>
    </Button>
    const sub = notAllowBtns.indexOf('sub') !== -1 ? null : <Button key="sub" type='link' onClick={() => {
      onBtnClick('sub')
    }}>提交审核</Button>
    const rev = notAllowBtns.indexOf('rev') !== -1 ? null : <Button key="rev" type='link' onClick={() => {
      onBtnClick('rev')
    }}>撤回审核</Button>
    const del = notAllowBtns.indexOf('del') !== -1 ? null : <Button key="del" type='link' style={{ color: 'red' }} onClick={() => {
      onBtnClick('del')
    }}>删除</Button>

    const wrongBtn = <Button key="iserr" type='link' style={{ color: 'red' }} onClick={() => {
      onBtnClick('iserr')
    }}>错题并下架</Button>

    const noWrongBtn = <Button key="noErr" type='link' style={{ color: 'red' }} onClick={() => {
      onBtnClick('noErr')
    }}>不是错题</Button>

    const up = <Button key="up" type='link' onClick={() => {
      onBtnClick('up')
    }}>上架</Button>

    let btnList = []
    switch (status) {
      case 0:
      case 3:
        btnList = [edit, sub, del]
        break;
      case 1:
        btnList = [rev]
        if (isWrong) {
          btnList = [wrongBtn, noWrongBtn]
        }
        break;
      case 2:
        btnList = [edit, del]
        break;
      case 4:
        btnList = [edit, del]
        if (putOn) {
          btnList.push(up)
        }
        break;
      default:
        break
    }
    const filterBtn = btnList.filter(v => v!==null)
    if (filterBtn && filterBtn.length) {      
      return <Menu>
        {filterBtn.map((btn, index) => {
          return <Menu.Item key={index}>
            {btn}
          </Menu.Item>
        })}
      </Menu>
    } else {
      return false
    }
  }


  const verbRender = () => {
    return notAllowBtns.indexOf('verb') !== -1 ? null : <Button type="link" onClick={() => {
      onBtnClick('verb')
    }}>下架 </Button>
  }
  const normalRender = () => {
    const overlay = menuRender()
    return <div className={styles.operate}>
      <div>
        <span><StarOutlined />{favorityCount || 0}</span>
        <span><BookOutlined />{referenceCount || 0}</span>
      </div>
      <div>
        <Link type="link" to={{
          pathname: `${url}${data.id}`,
          state: { isAudit, isWrong, isExamine, putOn }
        }}>详情</Link>
        {status !== 2 ? status !== 10 ? <Divider type="vertical" /> : null : null}
        {
          status !== 2 ? 
          status !== 10 ?
          (overlay && <Dropdown overlay={overlay} placement="bottomCenter">
            <Button type="link">更多 <DownOutlined /></Button>
          </Dropdown>)
          : null
          : 
          verbRender()}
      </div>
    </div>
  }
  const auditRender = () => {
    return <div className={styles.operate} >
      <Link type="link" to={{
        pathname: `${url}${data.id}`,
        state: { isAudit, isWrong, isExamine }
      }}>查看</Link>
    </div>
  }
  return <div className={styles.cell}>
    <div className={styles.content}>
      <div className={styles.title}>
        <span >{type ? QuestionTypesDetail[type].title : null} * 难度 {difficultyLevel} </span>
      </div>

      <div className={styles.question} dangerouslySetInnerHTML={{ '__html': question || '' }} />
      <div className={styles.labels}>
        {tags && tags.map(tag => <span key={tag.id}>{tag.value}</span>)}
      </div>
    </div>
    <div className={styles.right}>
      <div>{statusRender(status, remark)}</div>
      {isAudit ? auditRender() : normalRender()}
    </div>
  </div>
}


export { QuestionCell, QuestionCellContext }