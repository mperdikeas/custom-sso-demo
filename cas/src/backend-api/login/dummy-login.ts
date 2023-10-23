import {
  getAtMostOneElement
} from '../../util/util';

import {
  URLStatusData
} from '../../util/axios/status-and-data';

import {
  Login$POST$RES
} from './login.types';


type UserType = {username: string, password: string}

const users: UserType[] = [
  {username: 'admin', password: 'admin'}
];



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
          resolve( {
            url: '/login',
            status: 200,
            data: {
              token: '42',
              expires: -1
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
