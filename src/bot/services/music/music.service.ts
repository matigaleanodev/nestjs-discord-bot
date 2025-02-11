import { Injectable } from '@nestjs/common';
import { Client, VoiceChannel } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
  VoiceConnection,
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
   * @returns Booleano que indica si se comenzó a reproducir
   */
  playSong(stream: Readable, connection: VoiceConnection): boolean {
    const player = createAudioPlayer();
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('🔊 Reproduciendo audio...');
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('🎵 Canción terminada.');
      // Podés manejar aquí una cola de reproducción si querés
    });

    player.on('error', (error) => {
      console.error('❌ Error en el reproductor:', error);
    });

    return true;
  }
}
