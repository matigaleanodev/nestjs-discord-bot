import { CommandInteraction } from 'discord.js';
import { Readable } from 'stream';

export interface Song {
  title: string;
  stream: Readable;
  interaction: CommandInteraction;
}
