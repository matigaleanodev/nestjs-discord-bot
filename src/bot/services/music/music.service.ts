import {
  joinVoiceChannel,
  AudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
} from '@discordjs/voice';
import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';
import * as play from 'play-dl';

@Injectable()
export class MusicService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  playAudio(voiceChannelId: string, guildId: string, audioUrl: string) {
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) {
      throw new Error('Guild no encontrado');
    }

    const voiceChannel = guild.channels.cache.get(voiceChannelId);
    if (!voiceChannel) {
      throw new Error('El canal no es un canal de voz');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator,
    });

    play
      .stream(audioUrl)
      .then((stream) => {
        const resource = createAudioResource(stream.stream, {
          inputType: StreamType.Opus,
          inlineVolume: true,
        });

        const player = new AudioPlayer();
        connection.subscribe(player);

        player.play(resource);

        player.on('error', (error) => {
          console.error('Player Error:', error);
          connection.disconnect();
        });

        player.on('stateChange', (oldState, newState) => {
          console.log(
            `AudioPlayer state changed: ${oldState.status} -> ${newState.status}`,
          );
        });

        player.on(AudioPlayerStatus.Playing, () => {
          console.log('El audio está reproduciéndose');
        });

        player.on(AudioPlayerStatus.Idle, () => {
          console.log('El audio ha terminado de reproducirse');
          connection.disconnect();
        });
      })
      .catch((error) => {
        console.error('Error streaming audio:', error);
        throw new Error('Error streaming audio');
      });
  }
}
