import { Injectable, Logger } from '@nestjs/common';
import { On } from '@discord-nestjs/core';
import { Message } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  @On('messageCreate')
  async onMessage(message: Message) {
    if (message.author.bot) return;

    if (message.content === '!ping') {
      await message.reply('🏓 Pong!');
    }
  }
}
