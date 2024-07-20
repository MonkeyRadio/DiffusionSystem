import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type FetchOptions, ofetch } from 'ofetch';
import { AuthService } from './repositories/auth.service';
import { RadiosService } from './repositories/radios.service';

@Injectable()
export class ApiService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService)) public readonly auth: AuthService,
    @Inject(forwardRef(() => RadiosService))
    public readonly radio: RadiosService,
  ) {
    this.baseUrl = this.configService.get<string>('DIFFUSION_API_BASE_API_URL');
  }

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
