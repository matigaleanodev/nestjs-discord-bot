import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { DiscordModule } from '@discord-nestjs/core';
import { MusicService } from './services/music/music.service';
import { PlayCommand } from './commands/play/play.command';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [BotGateway, MusicService, PlayCommand],
  exports: [PlayCommand],
})
export class BotModule {}
