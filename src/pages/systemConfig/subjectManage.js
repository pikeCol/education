import React, { useState, useEffect } from 'react';
import { Tree, Switch, Modal, Input } from 'antd';
import { CarryOutOutlined, FormOutlined, MinusOutlined, PlusOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { getQuestionSubject, addQuestionSubject, deleteQuestionSubject, updateQuestionSubject } from '@/services/myQuestion/create'

import styles from './index.less'


const SubjectManage = () => {

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

  // 递归数据
  useEffect(() => {
    initTree()
  }, [])

  const initTree = () => {
    getQuestionSubject().then(res => {
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
            <MinusOutlined className={styles.pd8} onClick={() => setDeleteModalVisible(true)}/>
            <PlusOutlined className={styles.pd8} onClick={() => { setModalType(0);setModalVisible(true)}}/>
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
      addQuestionSubject({
        leaf: selectedInfo.node.root, //是否是叶子节点 1：是
        name: inputText,    // 名称
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
      </Modal>
      <Modal title={<span><ExclamationCircleOutlined /> 确认</span>} visible={deleteModalVisible} onOk={handleDelete} onCancel={() =>setDeleteModalVisible(false)}>
        确定删除？
      </Modal>
    </PageHeaderWrapper>
  );
};
export default SubjectManage;