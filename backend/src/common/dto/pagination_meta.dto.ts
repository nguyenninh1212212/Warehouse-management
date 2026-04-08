// src/shared/dto/pagination-meta.dto.ts
export class PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(total: number, page: number, limit: number) {
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
