type Metadata = {
  total: number
  page: number
  pageCount: number
  limit: number
}

export type ApiResponse<T> = {
  message?: string
  data: T
  metadata?: Metadata
}
