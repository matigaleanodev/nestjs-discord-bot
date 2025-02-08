import { Param } from '@discord-nestjs/core';

export class PlayDto {
  @Param({
    name: 'query',
    description: 'nombre de la canción o link a YouTube',
    required: true,
  })
  query: string;
}
