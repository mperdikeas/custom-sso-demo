import React, {useState, useCallback} from 'react';

import {useLocation} from 'react-router-dom';

import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Space,
}  from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Cookies from 'js-cookie';

import queryString from 'query-string';


import {
  URLStatusData
} from './util/axios/status-and-data';

import {
  login
} from './backend-api/login/dummy-login';
import {
  Login$POST$RES,
  Login$POST$RES$SUCC
} from './backend-api/login/login.types';


  



function Login() {

  const [
    network_call_in_progress,
    set_network_call_in_progress
  ] = useState<string | undefined>(undefined);

  const [
    login_failure,
    set_login_failure
  ] = useState<boolean>(false);

  const location: unknown = useLocation();

  console.log(`Login location is`, location);
  // @ts-expect-error
  const {search}: {search: string} = location;

  const parsed = queryString.parse(search);

  // @ts-expect-error
  const {return_url}: {return_url: string | undefined} = parsed;

  console.log(`Login return_url is: ${return_url}`);

  const onFinish = useCallback((x: unknown)=>{
    // @ts-expect-error
    const {username, password}: {username: string, password: string} = x;

    set_network_call_in_progress('login');

    const p: Promise<URLStatusData<Login$POST$RES>> = login(username, password);

    p.then( (x: URLStatusData<Login$POST$RES>)=>{
      const {status}: {status: number} = x;
      switch (status) {
        case 200: {
          set_login_failure(false);
          // @ts-expect-error
          const {data}: {data: Login$POST$RES$SUCC} = x;
          const {token      }: {token      : string} = data;
          const {expires_SSE}: {expires_SSE: number} = data;
          const cookieName = 'cas-token';
          const cookieValue = token;
          const expires_date = new Date(expires_SSE * 1000);
          Cookies.set(cookieName, cookieValue, {expires: expires_date, domain: 'cognitera.gr'});
          if (return_url !== undefined) {
            window.location.href = return_url;
          }
          break;
        }
        case 401: {
          set_login_failure(true);
          break;
        }
        default: {
          Modal.error({
            centered: true,
            title: 'Σφάλμα',
            icon: <ExclamationCircleOutlined />,
            content: (
              <>
                <p>
                  Κάποιο σφάλμα παρουσιάστηκε. Αν το πρόβλημα παραμένει, και η αιτία
                  του δεν είναι καθαρή στις λεπτομέρειες που φαίνονται παρακάτω,
                  επικοινωνήστε με την Τεχνική Υποστήριξη
                </p>
                <p>Λεπτομέρειες:</p>
                <div style={{fontFamily: 'monospace', color:'red'}}>
                  {JSON.stringify(x)}
                </div>
              </>
            ),
            okText: 'Καλώς',
            onOk: ()=>{},
            cancelButtonProps: {style: {display: 'none'}}
          });
        }
      }

    }).catch( (err: unknown)=>{

    }).finally(()=>{
      set_network_call_in_progress(undefined);
    });


/*    
    if ((username==='admin') && (password==='admin')) {
      const cookieName = 'cas-token';
      const cookieValue = '666';
      const myDate = new Date();
      myDate.setMonth(myDate.getMonth() + 12);
      Cookies.set(cookieName, cookieValue, {expires: 7, domain: 'cognitera.gr'});
      if (return_url !== undefined) {
        window.location.href = return_url;
      }
    } else {

    }
    */

  }, [return_url]);


const form_is_disabled = (network_call_in_progress !== undefined);

  return (
    <>
    {
      (()=>{
        if (form_is_disabled) {
          const msg = <div>{network_call_in_progress} in progress. Please wait &hellip; </div>;
          return (
            <Space direction='vertical' style={{ width: '100%' }}>
              <Alert message={msg} type='info'/>
            </Space>
          );
        } else {
          return null;
        }
      })()
    }
    {
      (()=>{
        if (login_failure) {
          return (
            <Space direction='vertical' style={{ width: '100%' }}>
              <Alert message='wrong username or password' type='error'/>
            </Space>
          );
        } else {
          return null;
        }
      })()
    }
    <Form
    name='basic'
    onFinish={onFinish}
    onFinishFailed={()=>{}}
    autoComplete='off'
    disabled={form_is_disabled}
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
      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form.Item>
    </Form>
    </>
  );
}

export default Login;
