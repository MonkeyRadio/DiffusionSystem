import { Filter } from './query-filter-type';

export class QueryFilter {
  private filters: Filter[] = [];

  public set(field: string, value: string | number | boolean): QueryFilter {
    this.filters.push({ field, value });
    return this;
  }

  public get urlEncoded(): string {
    return this.filters
      .map((filter) => `${filter.field}=${filter.value}`)
      .join('&');
  }
}
