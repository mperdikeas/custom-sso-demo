const constants = {


  THIS_APP_URL : 'http://app-1.cognitera.gr:3001',
  LOGIN_APP_URL: 'http://login.cognitera.gr:3000/login'


}


export function login_with_redirect_URL(): string {

  const {THIS_APP_URL, LOGIN_APP_URL} = constants;

  return `${LOGIN_APP_URL}?return_url=${encodeURIComponent(THIS_APP_URL)}`;
}
