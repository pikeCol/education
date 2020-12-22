import { Button, Col, Input, Row, Form, message } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import omit from 'omit.js';
import { getMobileCaptcha, getCaptcha } from '@/services/login';
import ItemMap from './map';
import LoginContext from './LoginContext';
import styles from './index.less';

const FormItem = Form.Item;

const getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }) => {
  const options = {
    rules: rules || customProps.rules,
  };

  if (onChange) {
    options.onChange = onChange;
  }

  if (defaultValue) {
    options.initialValue = defaultValue;
  }

  return options;
};

const LoginItem = props => {
  const [count, setCount] = useState(props.countDown || 0);
  const [timing, setTiming] = useState(false); // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
  const [img, setImg] = useState('');
  const {
    onChange,
    customProps,
    defaultValue,
    rules,
    name,
    getCaptchaButtonText,
    getCaptchaSecondText,
    updateActive,
    type,
    tabUtil,
    ...restProps
  } = props;
  const onGetCaptcha = useCallback(async (phone, captcha, token) => {
    const result = await getMobileCaptcha({
      phone,
      captcha,
      bizType: 'login',
      captchaToken: token
    });
    if (result.code < 300) {
      setTiming(true);
    } else {
      message.error(result.messageƒ)
    }


  }, []);
  const getImgCaptcha = useCallback(async () => {
    const result = await getCaptcha()

    if (result && result.code < 300) {
      const token = result.data.captchaToken
      setImg(result.data.image)
      localStorage.setItem('captchaToken',token)
    }
  })
  useEffect(() => {
    let interval = 0;
    const { countDown } = props;
    if (type === 'ImgCaptcha') getImgCaptcha()
    if (timing) {
      interval = window.setInterval(() => {
        setCount(preSecond => {
          if (preSecond <= 1) {
            setTiming(false);
            clearInterval(interval); // 重置秒数

            return countDown || 60;
          }

          return preSecond - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timing]);

  if (!name) {
    return null;
  } // get getFieldDecorator props

  const options = getFormItemOptions(props);
  const otherProps = restProps || {};

  if (type === 'Captcha') {
    const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
    return (
      <FormItem shouldUpdate noStyle>
        {({ getFieldValue }) => (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              <Button
                disabled={timing}
                // className={styles.getCaptcha}
                size="large"
                onClick={() => {
                  const value = getFieldValue('userName');
                  const captcha = getFieldValue('captcha');
                  const token = localStorage.getItem('captchaToken')
                  onGetCaptcha(value, captcha, token);
                }}
              >
                {timing ? `${count} 秒` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        )}
      </FormItem>
    );
  }
  if (type === 'ImgCaptcha') {
    const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
    return (
      <FormItem shouldUpdate noStyle>
        {({ setFieldsValue }) => (
          <Row gutter={8}>
            <Col span={16}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={8}>
              {img ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  src={`${img}`}
                  style={{ width: '100%' }}
                  onClick={() => {
                    getImgCaptcha(setFieldsValue)
                  }}
                />
              ) : null}
            </Col>
          </Row>
        )}
      </FormItem>
    );
  }

  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  
  LoginItems[key] = props => (
    <LoginContext.Consumer>
      {context => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});
export default LoginItems;
