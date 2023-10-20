import {
  DiscordModuleOption,
  DiscordOptionsFactory,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DiscordConfigService implements DiscordOptionsFactory {
  constructor(private config: ConfigService) {}
  createDiscordOptions(): DiscordModuleOption {
    const options: any = {
      token: this.config.get('DISCORD_TOKEN')!,
      prefix: this.config.get('PREFIX')!,
      discordClientOptions: {
        intents: [1, 2, 512],
      },
    };
    return options;
  }
}
