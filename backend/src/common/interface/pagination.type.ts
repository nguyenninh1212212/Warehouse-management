export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
}
