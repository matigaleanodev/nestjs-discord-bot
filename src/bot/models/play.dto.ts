import { Param } from '@discord-nestjs/core';

export class PlayDto {
  @Param({
    name: 'query',
    description: 'nombre de la cancion o link a youtube',
    required: true,
  })
  query: string;
}
