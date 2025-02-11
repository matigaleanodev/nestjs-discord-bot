import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { VoiceConnection } from '@discordjs/voice';
import { Injectable } from '@nestjs/common';
import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import { PlayDto } from 'src/bot/models/play.dto';
import { MusicService } from 'src/bot/services/music/music.service';
import { YoutubeService } from 'src/bot/services/youtube/youtube/youtube.service';

@Command({
  name: 'play',
  description: 'Buscar una canción o reproducir desde una URL de YouTube',
})
@Injectable()
export class PlayCommand {
  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly musicService: MusicService,
  ) {}

  @Handler()
  async onPlay(
    @IA(SlashCommandPipe) dto: PlayDto,
    @InteractionEvent() interaction: CommandInteraction,
  ) {
    const { query } = dto;

    if (!dto || !query) {
      return `Debe ingresar una canción o una URL válida.`;
    }

    const member: GuildMember = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel as VoiceChannel;

    if (!voiceChannel) {
      return `Debes unirte a un canal de voz para poder solicitar una canción.`;
    }

    try {
      const song = await this.youtubeService.getSong(query);
      if (!song) {
        return `No se pudo encontrar una canción con ese término.`;
      }

      const connection: VoiceConnection =
        this.musicService.joinVoiceChannel(voiceChannel);

      const isPlaying = this.musicService.playSong(song.stream, connection);

      if (isPlaying) {
        console.log(`¡Reproduciendo "${song.info.videoDetails.title}"!`);
        return `¡Reproduciendo "${song.info.videoDetails.title}"!`;
      } else {
        return `Hubo un problema al intentar reproducir la canción.`;
      }
    } catch (error) {
      console.error('Error en PlayCommand:', error);
      return `Ocurrió un error al intentar obtener o reproducir la canción.`;
    }
  }
}
