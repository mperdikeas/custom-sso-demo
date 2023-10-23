export type StatusAndData<T> = {
  status: number
  data: T
}


export type URLStatusData<T> = StatusAndData<T> & {
  url: string
}
