import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ApiService } from '../api.service';
import { RadioModel } from '../models/radio.model';

@Injectable()
export class RadiosService {
  private readonly resource = '/v4/radio';

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
  ) {}

  public async list(token: string): Promise<RadioModel[]> {
    const radios = [];
    const response = await this.apiService.get<RadioModel[]>(
      `${this.resource}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    for (const radio of response) {
      radios.push(new RadioModel(radio));
    }
    return radios;
  }
}
