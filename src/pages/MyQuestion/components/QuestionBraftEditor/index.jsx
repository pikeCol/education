import React from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { uploadImg } from '@/services/myQuestion/create'
import styles from './index.less'


const QuestionBraftEditor = (props) => {
  const { value, onChange, placeholder, editKey = '' } = props
  console.log('render', value)
  const editorChange = (changes) => {
    if (onChange) onChange(changes)
  }
  const upload = (param) => {
    const fd = new FormData()
    fd.append('file', param.file)
    uploadImg(fd).then(res => {
      if (res.code < 300) {
        param.success({
          url: res.data
        })
      } else {
        param.error({})
      }
    })
  }
  return <div className={styles.content}>
    <BraftEditor
      value={value}
      key={editKey}
      placeholder={placeholder}
      media={{
        uploadFn: upload,
        accepts: {
          video: false,
          accepts: false,
        }
      }}
      onChange={editorChange} />
  </div>
}
const { createEditorState } = BraftEditor
export {
  QuestionBraftEditor,
  createEditorState
} 