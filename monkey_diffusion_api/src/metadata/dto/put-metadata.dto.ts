import { IsBoolean, IsOptional } from 'class-validator';

export class PutMetadataDto {
  @IsOptional()
  @IsBoolean()
  video: boolean = false;

  @IsOptional()
  @IsBoolean()
  displayMetadata: boolean = true;
}
