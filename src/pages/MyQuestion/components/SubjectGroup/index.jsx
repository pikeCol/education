import React, { useState } from 'react'
import { Cascader, Button } from 'antd'
import styles from './index.less'


const CascaderInLine = (props) => {
  const { data, index, onAdd, onDelete, title, value=[], onChange } = props
  const onSelect = (select) => {
    if(onChange) {
      onChange(select, index)
    }
  }
  return <div className={styles.inline}>
    <span className={styles.title}>{`${title}${index + 1}：`}</span>
    <Cascader
      className={styles.cascader}
      value={value}
      options={data}
      onChange={onSelect}
      fieldNames={
        { label: 'name', value: 'id', children: 'children' }
      } />
    <span >
      <Button onClick={() => {
        if (onDelete) onDelete(index)
      }}>-</Button>
      <Button onClick={() => {
        if (onAdd) onAdd(index)
      }} className={`${index ? styles.unvisibility : ''}`}>+</Button>

    </span>

  </div>
}
const debounce = (fn, wait = 500) => {
  let timeout = null
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);

    }
    timeout = setTimeout(fn, wait);
  }

}
const SubjectGroup = (props) => {
  const { data, value = [[]], onChange } = props
  const changeCascader = (select, index) => {
    if (onChange) {
      value[index] = select
      onChange([...value])

    }
  }
  const deleteLine = (index) => {
    if (value.length === 1) {
      return
    }
    value.splice(index, 1)
    if (onChange) {
      onChange([...value])
    }

  }
  const addLine = () => {
    value.push([])
    if (onChange) {
      onChange([...value])
    }
  }
  return <div className={styles.subjectGroup}>
    {value.map((x, index) => <CascaderInLine
      key={new Date()}
      title="科目课程"
      data={data}
      value={x}
      index={index}
      onDelete={deleteLine}
      onChange={changeCascader}
      onAdd={debounce(addLine)} />)}
  </div>
}
export default SubjectGroup