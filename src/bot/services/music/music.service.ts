import { Injectable } from '@nestjs/common';
import { Client, CommandInteraction, VoiceChannel } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Readable } from 'stream';

@Injectable()
export class MusicService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
  private connections: Map<string, VoiceConnection> = new Map();
  /**
   * Se une a un canal de voz en Discord
   * @param channel El canal de voz al que se debe unir el bot
   * @returns La conexión al canal de voz
   */
  joinVoiceChannel(channel: VoiceChannel): VoiceConnection {
    let connection = this.connections.get(channel.guild.id);

    if (!connection) {
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      this.connections.set(channel.guild.id, connection);
    }

    return connection;
  }
  /**
   * Reproduce la canción en el canal de voz
   * @param stream El stream de audio a reproducir
   * @param connection La conexión al canal de voz
   * @returns Promesa que indica si se comenzó a reproducir correctamente
   */
  async playSong(
    stream: Readable,
    title: string,
    connection: VoiceConnection,
    interaction: CommandInteraction,
  ) {
    const player = createAudioPlayer();
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    player.play(resource);
    const subscription = connection.subscribe(player);

    if (!subscription) {
      console.error('❌ No se pudo suscribir al canal de voz.');
      await interaction.followUp(`❌ Error al conectar al canal de voz.`);
      return;
    }

    player.on(AudioPlayerStatus.Playing, () => {
      console.log(`🔊 Reproduciendo: ${title}`);
      void interaction.followUp(`🎶 ¡Reproduciendo ahora: **${title}**!`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('🎵 Canción terminada.');
      void interaction.followUp(`✅ **${title}** ha finalizado.`);

      setTimeout(() => {
        if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
          console.log('🔌 Desconectando por inactividad...');
          connection.destroy();
          void interaction.followUp(
            '⏳ No hay más canciones, saliendo del canal...',
          );
        }
      }, 20000);
    });

    player.on('error', (error) => {
      console.error('❌ Error en el reproductor:', error);
      void interaction.followUp(`❌ Hubo un problema con la reproducción.`);
    });
  }
}
