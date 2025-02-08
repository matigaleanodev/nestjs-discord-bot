import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayDto } from 'src/bot/models/play.dto';

@Command({
  name: 'play',
  description: 'Buscar una canción o reproducir desde una URL de YouTube',
})
@Injectable()
export class PlayCommand {
  @Handler()
  onPlay(@IA(SlashCommandPipe) dto: PlayDto) {
    const { query } = dto;

    if (!query) return 'debes elegir una cancion';

    return `la cancion elegida es ${query}`;
  }
}
