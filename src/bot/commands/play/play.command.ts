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
    console.log('DTO recibido:', dto);
    if (!dto || !dto.query) {
      return 'debes elegir una cancion';
    }

    const { query } = dto;
    return `Chupala Nestor, pagate un bot no te voy a reporoducir ${query}`;
  }
}
