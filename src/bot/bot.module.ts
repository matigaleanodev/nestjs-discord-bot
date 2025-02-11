import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';
import { MusicService } from './services/music/music.service';
import { PlayCommand } from './commands/play/play.command';
import { YoutubeService } from './services/youtube/youtube/youtube.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [BotGateway, MusicService, PlayCommand, YoutubeService],
  exports: [PlayCommand],
})
export class BotModule {}
