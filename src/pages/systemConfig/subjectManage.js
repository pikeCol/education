import React, { useState, useEffect } from 'react';
import {Checkbox, Tree, Switch, Modal, Input, message } from 'antd';
import { CarryOutOutlined, FormOutlined, MinusOutlined, PlusOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { getSubjectDictionaryList, addQuestionSubject, deleteQuestionSubject, updateQuestionSubject } from '@/services/myQuestion/create'

import styles from './index.less'


const SubjectManage = () => {
  const [showLeafChoose, setShowLeafChoose] = useState(false);

  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(1);

  const [treeData, setTreeData] = useState([]);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState();
  const [inputText, setInputText] = useState();
  const [isLeaf, setIsLeaf] = useState();

  // 递归数据
  useEffect(() => {
    initTree()
  }, [])

  const initTree = () => {
    getSubjectDictionaryList().then(res => {
      if (res.code < 300) {
        const data = renderTreeNodes(res.data)
        setTreeData(data)
      }
    })
  }

  const renderTreeNodes = data => data.map((item) => {
    item.key = item.id
    item.isEditable = true
    if (item.isEditable) {
      item.title = (
        <div className={styles.treeTitle}>
          <span className={styles.title}>{item.name}</span>
            {
              item.leaf !== 1 &&
              <MinusOutlined className={styles.pd8} onClick={() => setDeleteModalVisible(true)}/>
            }
            {
              item.leaf !== 1 &&
              <PlusOutlined className={styles.pd8} onClick={() => { setModalType(0);setModalVisible(true)}}/>
            }
            <FormOutlined className={styles.pd8} onClick={() => {setModalType(1);setModalVisible(true)}}/>
        </div>
      )
    } else {
      item.title = item.name
    }
    if (item.children && item.children.length) {
      renderTreeNodes(item.children)
    }
    return item
  })


  const onSelect = (selectedKeys, info) => {
    setIsLeaf(false)
    setShowLeafChoose(info.node.level >= 3)
    console.log('selected', selectedKeys, info);
    setInputText(info.node.name)
    setSelectedKeys(selectedKeys)
    setSelectedInfo(info)
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = () => {
    if (modalType === 1) {
      // 编辑
      updateQuestionSubject({
        id: selectedInfo.node.id,
        name: inputText,
      }).then(res => {
        initTree()
        setModalVisible(false);
      })
    } else {
      debugger
      //const length = selectedInfo.node.pos.split('-').length
      let parentLevel = selectedInfo.node.level
      let childLevel = parentLevel + 1;
/*      if (childLevel > 7) {
        message.error('层级已达到上限')
        return
      }*/
      let aaa = isLeaf;
      debugger
      addQuestionSubject({
        leaf: isLeaf ? 1 : childLevel === 4 ? 2 : 0, // 1：叶子节点  2：年级节点
        name: inputText,    // 名称
        level: childLevel,   //相对于父节点 + 1
        parentId: selectedInfo.node.id
      }).then(res => {
        initTree()
        setModalVisible(false);
      })
    }

  };

  const handleDelete = () => {
    deleteQuestionSubject({
      id: selectedInfo.node.id
    }).then(() =>{
      setDeleteModalVisible(false)
      initTree()
    })
  }

  const subDelete = () => {
    console.log(selectedInfo);
    // deleteQuestionSubject({id: selectedInfo.node.id}).then(() => initTree())
  }

  const handleInputChange = (e) => {
      setInputText(e.target.value)
  }

  const onChange = e =>{
    setIsLeaf(e.target.checked)
  }


  return (
    <PageHeaderWrapper>
      <div className={styles.content}>
      <Tree
        defaultExpandAll
        defaultExpandedKeys={[]}
        showLine={true}
        showIcon={false}
        onSelect={onSelect}
        treeData={treeData}
      />
      </div>
      <Modal title={modalType === 1 ? '编辑' : '新增'} visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input value={inputText} onChange={handleInputChange}/>
        {
          modalType !== 1 && showLeafChoose ? <Checkbox onChange={onChange} style={{paddingTop:'20px'}}>指定当前层级为最后一层</Checkbox>
              : ("")
        }

      </Modal>
      <Modal title={<span><ExclamationCircleOutlined /> 确认</span>} visible={deleteModalVisible} onOk={handleDelete} onCancel={() =>setDeleteModalVisible(false)}>
        确定删除？
      </Modal>
    </PageHeaderWrapper>
  );
};
export default SubjectManage;
