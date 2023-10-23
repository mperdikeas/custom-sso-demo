import {
  getAtMostOneElement,
  sse
} from '../../util/util';

import {
  URLStatusData
} from '../../util/axios/status-and-data';

import {
  constants
} from '../../constants';

import {
  Login$POST$RES
} from './login.types';


type UserType = {username: string, password: string}

const users: UserType[] = [
  {username:  'admin', password:  'admin'},
  {username: 'admin2', password: 'admin2'}
];


const {DURATION_OF_TOKEN_IN_SECS} = constants;



export function login(username: string, pwd: string): Promise<URLStatusData<Login$POST$RES>> {
  const p = new Promise<URLStatusData<Login$POST$RES>>((resolve: any, reject: any)=>{
    setTimeout(()=>{
      const _user: UserType[] | undefined = users.filter( (x: UserType)=>x.username === username);
      const user: UserType | null = getAtMostOneElement(_user);
      if (user===null) {
        resolve( {
          url: '/login',
          status: 401,
          data: ''
        });
      } else {
        const {password} = user;
        if (pwd === password) {
          const expires = sse() + DURATION_OF_TOKEN_IN_SECS;
          resolve( {
            url: '/login',
            status: 200,
            data: {
              token: '42',
              expires_SSE: expires
            }
          });
        } else {
          resolve( {
            url: '/login',
            status: 401,
            data: ''
          });
        }
      }
    }, 3000);

  });
  return p;

}
