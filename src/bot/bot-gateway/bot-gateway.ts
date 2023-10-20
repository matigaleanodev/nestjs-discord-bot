import { Injectable, Logger } from '@nestjs/common';
import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { Client } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client<true>,
  ) {}

  @On('ready')
  async onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
    this.client.user.setActivity('Batalla por el Santo Grial', { type: 0 });
  }
}
