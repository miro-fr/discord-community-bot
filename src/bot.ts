import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { handleCommand } from './handlers/commandHandler';
import { readyEvent } from './events/ready';
import { messageCreate } from './events/messageCreate';
import { guildMemberAdd } from './events/guildMemberAdd';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', () => {
    readyEvent(client);
});

client.on('messageCreate', (message) => {
    // messageCreate already uses handleCommand internally
    messageCreate(message);
});

client.on('guildMemberAdd', (member) => {
    guildMemberAdd(member, { user: { id: '', username: '', discriminator: '', roles: [] }, guild: member.guild as any, channel: { id: '', name: '', type: 'text' } } as any);
});

client.login(config.token);