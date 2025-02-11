import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayDto } from 'src/bot/models/play.dto';
//import { CommandInteraction } from 'discord.js';
import { YoutubeService } from 'src/bot/services/youtube/youtube/youtube.service';

@Command({
  name: 'play',
  description: 'Buscar una canción o reproducir desde una URL de YouTube',
})
@Injectable()
export class PlayCommand {
  constructor(private readonly youtube: YoutubeService) {}

  @Handler()
  async onPlay(
    @IA(SlashCommandPipe) dto: PlayDto,
    //@InteractionEvent() interaction: CommandInteraction,
  ) {
    const { query } = dto;
    if (!dto || !query) return `debe ingresar una cancion`;

    const resolve = await this.youtube.getSong(query);

    console.log(resolve);

    return `su cancion es`;
  }
}
