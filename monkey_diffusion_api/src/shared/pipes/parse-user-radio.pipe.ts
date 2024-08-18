import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RadioModel } from '../api/models/radio.model';

@Injectable({ scope: Scope.REQUEST })
export class ParseUserRadioPipe implements PipeTransform<string, RadioModel> {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}

  transform(radioId: string): RadioModel {
    if (!radioId) {
      throw new BadRequestException('Validation failed', 'radioId is required');
    }
    const userRadios: RadioModel[] = this.request['radios'];
    if (!userRadios) {
      throw new BadRequestException('Validation failed', 'Radios are required');
    }
    const radio = userRadios.find((radio) => radio.id === radioId);
    if (!radio) {
      throw new BadRequestException('Validation failed', 'Radio not found');
    }
    return radio;
  }
}
