import { Pagination } from "./pagination-param.decorator";

export interface PaginatedReponse<T> extends Pagination {
  data: T;
  total: number;
  totalPages: number;
}

export const paginatedResponse = <T>(data: T, total: number, paginatedParams: Pagination): PaginatedReponse<T> => {
  return {
    data,
    total,
    totalPages: Math.ceil(total / paginatedParams.limit),
    ...paginatedParams };
}