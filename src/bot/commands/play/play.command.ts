/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { PlayDto } from 'src/bot/models/play.dto';
import * as ytdl from 'ytdl-core';
import * as ytSearch from 'yt-search';
import { MusicService } from 'src/bot/services/music/music.service';
import { CommandInteraction, GuildMember } from 'discord.js';

@Command({
  name: 'play',
  description: 'Buscar una canción o reproducir desde una URL de YouTube',
})
@Injectable()
export class PlayCommand {
  constructor(private readonly music: MusicService) {}

  @Handler()
  async onPlay(
    @IA(SlashCommandPipe) dto: PlayDto,
    @InteractionEvent() interaction: CommandInteraction,
  ) {
    if (!dto || !dto.query) {
      return 'Debes elegir una canción';
    }

    const { query } = dto;
    const member: GuildMember = interaction.member as GuildMember;

    // Verificar si el usuario está en un canal de voz
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return '❌ Debes estar en un canal de voz para reproducir música.';
    }

    // Verificar si el query es un link de YouTube
    if (ytdl.validateURL(query)) {
      console.log(`La canción es un link de YouTube: ${query}`);
      void this.music.playAudio(voiceChannel.id, voiceChannel.guild.id, query);
      return `✅ Reproduciendo la canción: ${query}`;
    }

    // Buscar en YouTube si no es un link
    const searchResult = await ytSearch(query);
    const video =
      searchResult.videos.length > 0 ? searchResult.videos[0] : null;

    if (!video) {
      return '❌ No se encontraron resultados en YouTube.';
    }

    console.log(`Primera coincidencia: ${video.title} (${video.url})`);
    void this.music.playAudio(
      voiceChannel.id,
      voiceChannel.guild.id,
      video.url,
    );
    return `🎵 Reproduciendo: ${video.title}`;
  }
}
