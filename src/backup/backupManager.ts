import fs from 'fs';
import path from 'path';
import {
  Guild,
  ChannelType,
  PermissionFlagsBits,
  OverwriteType
} from 'discord.js';

const structurePath = path.join(__dirname, 'backupStructure.json');

type Structure = {
  roles: string[];
  categories: Array<{
    name: string;
    children: string[];
    private?: boolean;
    allowedRoles?: string[];
    voice?: boolean;
  }>;
  baseRole?: string;
};

export async function restoreFromBackup(guild: Guild) {
  const raw = fs.readFileSync(structurePath, 'utf-8');
  const structure: Structure = JSON.parse(raw);

  // Create roles (skip existing)
  const roleMap = new Map<string, { id: string }>();
  for (const roleName of structure.roles) {
    const existing = guild.roles.cache.find(r => r.name === roleName);
    if (existing) {
      roleMap.set(roleName, { id: existing.id });
      continue;
    }
    const created = await guild.roles.create({
      name: roleName,
      reason: 'Restauration backup roles'
    });
    roleMap.set(roleName, { id: created.id });
  }

  // Ensure base everyone role exists in map
  const everyoneRole = guild.roles.everyone;
  roleMap.set(structure.baseRole ?? '@everyone', { id: everyoneRole.id });

  // Create categories and channels
  for (const cat of structure.categories) {
    // avoid duplicate category
    let category =
      guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name === cat.name
      ) ?? undefined;

    if (!category) {
      category = await guild.channels.create({
        name: cat.name,
        type: ChannelType.GuildCategory,
        reason: 'Restauration backup categories'
      });
    }

    // Build base overwrites for private categories
    const baseOverwrites: any[] = [];
    if (cat.private) {
      // deny everyone view, allow allowedRoles
      baseOverwrites.push({
        id: everyoneRole.id,
        type: OverwriteType.Role,
        deny: PermissionFlagsBits.ViewChannel
      });
      if (cat.allowedRoles) {
        for (const rn of cat.allowedRoles) {
          const roleEntry = roleMap.get(rn);
          if (!roleEntry) continue;
          baseOverwrites.push({
            id: roleEntry.id,
            type: OverwriteType.Role,
            allow: PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages
          });
        }
      }
  // apply overwrites to category (updates existing)
  // cast to any because Channel union types may not expose permissionOverwrites directly
  await (category as any).permissionOverwrites.set(baseOverwrites, 'Restauration overwrites');
    }

    // create children channels if not exist
    for (const childName of cat.children) {
      const isVoice = !!cat.voice;
      const existingChild = guild.channels.cache.find(
        c => c.parentId === category.id && c.name === childName
      );
      if (existingChild) continue;

      await guild.channels.create({
        name: childName,
        type: isVoice ? ChannelType.GuildVoice : ChannelType.GuildText,
        parent: category.id,
        reason: 'Restauration backup channels',
        permissionOverwrites: cat.private ? baseOverwrites : undefined
      });
    }
  }

  return { success: true };
}
