import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ApiService } from '../api.service';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthRepository {
  private readonly resource = '/v4/auth';

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
  ) {}

  public async me(token: string): Promise<UserModel> {
    return new UserModel(
      await this.apiService.get(`${this.resource}/me`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  }
}
