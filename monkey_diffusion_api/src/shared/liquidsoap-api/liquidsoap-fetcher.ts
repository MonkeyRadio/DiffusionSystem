import { FetchOptions, ofetch } from 'ofetch';

export class LiquidsoapFetcher {
  public constructor(private readonly baseUrl: string) {}

  public async get<T>(url: string, opts?: FetchOptions<'json'>) {
    return await ofetch<T>(`${this.baseUrl}${url}`, {
      headers: {
        accept: 'application/json',
      },
      ...opts,
    });
  }

  public async post<T>(url: string, body: any, opts?: FetchOptions<'json'>) {
    return await ofetch<T>(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
      ...opts,
    });
  }

  public async put<T>(url: string, body: any, opts?: FetchOptions<'json'>) {
    return await ofetch<T>(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
      ...opts,
    });
  }

  public async delete<T>(url: string, opts?: FetchOptions<'json'>) {
    return await ofetch<T>(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
      ...opts,
    });
  }
}
