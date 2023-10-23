export type NoContent = ''


export type ErrorShape$A = {
  error_code: 'must_reset_password',
}

export type ErrorShape$B = {
  error_code: 'password_not_sufficiently_complex'
  error_detail: string
}
export type ErrorShape = ErrorShape$A | ErrorShape$B
