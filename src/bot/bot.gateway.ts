import { Injectable, Logger } from '@nestjs/common';
import { InjectDiscordClient, On, Once } from '@discord-nestjs/core';
import { Client, Message, TextChannel, Guild } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  onReady() {
    if (this.client.user) {
      this.logger.log(`Bot ${this.client.user.tag} was started!`);

      // Obtener la primera guild (servidor) donde está el bot
      const guild: Guild | undefined = this.client.guilds.cache.first();

      if (!guild) {
        this.logger.warn('El bot no está en ningún servidor.');
        return;
      }

      const channel = guild.channels.cache
        .filter(
          (c) =>
            c.isTextBased() &&
            (c as TextChannel)
              .permissionsFor(this.client.user!)
              ?.has('SendMessages'),
        )
        .first() as TextChannel | undefined;

      if (channel) {
        console.log('Anata ga watashi no Master ka?');
      } else {
        this.logger.warn('No se encontró ningún canal de texto disponible.');
      }
    } else {
      this.logger.log('Bot was started, but user is null.');
    }
  }

  @On('messageCreate')
  async onMessage(message: Message) {
    if (message.author.bot) return;

    if (message.content === '!ping') {
      await message.reply('🏓 Pong!');
    }

    if (message.content === '!hola') {
      await message.reply(this.getRandomSaberGreeting());
    }

    if (message.content === '!saber') {
      await message.reply(this.getRandomSaberMessage());
    }
  }

  /**
   * Retorna un saludo aleatorio de Saber.
   * @returns {string} Un mensaje de saludo seleccionado al azar.
   */
  private getRandomSaberGreeting(): string {
    const greetings: string[] = [
      'Saludos, Maestro. ¿Necesitas de mi espada?',
      'Buenos días. Espero que estés listo para enfrentar cualquier desafío.',
      'Hola. Mientras permanezcamos juntos, la victoria será nuestra.',
      'Es un honor verte nuevamente. ¿Cuál es nuestro próximo movimiento?',
      'Maestro, confío en que has descansado bien. La batalla nos espera.',
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Retorna un mensaje aleatorio de Saber.
   * @returns {string} Un mensaje de mensaje seleccionado al azar.
   */
  private getRandomSaberMessage(): string {
    const greetings: string[] = [
      'La justicia no se obtiene con palabras, sino con acción. Sigamos adelante.',
      'Siempre estaré a tu lado, como lo estuve en tiempos de Camelot.',
      'No importa cuántos enemigos enfrentemos, mi espada nunca vacilará.',
      'Recuerda, Excalibur solo brilla con su máximo esplendor cuando se lucha por un ideal verdadero.',
      'He enfrentado muchas batallas, pero el destino de esta guerra está en tus manos.',
      'Aunque Gilgamesh se crea invencible, su arrogancia será su caída.',
      'Lancer es un oponente formidable, pero la lanza no vencerá a la espada.',
      'Rider es noble en su propio camino, pero nuestra determinación es más fuerte.',
      'He visto el deseo de Emiya. Su convicción es admirable, aunque su camino sea trágico.',
      'Kiritsugu… Su método es despiadado, pero entiendo su dolor.',
      'Maestro, ten cuidado con Caster. Su magia no debe subestimarse.',
      'Berserker es un enemigo feroz, pero su rabia no le dará la victoria.',
      'He oído de Ritsuka Fujimaru. Un Maestro con una voluntad digna de respeto.',
      'En esta era, el Rey de los Héroes sigue siendo tan arrogante como siempre…',
      'Camelot ya no existe, pero su espíritu vive en aquellos que creen en la justicia.',
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }
}
