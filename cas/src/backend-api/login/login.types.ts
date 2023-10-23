import {
  NoContent,
  ErrorShape$A,
  ErrorShape$B
} from '../common-types/backend-common-types';

export type Login$POST$REQ = {
  username: string
  password: string
}

export type Login$POST$RES$401 = NoContent
export type Login$POST$RES$403 = ErrorShape$A

export type Login$POST$RES$ERR = Login$POST$RES$401 | Login$POST$RES$403
export type Login$POST$RES$SUCC = {
  token: string
  expires: number
}

export type Login$POST$RES = Login$POST$RES$ERR | Login$POST$RES$SUCC
