import React, { useState, useEffect } from 'react'
import { getShareDetail } from '@/services/questions/detail';
import { Table, Button, Row, Col, Modal, Pagination } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './detail.less'
import { QuestionTypesDetail } from '@/components/Enums';
import { history } from 'umi';
import { getMyQuestionList, addTopic, deleteTopic } from '@/services/myQuestion/create'
import QuestionsearchHeader from '@/components/QuestionsearchHeader'
import { getTags } from '@/services/myQuestion/create'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const pageStyle = `

@media all {
  .pagebreak {
    display: none;
  }
      
  .header {
    margin: 15px;
    border-bottom: solid 1px #dddddd;
  }
  .header .row {
    padding: 10px 0;
  }
  .header .row .title {
    color: rgba(0, 0, 0, 0.85);
  }
  .content {
    padding: 0 15px;
  }
  .content .line {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  .content .question .desc,
  .content .answer .desc {
    font-size: 16px;
    color: #333333;
  }
  .content .question .select,
  .content .answer .select {
    display: flex;
    font-size: 13px;
    color: #333333;
  }
  .content .question .select span,
  .content .answer .select span {
    flex: 20%;
  }
  .content .question .picture,
  .content .answer .picture {
    display: flex;
    justify-content: start;
  }
  .content .question .picture img,
  .content .answer .picture img {
    width: 100px;
    height: 100px;
    padding: 0 5px;
  }
  .content .question .title,
  .content .answer .title {
    font-size: 18px;
    color: #DDDDDD;
  }
  .delete {
    display: none;
  }

}

@media print {
  .pagebreak {
    page-break-before: always;
  }
}
`;

const QuestionDeailHeader = (props) => {

  const { className, data = {} } = props
  const {
    treeFullNames,
    type,
    tags = [],
    difficultyLevel,
    status = 0,
    submitTime,
    remark,
    submitUserName,
    auditTime,
    auditUserName
  } = data
  const starRender = () => {
    const star = '⭐'
    const arr = Array(difficultyLevel).fill(star)
    return arr.join('')
  }
  const statusRender = () => {
    switch (status) {
      case 0:
        return '未提交'
      case 1:
        return '待审核'
      case 2:
        return '发布中'
      case 3:
        return '审核拒绝'
      case 4:
        return '下架'

      default:
        return '未知'
    }
  }
  const normalRender = () => {
    return <Row className='row'>
      <Col span={12}>
        <span className='title'>状态：</span>
        <span>{statusRender()}</span>
      </Col>
      <Col span={12}>
        <span className='title'>发布时间：</span>
        <span>{submitTime}</span>
      </Col>
    </Row>
  }
  return <div className={className}>
    <Row className='row'>
      <Col span={12}>
        <span className='title'>科目课程：</span>
        <span>{treeFullNames}</span>
      </Col>
      <Col span={12}>
        <span className='title'>题型：</span>
        <span>{QuestionTypesDetail[type]?.title || ''}</span>
      </Col>
    </Row>
    <Row className='row'>
      <Col span={12}>
        <span className='title'>题目标签：</span>
        <span>{tags?.map(x => { return x.value })}</span>
      </Col>
      <Col span={12}>
        <span className='title'>难度：</span>
        <span>{starRender()}</span>
      </Col>
    </Row>

    {normalRender()}

  </div>
}

const typeEnum = {
  '1': '试卷',
  '2': '练习题'
}
const contentEnum = {
  '选择题': "1",
  '多选题': "2",
  '填空题': "3",
  '判断题': "4",
  '解答题': "5",
}


