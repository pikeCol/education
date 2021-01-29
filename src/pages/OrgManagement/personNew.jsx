import { Button, Form, Input, DatePicker, message, Select, Cascader } from 'antd';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { addAccount, putAccount, getGradeList, getRoleList, getAccountDetail } from '@/pages/OrgManagement/service';
import { history } from 'umi'
import { getSchool } from '@/pages/OrgManagement/service';

import styles from './style.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const handleBack = () => {
  history.go(-1)
}
const PersonNew = (props) => {
  const {query} = props.location
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [personInfo, setPersonInfo] = useState({});
  const formRef = useRef()
  
  const handleSubmit = useCallback(async (val) => {
    setLoading(true)
    const theData = {
      ...val,
      id: query.id
    }
    console.log(theData);
    const res = await (query.id ? putAccount : addAccount)(theData)
    setLoading(true)
    if (res.code < 300) {
      message.success('新增人员成功')
      history.go(-1)
    }
  }, [])
  const getSchoolList = async (data) => {
    const res = await getSchool(data)
    // console.log(res)
    if (res.code < 300) {
      return res.data
    }
    return null
  }

  useEffect(() => {
    const theData = {
      pageNum: 1,
      pageSize: 999
    }
    getSchoolList(theData).then(res => {
      if (res.records.length > 0) {
        setSchoolData(res.records)
      }
    })
    getGradeList().then(res => {
      const {code , data} = res
      if (code < 300) {
        setGradeList(data || [])
      }
    })
    getRoleList().then(res => {
      const {code , data} = res
      if (code < 300) {
        setRoleList(data || [])
      }
    })

    if (query.id) {
      getAccountDetail({
        id: query.id
      }).then(res => {
        console.log(res);
        const {data,code} = res
        if (code < 300) {
          formRef.current.setFieldsValue({
            nick: data.nick,
            grades: data.grades,
            mail: data.mail,
            phone: data.phone,
            roles: data.roles[0],
            schoolId: data.schoolId,
          })
        }
      })
    }
  }, [])

  return (
    <>
      <PageHeaderWrapper title="新增人员" />
      <div className={styles.bg} style={{ padding: '15px 30px', minWidth: 800, overflowX: 'auto' }}>
        <Form
          {...formItemLayout}
          onFinish={handleSubmit}
          ref={formRef}
        >
        <Form.Item
          name="schoolId"
          label="学校名称"
          rules={[
            {
              required: true,
              message: '请输入学校名称',
            },
          ]}
          >
            <Select style={{ width: 400 }}>
              {
                schoolData.map(v => <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>)
              }
            </Select>
        </Form.Item>
        <Form.Item
          name="roleIds"
          label="角色"
          rules={[
            {
              required: true,
              message: '请输入角色',
            },
          ]}
          >
            <Select mode="tags" multiple tokenSeparators={[',']} style={{ width: 400 }}>
              {
                roleList.map(v => <Select.Option key={v.value} value={v.value}>{v.title}</Select.Option>)
              }
            </Select>
        </Form.Item>
          <Form.Item
            name="nick"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input style={{ width: 400 }} maxLength={20} />
          </Form.Item>
          <Form.Item
            name="mail"
            label="邮箱"
            rules={[
              {
                required: true,
                message: '请输入邮箱',
              },
            ]}
          >
            <Input style={{ width: 400 }} maxLength={20} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              {
                validator(rule, value) {
                  const telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
                  if (!value || telStr.test(value)) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('手机号码输入不规范')
                },
                message: '请输入正确的手机号',
              },
              {
                required: true,
                message: '请输入手机号',
              },
            ]}
          >
            <Input style={{ width: 400 }} maxLength={11} />
          </Form.Item>
          <Form.Item 
            name="grades" 
            label="年级"
            rules={[
              {
                required: true,
                message: '请选择年级',
              },
            ]}
          >
            <Cascader
              style={{ width: 400 }} 
              options={gradeList}
              fieldNames={{label: 'name', value: 'id'}}
            />
          </Form.Item>
          <Form.Item wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 15 }} loading={loading}>
              {query.id ? '更新' : '新增'}
            </Button>
            <Button onClick={handleBack}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default PersonNew;
