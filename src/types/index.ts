export interface ICommand {
  name: string;
  description: string;
  execute(...args: any[]): Promise<void>;
}

export interface IModerationCommand extends ICommand {
  execute(userId: string, targetId: string): Promise<void>;
}

export interface IMusicCommand extends ICommand {
  execute(url: string): Promise<void>;
}

export interface IInteractionCommand extends ICommand {
  execute(userId: string): Promise<void>;
}

export interface IQueue {
  songs: string[];
  currentSongIndex: number;
}

export interface IDiscordEvent {
  type: string;
  data: any;
}
