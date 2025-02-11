import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { InjectDiscordClient } from '@discord-nestjs/core';

@Injectable()
export class MusicService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}
}
