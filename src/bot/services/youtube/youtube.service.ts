import { Injectable } from '@nestjs/common';
import * as ytdl from '@distube/ytdl-core';
import * as ytsr from '@distube/ytsr';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YoutubeService {
  private cache = new Map<
    string,
    { info: ytdl.videoInfo; stream: ReturnType<typeof ytdl.downloadFromInfo> }
  >();
  private readonly cookies: string;

  constructor(private readonly configService: ConfigService) {
    this.cookies = this.configService.get<string>('YOUTUBE_COOKIES') || '';
  }

  async getSong(query: string) {
    console.log('Buscando:', query);
    const isValidUrl = ytdl.validateURL(query);

    try {
      let videoUrl = query;

      if (this.cache.has(query)) {
        console.log('⚡ Resultado desde caché');
        return this.cache.get(query) as {
          info: ytdl.videoInfo;
          stream: ReturnType<typeof ytdl.downloadFromInfo>;
        };
      }

      if (!isValidUrl) {
        const result = await ytsr(query, { limit: 1, type: 'video' });
        const video = result.items[0];
        if (!video) throw new Error('No se encontró ningún video.');
        videoUrl = video.url;
      }

      const requestOptions = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Cookie: this.cookies,
        },
      };

      const info = await ytdl.getBasicInfo(videoUrl, { requestOptions });

      const stream = ytdl(videoUrl, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
        liveBuffer: 20000,
        requestOptions,
      });

      const result = { info, stream };

      this.cache.set(query, result);
      setTimeout(() => this.cache.delete(query), 10 * 60 * 1000);

      return result;
    } catch (error) {
      console.error('Error al obtener el video:', error);
      throw new Error('No se pudo obtener el video');
    }
  }
}
