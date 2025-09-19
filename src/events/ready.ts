import { Client } from 'discord.js';
import { logInfo } from '../utils/logger';

export const readyEvent = (client: Client) => {
    logInfo(`Logged in as ${client.user?.tag}!`);
    // Additional startup tasks can be performed here
};