const QuestionDeatailContent = (props) => {
  const { className, data = {}, title, paperId, refresh } = props

  const deletClick = (v) => {
    const { confirm } = Modal;
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除么？',
      onOk() {
        deleteTopic({
          paperId,
          topicIds: [v.id]
        }).then(res => {
          if (res.code < 300) {
            refresh()
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }

  const ct =  data.contents.map((v, index) => {
    const { question, options = [], answer, analysis } = v
      return <div key={v.id} className="question-part">
          <div className='question'>
            <div className='desc' dangerouslySetInnerHTML={{ '__html': `${question}` || '' }} />
            <div className='select'>
              {options?.map(x => <span key={x} dangerouslySetInnerHTML={{ '__html': x || '' }} />)}
            </div>
          </div>
          <Button danger className="delete" onClick={() => {
            deletClick(v)
          }}>删除</Button>
        </div>
    });
  
  return <div className={className}>
    <h3>{title}</h3>
    {ct}
  </div>

}




const ShareDetail = (props) => {
  const { match = {}, location = {}} = props
  const { params } = match
  const [detail, setDetail] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState({
    pageNum: 1,
    pageSize: 10
  })


const useDetail = (params) => {
  getShareDetail(params).then(res => {
    if (res.code < 300) {
      const content = Object.keys(res.data.content).map(x => {
        return {
          name: x,
          ...res.data.content[x]
        }
      })
      setDetail(res.data)
    }
  })
}


useEffect(() =>{
  useDetail(params)
},[])

const fetchList = ({pageSize = 10, pageNum = 1, ...query}) => {
    getMyQuestionList({
      ...query,
      pageSize,
      pageNum
    }).then(res => {
      if (res.code < 300) {
        const { data: { records = [], total = 0 } } = res
        setList(records)
        setTotal(total)
      }
    })
  }


  const onPageChange = ({pageSize,pageNum }) => {
    setPage({
      pageNum: pageNum + 1,
      pageSize: pageSize
    })
    getMyQuestionList({
      queryType: 1,
      pageSize,
      pageNum: pageNum + 1
    }).then(res => {
      if (res.code < 300) {
        const { data: { records = [], total = 0 } } = res
        setList(records)
        setTotal(total)
      }
    })
  }



  const onBtnClick = () => {
    var iframe=document.getElementById("print-iframe");
    if(!iframe){  
            var el = document.getElementById("content");
            iframe = document.createElement('IFRAME');
            var doc = null;
            iframe.setAttribute("id", "print-iframe");
            iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
            document.body.appendChild(iframe);
            doc = iframe.contentWindow.document;
            //这里可以自定义样式
          
            doc.write(`<style  type="text/css">${pageStyle}</style>`);
            doc.write('<div>' + el.innerHTML + '</div>');
            doc.close();
            iframe.contentWindow.focus();            
    }
    iframe.contentWindow.print();
    if (navigator.userAgent.indexOf("MSIE") > 0){
        document.body.removeChild(iframe);
    }
  }

  const columns = [
    {
      title: '题目类型',
      dataIndex: 'type',
      render: (text) => <span >{text ? QuestionTypesDetail[text].title : null} </span>,
    },
    {
      title: '题目',
      dataIndex: 'question',
      render: (text) => <div dangerouslySetInnerHTML={{ '__html': text || '' }} />,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (tags) => {
        if (tags ) {
          return tags.map(tag => <span key={tag.id}>{tag.value}</span>)
        }
      },
    },
    {
      title: '难度',
      dataIndex: 'difficultyLevel',
    },
  ];


  const addClick = () => {
    getMyQuestionList({
      queryType: 1,
      pageSize: page.pageSize,
      pageNum: page.pageNum
    }).then(res => {
      if (res.code < 300) {
        const { data: { records = [], total = 0 } } = res
        setList(records)
        setTotal(total)
        useDetail(params)
      }
    })
    setIsModalVisible(true);
  }
  const backList = () => {
    history.goBack()
  }

  const handleOk = () => {
    if (selectedRows.length > 0) {
      addTopic({
        topicIds: [selectedRows[0].id],
        paperId: params.id,
      }).then((res) => {
        if (res.code < 300) {
          useDetail(params)
        }
      })
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
    },
  };

  const selectOptions = [
    {
      defaultValue: null,
      placeHolder: '请选择题型',
      queryKey: 'type',
      options: [
        {
          label: '全部题型',
          value: null
        },
        {
          label: '单选题',
          value: '1'
        },
        {
          label: '多选题',
          value: '2'
        },
        {
          label: '填空题',
          value: '3'
        },
        {
          label: '判断题',
          value: '4'
        },
        {
          label: '解答题',
          value: '5'
        }
      ]
    },
    {
      defaultValue: null,
      placeHolder: '请选择难度',
      queryKey: 'difficultyLevels',
      options: [
        {
          label: '全部难度',
          value: null
        },
        {
          label: '一星',
          value: '1'
        },
        {
          label: '二星',
          value: '2'
        },
        {
          label: '三星',
          value: '3'
        },
        {
          label: '四星',
          value: '4'
        },
        {
          label: '五星',
          value: '5'
        }
      ]
    },
    {
      defaultValue: null,
      placeHolder: '请选择',
      queryKey: 'tagIds',
      options: new Promise((resolve) => {
        getTags().then(res => resolve([
          {
            label: '全部标签',
            value: null
          },
          ...res.data.map(x => {
            return { label: x.value, value: `${x.id}` }
          })
        ]))
      })
    }
  ]
  const [query, setQuery] = useState({})


  return <PageHeaderWrapper>
  <div className='detail'>
      <QuestionDeailHeader className='header' data={detail} />
      <div id="content">
      {
        detail.content && Object.keys(detail.content).map((v, index) => {
          return <QuestionDeatailContent refresh={() => useDetail(params)} key={index} className='content' paperId={params.id} data={detail.content[v]} title={v}/>
        })
      }
      </div>
      <div className='tool'>
        <div>
          <Button onClick={backList}>返回列表</Button>
        </div>

        <div className='btns'>
          <Button onClick={() => {
            onBtnClick()
          }}>打印</Button>
          <Button onClick={() => {
            addClick()
          }}>添加</Button>
        </div>
      </div>
      <Modal title="请选择题目" width={800} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <QuestionsearchHeader
          className="question-head"
          selectOptions={selectOptions}
          onQuery={(querys) => {
            fetchList(querys)
          }} />
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          rowKey={record => record.id}
          bordered
          pagination={{...page, total}}
          columns={columns}
          dataSource={list}
        />
        {/* <Pagination
          total={total}
          defaultCurrent={1}
          className='pagination'
          onShowSizeChange={onPageChange}
          onChange={onPageChange}/> */}
      </Modal>
      {/* <QuestionDeatailContent className={styles.content} data={detail} /> */}
  </div>  
  </PageHeaderWrapper>
}

export default ShareDetail