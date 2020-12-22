import React, { useState, useEffect } from 'react'
import { Cascader, Select, Button, Spin } from 'antd';
import { getQuestionSubject } from '@/services/myQuestion/create';
import styles from './index.less'

const { Option } = Select

const useQuery = (id) => {
  const [querys, setQuerys] = useState([])
  useEffect(() => {
    getQuestionSubject().then(response => {
      if (response.code < 300) {
        setQuerys(response.data)
      }
    })
  }, [id])
  return querys
}
const isArray = (data) => {
  return Object.prototype.toString.call(data) === '[object Array]'
}
const QuestionsearchHeader = (props) => {
  const { id, selectOptions = [], onQuery } = props

  const querys = useQuery(id)
  const [current, setCurrent] = useState({})
  const [ansysOptions, setAnsysOptions] = useState({})
  const ansysOptionsRender = (key, fn) => {
    if (ansysOptions.hasOwnProperty(key) && isArray(ansysOptions[key])) {
      return ansysOptions[key].map(x => <Option key={x.value + x.label} value={x.value}>{x.label}</Option>)
    }
    fn.then(res => {
      setAnsysOptions({
        ...ansysOptions,
        [key]: res
      })
    })
    return <Spin spinning />
  }
  const selectRender = (select, key) => {
    const { queryKey, defaultValue, options } = select
    return <span key={key} >
      <Select
        className={styles.select}
        value={current[queryKey] || defaultValue}
        onChange={(value) => {
          setCurrent({
            ...current,
            [queryKey]: value
          })
        }}>{isArray(options) ? select.options.map(x => <Option key={x.value + x.label} value={x.value}>{x.label}</Option>) : ansysOptionsRender(queryKey, options)}</Select>
    </span>

  }

  const selectsRender = () => {
    return selectOptions.map((select, index) => {
      return selectRender(select, index)
    })
  }
  return <div className={styles.header}>
    <span>
      <Cascader
        fieldNames={{ label: 'name', value: 'id', children: 'children' }}
        options={querys}
        onChange={(values) => {
          setCurrent({
            ...current,
            subject: values
          })
        }} />
      {selectsRender(selectOptions)}
    </span>
    <span>
      <Button
        className={styles.button}
        type="primary"
        onClick={() => {
          onQuery(current)
        }}>筛选</Button>
      <Button
        className={styles.button}
        onClick={() => {
          setCurrent({})
          onQuery({})
        }}>重置</Button>
    </span>

  </div>

}
export default QuestionsearchHeader