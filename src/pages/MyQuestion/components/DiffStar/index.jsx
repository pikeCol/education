import React from 'react'
import {
  StarOutlined,
  StarFilled
} from '@ant-design/icons'
import styles from './index.less'

const DiffStar = (props) => {
  const { value = 0, onChange, max = 5 } = props
  const starBtnRender = () => {
    const stars = []
    for (let index = 0; index < max; index++) {
      if (index < value) {
        stars.push(<span className={styles.fStar} key={`hard${index}`} >
          <StarFilled onClick={() => {
            if (onChange) {
              onChange(index + 1)
            }
          }} />
        </span>)
      } else {
        stars.push(<span className={styles.eStar} key={`hard${index}`} >
          <StarOutlined onClick={() => {
            if (onChange) {
              onChange(index + 1)
            }
          }} />
        </span>)
      }
    }
    return stars
  }
  return <div className={styles.content}>
    {starBtnRender()}
  </div>
}
export default DiffStar