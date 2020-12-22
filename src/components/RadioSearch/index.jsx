import React, { useState } from 'react'
import { Radio, Input } from 'antd'
import styles from './index.less'

const { Search } = Input

const RadioSearch = (props) => {
  const { options, defaultValue, onSearch } = props
  const [currentOption, setCurrentOption] = useState(defaultValue)
  return <div className={styles.searchline}>
    <span>
      <Radio.Group
        value={currentOption}
        buttonStyle="solid"
        onChange={({ target: { value } }) => {
          setCurrentOption(value)
          onSearch(value, '')
        }} >
        {options.map(x => <Radio.Button key={x.value} value={x.value}>{x.label}</Radio.Button>)}

      </Radio.Group>
    </span>
    {/* <Search
      onSearch={(value) => {
        onSearch(currentOption, value)
      }}
      className={styles.search} /> */}
  </div>
}
export default RadioSearch