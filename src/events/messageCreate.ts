import { Message } from 'discord.js';
import { CommandContext } from '../types/index';
import { handleCommand } from '../handlers/commandHandler';

export const messageCreate = async (message: Message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    const context: CommandContext = {
        user: {
            id: message.author.id,
            username: message.author.username,
            discriminator: message.author.discriminator,
        // Use role names so permission logic can map ranks from the backup JSON
        roles: message.member?.roles.cache.map(role => role.name) || [],
        },
        guild: {
            id: message.guild?.id || '',
            name: message.guild?.name || '',
            memberCount: message.guild?.memberCount || 0,
        },
        channel: {
            id: (message.channel as any).id || '',
            name: (message.channel as any).name || '',
            type: 'text',
        },
    };

    const args = message.content.trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    await handleCommand(commandName, args, context);
};