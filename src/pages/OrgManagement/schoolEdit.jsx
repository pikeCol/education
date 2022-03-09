import { Button, Form, Input, DatePicker, message } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { postNewSchool, getSchoolDetail } from '@/pages/OrgManagement/service';
import { history } from 'umi'
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
const getDetail = async (data) => {
  const res = await getSchoolDetail(data)
  // console.log(res)
  if (res.code < 300) {
    return res.data
  }
  return null
}
const IndexHtml = (props) => {
  const {query} = props.location;
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState();

  const handleSubmit = useCallback(async (val) => {

    setLoading(true)
    const theData = {
      ...schoolData,
      ...val,
      effectiveTime: [
        moment(val.effectiveTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        moment(val.effectiveTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      ],
      id: query.id * 1
    }
    console.log(theData);
    const res = await postNewSchool(theData)
    setLoading(false)
    if (res.code < 300) {
      message.success('编辑学校成功')
      history.go(-1)
    }
  }, [])
  useEffect(() => {
    getDetail({ id: query.id }).then(res => {
      console.log(res);
      setSchoolData(res)
    })
  }, [])
  return (
    <>
      <PageHeaderWrapper title="编辑学校" />
      <div className={styles.bg} style={{ padding: '15px 30px', minWidth: 800, overflowX: 'auto' }}>
        {schoolData && <Form
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={{
            ...schoolData,
            effectiveTime: [
              schoolData.effectiveStartTime && moment(schoolData.effectiveStartTime,"yyyy-MM-DD"),
              schoolData.effectiveEndTime && moment(schoolData.effectiveEndTime,'yyyy-MM-DD'),
            ],
          }}
        >
          <Form.Item
            name="name"
            label="学校名称"
            rules={[
              {
                required: true,
                message: '请输入学校名称',
              },
            ]}
          >
            <Input style={{ width: 400 }} maxLength={20} />
          </Form.Item>
          <Form.Item
            name="effectiveTime"
            label="生效日期"
            rules={[
              {
                type: 'array'
              },
              {
                required: true,
                message: '请选择生效日期',
              },
            ]}>
            <RangePicker style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
              name="adminNick"
              label="学校管理员昵称（用于创建账号）"
              rules={[
                {
                  required: true,
                  message: '请输入学校管理员昵称（用于创建账号）',
                },
              ]}
          >
            <Input style={{ width: 400 }} maxLength={20} />
          </Form.Item>
          <Form.Item
              name="adminPhone"
              label="学校管理员手机号（用于创建账号）"
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
                  message: '请输入学校管理员手机号（用于创建账号）',
                },
              ]}
          >
            <Input style={{ width: 400 }} maxLength={11} />
          </Form.Item>
          <Form.Item
            name="remarks"
            label="备注信息 (选填)"
          >
            <TextArea
              placeholder="请输入备注"
              autoSize={{ minRows: 2, maxRows: 6 }}
              style={{ width: 400 }}
              maxLength={200}
            />
          </Form.Item>
          <Form.Item wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 15 }} loading={loading}>
              保存
            </Button>
            <Button onClick={handleBack}>
              取消
            </Button>
          </Form.Item>
        </Form>}
      </div>
    </>
  );
};

export default IndexHtml;
