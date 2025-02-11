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
        const result = await ytsr(query);
        const video = result.items[0];
        if (!video) throw new Error('No se encontró ningún video.');
        videoUrl = video.url;
      }

      const info = await ytdl.getBasicInfo(videoUrl);

      const stream = ytdl(videoUrl, { filter: 'audioonly' });

      return { info, stream };
    } catch (error) {
      console.error('Error al obtener el video:', error);
      throw new Error('No se pudo obtener el video');
    }
  }
}
