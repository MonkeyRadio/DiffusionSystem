import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { RequiredPipe } from '@/shared/pipes/required.pipe';
import { MustBe } from '@/api-accredit/decorators/must-be.decorator';
import { UserRole } from '@/shared/api/enums/user-role.enum';
import { ApiAccreditGuard } from '@/api-accredit/api-accredit.guard';
import { RadioModel } from '@/shared/api/models/radio.model';
import { PostMetadataDto } from './dto/post-metadata.dto';
import { ParseUserRadioPipe } from '@/shared/pipes/parse-user-radio.pipe';
import { PutMetadataDto } from './dto/put-metadata.dto';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('current')
  public async current(
    @Query('radioId', RequiredPipe) radioId: string,
    @Query('contentId', RequiredPipe) contentId: string,
  ) {
    try {
      return await this.metadataService.current(radioId, contentId);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @MustBe(UserRole.Streamer)
  @UseGuards(ApiAccreditGuard)
  @Post('current')
  public async postCurrent(
    @Query('radioId', ParseUserRadioPipe) radio: RadioModel,
    @Query('contentId', RequiredPipe) contentId: string,
    @Body() metadata: PostMetadataDto,
  ) {
    return this.metadataService.postCurrent(radio.id, contentId, metadata);
  }

  @MustBe(UserRole.Streamer)
  @UseGuards(ApiAccreditGuard)
  @Put('current')
  public async updateCurrent(
    @Query('radioId', ParseUserRadioPipe) radio: RadioModel,
    @Query('contentId', RequiredPipe) contentId: string,
    @Body() metadata: PutMetadataDto,
  ) {
    return this.metadataService.updateCurrent(radio.id, contentId, metadata);
  }
}
