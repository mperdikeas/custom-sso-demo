import React, {useEffect, useState, useCallback} from 'react';
import {Button} from 'antd';

import Cookies from 'js-cookie';

import {login_with_redirect_URL} from './constants';

import {touch} from './touch';

function App() {

  const [is_token_present, set_is_token_present] = useState(false);
  const [call_in_progress, set_call_in_progress] = useState(false);

  const do_touch = useCallback(()=>{
    const p: Promise<void> = touch();
    set_call_in_progress(true);
    p.finally(()=>{
      set_call_in_progress(false);
    });
  }, []);

  useEffect(()=>{
    const token: string | undefined = Cookies.get('cas-token');
    if (token !== undefined) {
      set_is_token_present(true);
    } else {
      window.location.href = login_with_redirect_URL();
    }
  }, []);


  return (
    <>
      <div>
        {(()=>{
          if (call_in_progress) {
            return <span>Please wait &hellip;</span>;
          } else {
            return <span>ready to make a call</span>;
          }
        })()
        }
      </div>
    <div>
      <b>Application 1</b><br/>
      Token is present? {is_token_present?<b>yes</b>: <b>no</b>}
    </div>
    <Button
      disabled={call_in_progress}
      onClick={do_touch}
      type='primary'
    >
      make call
    </Button>
</>
  );
}

export default App;
