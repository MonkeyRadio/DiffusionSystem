import { Controller, Get, NotFoundException, Param, Query, Request, Res } from '@nestjs/common';
import { HlsDiffService } from './hls-diff.service';
import { Response } from 'express';

@Controller('hls-diff')
export class HlsDiffController {
  constructor(private readonly hlsDiffService: HlsDiffService) {}

  @Get('content/:listenerId/:contentId')
  getContentPath(@Param('listenerId') listenerId: string, @Param('contentId') contentId: string, @Res() res: Response): void {
    try {
      const path = this.hlsDiffService.getContentPath(listenerId, contentId);
      res.sendFile(path);
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @Get(':manifestId')
  async getManifest(
    @Param('manifestId') manifestId: string,
    @Query('webapp-uuid') webappUuid: string,
    @Request() req: Request
  ): Promise<string> {
    try {
      manifestId = manifestId.replace(/\..*/, '');
      return await this.hlsDiffService.getManifest(manifestId, req.headers['user-agent'], {
        listenerDetails: {
          webappUuid
        }
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }

}
