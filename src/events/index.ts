import { Client } from 'discord.js';
import { readyEvent } from './ready';
import { messageCreate } from './messageCreate';
import { guildMemberAdd } from './guildMemberAdd';

export function registerEvents(client: Client) {
  client.once('ready', () => readyEvent(client));
  client.on('messageCreate', messageCreate);
  client.on('guildMemberAdd', guildMemberAdd as any);
}
