import { MetadataType } from '@/shared/liquidsoap-api/requests/metadata.request';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PostMetadataDto {
  @IsOptional()
  @IsString()
  internalId?: string;

  @IsString()
  @IsEnum(MetadataType)
  type: MetadataType;

  @IsOptional()
  @IsBoolean()
  video: boolean = false;

  @IsOptional()
  @IsBoolean()
  displayMetadata: boolean = true;

  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsOptional()
  @IsString()
  album?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsNumber()
  @IsPositive()
  duration: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  trackNumber?: number;
}
