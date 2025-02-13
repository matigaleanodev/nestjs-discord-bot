import { Injectable } from '@nestjs/common';
import { VoiceChannel } from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Song } from 'src/bot/models/song.model';

@Injectable()
export class MusicService {
  private connections: Map<string, VoiceConnection> = new Map();
  private queues: Map<string, Song[]> = new Map();
  private players: Map<string, AudioPlayer> = new Map();

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
   * Agrega una canción a la cola y la reproduce si no hay otra en curso.
   * @param song - La canción a agregar a la cola.
   * @param connection - La conexión al canal de voz.
   */
  async addToQueue(
    { title, stream, interaction }: Song,
    connection: VoiceConnection,
  ) {
    const guildId = connection.joinConfig.guildId;
    if (!this.queues.has(guildId)) {
      this.queues.set(guildId, []);
    }

    this.queues.get(guildId)?.push({ title, stream, interaction });

    if (!this.players.has(guildId)) {
      this.players.set(guildId, createAudioPlayer());
    }

    if (this.players.get(guildId)?.state.status !== AudioPlayerStatus.Playing) {
      this.playNext(connection);
    } else {
      await interaction.followUp(`🎶 **${title}** se ha añadido a la cola.`);
    }
  }

  /**
   * Reproduce la siguiente canción en la cola o desconecta si no hay más.
   * @param connection - La conexión al canal de voz.
   */
  playNext(connection: VoiceConnection) {
    const guildId = connection.joinConfig.guildId;
    const queue = this.queues.get(guildId);
    if (!queue || queue.length === 0) {
      setTimeout(() => {
        if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
          console.log('🔌 Desconectando por inactividad...');
          this.connections.delete(guildId);
          connection.destroy();
        }
      }, 20000);
      return;
    }

    const { title, stream, interaction } = queue.shift()!;

    const player = this.players.get(guildId);
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    player?.play(resource);
    connection.subscribe(player!);

    void interaction.followUp(`🎶 ¡Reproduciendo ahora: **${title}**!`);

    player?.on(AudioPlayerStatus.Idle, () => {
      this.playNext(connection);
    });

    player?.on('error', (error) => {
      console.error('❌ Error en el reproductor:', error);
      void interaction.followUp(`❌ Hubo un problema con la reproducción.`);
      this.playNext(connection);
    });
  }
}
