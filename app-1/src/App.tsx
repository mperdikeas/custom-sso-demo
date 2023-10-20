import React, {useEffect, useState} from 'react';

import Cookies from 'js-cookie';

function App() {
  const [is_token_present, set_is_token_present] = useState(false);
  useEffect(()=>{
    const token: string | undefined = Cookies.get('cas-token');
    if (token !== undefined) {
      set_is_token_present(true);
    } else {
      const this_app_url ='http://app-1.cognitera.gr:3001';
      window.location.href = 'http://login.cognitera.gr:3000/login?return_url='+encodeURIComponent(this_app_url);
    }
  }, []);
  return (
    <div>
      <b>Application 1</b><br/>
      Token is present? {is_token_present?<b>yes</b>: <b>no</b>}
    </div>
  );
}

export default App;
