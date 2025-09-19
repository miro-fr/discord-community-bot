import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { config } from './config';

const commandsPath = path.join(__dirname, 'commands');

export async function registerSlashCommands(guildId?: string) {
  const commands: any[] = [];

  // scan commands folder for modules that export name/description
  const walk = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
        continue;
      }
      if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;
      const rel = path.relative(__dirname, full).replace(/\\/g, '/');
      try {
        // dynamic require to load meta
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(full);
        const def = mod.default || mod;
        if (!def || !def.name || !def.description) continue;
        const builder = new SlashCommandBuilder().setName(def.name).setDescription(def.description);
        // Optionally add args as string options if desired
        commands.push(builder.toJSON());
      } catch (e) {
        // ignore load errors
      }
    }
  };

  walk(commandsPath);

  const rest = new REST({ version: '10' }).setToken(config.token);
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, guildId), { body: commands });
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
  }
}
