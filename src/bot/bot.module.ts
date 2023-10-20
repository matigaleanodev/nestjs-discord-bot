import { Module } from '@nestjs/common';
import { BotGateway } from './bot-gateway/bot-gateway';
import { DiscordModule } from '@discord-nestjs/core';
import { DiscordConfigService } from './service/discord-config/discord-config.service';

@Module({
  imports: [DiscordModule.forRootAsync({ useClass: DiscordConfigService })],
  providers: [DiscordConfigService, BotGateway],
})
export class BotModule {}
