import React, { useState, useEffect } from 'react'
import { getTags } from '@/services/myQuestion/create'
import styles from './index.less'


const useTags = () => {
  const [tags, setTags] = useState([])
  useEffect(() => {
    getTags().then(res => {
      if (res.code < 300) setTags(res.data)
    })
  }, [])
  return tags
}
const TagsSelect = (props) => {
  const { value = [], onChange } = props
  const clickTag = (tag, select) => {
    if (onChange) {
      if (select) {
        onChange([...value, tag])
      } else {
        const index = value.findIndex(x => x.id === tag.id)
        value.splice(index, 1)
        onChange([...value])
      }
    }
  }
  const tags = useTags()
  return <div className={styles.tags}>
    {tags.map(tag => {
      let className = styles.unselect
      let select = false
      if (value && value.findIndex(x => x.id === tag.id) !== -1) {
        className = styles.select
        select = true
      }
      return <span
        className={className}
        key={tag.id}
        onClick={() => {
          clickTag(tag, !select)
        }}
      >{tag.value}</span>

    })}
  </div>
}
export default TagsSelect