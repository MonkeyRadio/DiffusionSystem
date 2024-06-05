import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { ListenersService } from 'src/listeners/listeners.service';
import { ListenersDetails, ListenerState } from 'src/listeners/types/Listeners';

@Injectable()
export class HlsDiffService {
  constructor (
    private readonly configService: ConfigService,
    private readonly listenersService: ListenersService,
  ) {}

  private rewriteManifest(manifest: string, listenerId: string): string {
    const lines = manifest.split('\n');
    const newLines = lines.map((line) => {
      if (line.includes('.m3u8')) {
        return line.replace(/(.*).m3u8/, `content/${listenerId}/$1.m3u8`);
      }
      return line;
    });
    return newLines.join('\n');
  }

  public async getManifest(
    manifestId: string,
    userAgent: string,
    opts?: {
      listenerDetails?: ListenersDetails;
    }
  ): Promise<string> {
    const sharedPath = this.configService.get<string>('STREAMS_SHARED_PATH');
    const manifestFile = await readFile(`${sharedPath}/${manifestId}/${manifestId}.m3u8`, 'utf8');
    const {id: listenerId, listener: listener} = this.listenersService.addListener(userAgent, opts?.listenerDetails);
    listener.setManifestId(manifestId);
    return this.rewriteManifest(manifestFile, listenerId);
  }

  public getContentPath(listenerId: string, contentId: string): string {
    const sharedPath = this.configService.get<string>('STREAMS_SHARED_PATH');
    const listener = this.listenersService.getListener(listenerId);
    listener.setState(ListenerState.PLAYING);
    return `${sharedPath}/${listener.getManifestId()}/${contentId}`;
  }

  public endListener(listenerId: string): void {
    this.listenersService.endListener(listenerId);
  }
}
