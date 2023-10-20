import React, {useCallback} from 'react';

import { Button, Form, Input }  from 'antd';

import Cookies from 'js-cookie';



function Login() {

  const onFinish = useCallback((x: unknown)=>{
    // @ts-expect-error
    const {username, password}: {username: string, password: string} = x;
    if ((username==='admin') && (password==='admin')) {
      const cookieName = 'cas-token';
      const cookieValue = '666';
      const myDate = new Date();
      myDate.setMonth(myDate.getMonth() + 12);
      Cookies.set(cookieName, cookieValue, {expires: 7, domain: 'cognitera.gr'});
    } else {

    }

  }, []);
  return (
    <Form
    name='basic'
    onFinish={onFinish}
    onFinishFailed={()=>{}}
    autoComplete='off'
    >

    <Form.Item
      label='Username'
      name='username'
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label='Password'
      name='password'
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
    </Form>
  );
}

export default Login;
