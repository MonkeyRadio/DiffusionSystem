import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { HlsService } from './hls.service';
import { Response } from 'express';

@Controller('diffusion/hls')
export class HlsController {
  constructor(private readonly hlsService: HlsService) {}

  @Get(':radioId/content/:listenerId/:contentId')
  getContentPath(
    @Param('listenerId') listenerId: string,
    @Param('contentId') contentId: string,
    @Res() res: Response,
  ): void {
    try {
      const path = this.hlsService.getContentPath(listenerId, contentId);
      res.sendFile(path);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get(':radioId/:manifestId')
  async getManifest(
    @Param('radioId') radioId: string,
    @Param('manifestId') manifestId: string,
    @Query('webapp-uuid') webappUuid: string,
    @Query('origin') origin: string | undefined,
    @Request() req: Request,
    @Res() res: Response,
  ) {
    try {
      manifestId = manifestId.replace(/\..*/, '');
      const manifest = await this.hlsService.getManifest(
        radioId,
        manifestId,
        req.headers['user-agent'],
        {
          listenerDetails: {
            webappUuid,
            origin,
          },
        },
      );
      res.contentType('application/vnd.apple.mpegurl').send(manifest);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get(':radioId/end/:listenerId')
  endListener(@Param('listenerId') listenerId: string): void {
    try {
      this.hlsService.endListener(listenerId);
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
