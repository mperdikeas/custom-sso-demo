import Cookies from 'js-cookie';

import {login_with_redirect_URL} from './constants';

export function touch(): Promise<void> {

  return new Promise( (resolve, reject)=>{
    setTimeout(()=>{
      const token: string | undefined = Cookies.get('cas-token');
      if (token !== undefined) {
        // statistically fail the call every third time
        if ((new Date()).getTime() %3 === 0) {
          window.location.href = login_with_redirect_URL();
        } else {
          resolve();
        }
      } else {
        window.location.href = login_with_redirect_URL();
      }
    }, 2000);

  });


}
