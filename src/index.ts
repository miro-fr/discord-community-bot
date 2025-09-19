// Polyfill ReadableStream for Node < 18 (undici used by discord.js requires it)
if (typeof (globalThis as any).ReadableStream === 'undefined') {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { ReadableStream } = require('web-streams-polyfill/ponyfill');
        (globalThis as any).ReadableStream = ReadableStream;
    } catch (e) {
        // if package not installed, user must install or upgrade Node
        console.warn('ReadableStream not available. Please install web-streams-polyfill or upgrade Node to 18+.');
    }
}

import { Client, GatewayIntentBits, Events } from 'discord.js';
// Load environment variables from .env before anything else
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
} catch (e) {
    // ignore if dotenv not installed; expect env to be set in environment
}
import { config } from './config';
import { registerEvents } from './events/index';
import { restoreFromBackup } from './backup/backupManager';
import { registerSlashCommands } from './slashRegistrar';
import { handleCommand } from './handlers/commandHandler';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    // Register guild slash commands on ready (optional: pass guild id for faster deployment)
    (async () => {
        try {
            // If you want guild-scoped commands for immediate availability, set guildId here.
            await registerSlashCommands();
            console.log('Slash commands registered');
        } catch (err) {
            console.error('Failed to register slash commands', err);
        }
    })();
});

client.on(Events.MessageCreate, async (message) => {
    if (!message.guild) return;
    if (message.content !== '!restore-backup') return;

    if (message.author.id !== message.guild.ownerId) {
        await message.reply('Seul le propriétaire du serveur peut exécuter cette commande.');
        return;
    }

    await message.reply('Début de la restauration depuis le backup JSON...');
    try {
        await restoreFromBackup(message.guild);
        await message.reply('Restauration terminée.');
    } catch (err) {
        console.error(err);
        await message.reply('Erreur durant la restauration. Voir console.');
    }
});

client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isCommand?.()) return;

    const commandName = interaction.commandName;
    const args: string[] = [];
    for (const option of interaction.options?.data || []) {
        if (option.value) args.push(String(option.value));
    }

    const context = {
        user: {
            id: interaction.user.id,
            username: interaction.user.username,
            discriminator: interaction.user.discriminator,
            roles: interaction.member?.roles?.cache ? Array.from(interaction.member.roles.cache.values()).map((r: any) => r.name) : [],
        },
        guild: {
            id: interaction.guildId || '',
            name: interaction.guild?.name || '',
            memberCount: interaction.guild?.memberCount || 0,
        },
        channel: {
            id: interaction.channelId || '',
            name: interaction.channel?.name || '',
            type: 'text',
        }
    } as any;

    try {
        await handleCommand(commandName, args, context);
        await interaction.reply({ content: 'Commande exécutée (vérifier logs)', ephemeral: true });
    } catch (err) {
        console.error('Interaction handling error', err);
        await interaction.reply({ content: 'Erreur lors de l\'exécution de la commande.', ephemeral: true });
    }
});

client.login(config.token).then(() => {
    registerEvents(client);
    // registerCommands removed: command handling is dynamic via handleCommand / slashRegistrar
}).catch(console.error);