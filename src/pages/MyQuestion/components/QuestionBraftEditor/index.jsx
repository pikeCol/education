import React from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { uploadImg } from '@/services/myQuestion/create'
import styles from './index.less'

import Table from 'braft-extensions/dist/table'

import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'

const options = {
  defaultColumns: 5, // 默认列数
  defaultRows: 5, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['id-2']  // 指定该模块对哪些BraftEditor无效
};

const QuestionBraftEditor = (props) => {
  const { value, onChange, placeholder, editKey = '' } = props
  console.log('render', value)
  BraftEditor.use(Table(options));
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

  const blockExportFn = (contentState, block) => {

    const previousBlock = contentState.getBlockBefore(block.key)
  console.log('====================================');
  console.log(previousBlock && previousBlock.getType());
  console.log('====================================');
    if (block.type === 'unstyled' && previousBlock && previousBlock.getType() === 'atomic') {
      return {
        start: '',
        end: '',
      }
    }
  
  }


  return <div className={styles.content}>
    <BraftEditor
      value={value}
      key={editKey}
      placeholder={placeholder}
      converts={{ blockExportFn }}
      media={{
        uploadFn: upload,
        accepts: {
          video: false,
          accepts: false,
          pasteImage: true
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