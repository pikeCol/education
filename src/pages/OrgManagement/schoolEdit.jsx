import { Button, Form, Input, DatePicker, message } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { postNewSchool, getSchoolDetail } from '@/pages/OrgManagement/service';
import { history } from 'umi'
import styles from './style.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { location: { query } } = history
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
const IndexHtml = () => {
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
    setLoading(true)
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
              moment(schoolData.effectiveTime[0]),
              moment(schoolData.effectiveTime[1]),
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
