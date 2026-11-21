# NestJS Discord Bot

[Español](README.es.md)

Experimental personal Discord bot built with NestJS. Includes text responses, music playback and per-server queues.

## Stack

NestJS · TypeScript · discord.js · Discord Voice.

## Scope and configuration

Requires a Discord application/bot, appropriate permissions and provider configuration. Playback depends on external services; queue and connection state are held in process memory.

## Local development

Use a Node.js toolchain compatible with package.json and the dependency lockfile, when present.

```sh
npm install
npm run start:dev
npm run build
npm test
```
