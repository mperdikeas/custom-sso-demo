import React, {useEffect, useState} from 'react';

import Cookies from 'js-cookie';

function App() {
  const [is_token_present, set_is_token_present] = useState(false);
  useEffect(()=>{
    const token: string | undefined = Cookies.get('cas-token');
    if (token !== undefined) {
      set_is_token_present(true);
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
