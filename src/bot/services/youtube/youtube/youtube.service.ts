import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as ytdl from '@distube/ytdl-core';
import * as ytsr from '@distube/ytsr';

@Injectable()
export class YoutubeService {
  async getSong(query: string) {
    console.log(query);
    const isValidUrl = ytdl.validateURL(query);
    if (isValidUrl) {
      const info = await ytdl.getBasicInfo(query);

      const stream = ytdl(query).pipe(fs.createWriteStream('video.mp4'));

      return { info, stream };
    } else {
      const result = await ytsr(query);
      const video = result.items[0];
      const url = video.url;
      const info = await ytdl.getBasicInfo(url);

      const stream = ytdl(query).pipe(fs.createWriteStream('video.mp4'));

      return { info, stream };
    }
  }
}
