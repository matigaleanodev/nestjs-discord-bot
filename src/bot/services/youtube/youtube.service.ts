import { Injectable } from '@nestjs/common';
import * as ytdl from '@distube/ytdl-core';
import * as ytsr from '@distube/ytsr';

@Injectable()
export class YoutubeService {
  async getSong(query: string) {
    console.log('Buscando:', query);
    const isValidUrl = ytdl.validateURL(query);

    try {
      let videoUrl = query;

      if (!isValidUrl) {
        const result = await ytsr(query, { limit: 1, type: 'video' });
        const video = result.items[0];
        if (!video) throw new Error('No se encontró ningún video.');
        videoUrl = video.url;
      }

      const info = await ytdl.getBasicInfo(videoUrl);

      const stream = ytdl(videoUrl, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
        liveBuffer: 20000,
      });

      return { info, stream };
    } catch (error) {
      console.error('Error al obtener el video:', error);
      throw new Error('No se pudo obtener el video');
    }
  }
}
