# NestJS Discord Bot

[Español](README.es.md)

Experimental personal Discord bot built with NestJS. Includes text responses, music playback and per-server queues.

## Stack

NestJS · TypeScript · discord.js · Discord Voice.

## Scope and configuration

Requires a Discord application/bot, appropriate permissions and provider configuration. Playback depends on external services; queue and connection state are held in process memory.

## Commands

[BotGateway](src/bot/bot.gateway.ts) handles the exact text commands `!ping`, `!hola` and `!saber`, ignoring messages authored by bots. The slash command [`/play`](src/bot/commands/play/play.command.ts) receives a search query or YouTube URL; [`/next`](src/bot/commands/next/next.command.ts) advances playback. Both voice commands require the requesting member to be in a voice channel. These handlers do not provide a command to persist or restore queues after a restart.

## Local development

Use a Node.js toolchain compatible with package.json and the dependency lockfile, when present.

```sh
npm install
npm run start:dev
npm run build
npm test
```
