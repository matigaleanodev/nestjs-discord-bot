import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { VoiceConnection } from '@discordjs/voice';
import { Injectable } from '@nestjs/common';
import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import { MusicService } from 'src/bot/services/music/music.service';

@Command({
  name: 'next',
  description: 'Salta a la siguiente canción en la cola',
})
@Injectable()
export class NextCommand {
  constructor(private readonly musicService: MusicService) {}

  @Handler()
  async onNext(@InteractionEvent() interaction: CommandInteraction) {
    const member: GuildMember = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel as VoiceChannel;

    if (!voiceChannel) {
      return `Debes unirte a un canal de voz para poder saltar canciones.`;
    }

    const connection: VoiceConnection =
      this.musicService.joinVoiceChannel(voiceChannel);

    if (!connection) {
      return await interaction.followUp(
        `No hay ninguna canción reproduciéndose actualmente.`,
      );
    }

    await interaction.reply(`⏭️ Saltando a la siguiente canción...`);

    try {
      this.musicService.playNext(connection);
      await interaction.followUp(`⏭️ ¡Saltado a la siguiente canción!`);
    } catch (error) {
      console.error('Error en NextCommand:', error);
      return `Ocurrió un error al intentar saltar a la siguiente canción.`;
    }
  }
}
