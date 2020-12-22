import React, { useState, useEffect } from 'react'
import { Pagination, message } from 'antd'
import { getMyQuestionList } from '@/services/myQuestion/create'
import { QuestionCell, QuestionCellContext } from '../QuestionCell'
import styles from './index.less'

const useList = (query, page, modifyRequest) => {
  const [list, setList] = useState([])
  const [totalN, setTotalN] = useState(0)
  useEffect(() => {
    const fn = modifyRequest || getMyQuestionList
    fn({
      ...query,
      pageSize: page.pageSize,
      pageNum: page.pageNum
    })
      .then(res => {
        if (res.code < 300) {
          const { data: { records = [], total = 0 } } = res
          setList(records)
          setTotalN(total)
        }
        return Promise.reject(res.message)
      })
      .then(msg => message.error(msg))
  }, [page, query])
  return [list, totalN]
}
const QuestionList = (props) => {
  const { query = {}, detailUrl, modifyRequest, isAudit, isWrong, notAllowBtns } = props
  const [page, setPage] = useState({
    pageNum: 1,
    pageSize: 10
  })


  const onPageChange = (num, size) => {
    setPage({
      pageNum: num,
      pageSize: size
    })
  }
  const stateChange = () => {
    setPage({
      pageNum: 1,
      pageSize: page.pageSize || 10
    })
  }

  const [list, total] = useList(query, page, modifyRequest)
  return <div className={styles.questionTable}>
    <QuestionCellContext.Provider >
      <div className={styles.list}>
        {
          list.map(record => {
            return <QuestionCell notAllowBtns={notAllowBtns} url={detailUrl} key={record.id} data={record} isAudit={isAudit} isWrong={isWrong} onStateChange={stateChange}/>
          })
        }
      </div>
    </QuestionCellContext.Provider>
    {total < page.pageSize
      ? null
      : <Pagination
        size="small"
        total={total}
        showSizeChanger
        showQuickJumper
        className={styles.pagination}
        onChange={onPageChange}
        onShowSizeChange={onPageChange} />}
  </div>
}
export default QuestionList