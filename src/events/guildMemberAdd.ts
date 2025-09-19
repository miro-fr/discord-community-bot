import { GuildMember } from 'discord.js';

export const guildMemberAdd = async (member: GuildMember, _context: any) => {
    const guild = member.guild;
    const welcomeChannel = guild.channels.cache.find((c: any) => c.name === 'welcome' && c.isText && c.isText());

    if (welcomeChannel) {
        (welcomeChannel as any).send?.(`Welcome to the server, ${member.user.username}!`);
    }

    const role = guild.roles.cache.find((r: any) => r.name === 'Member');
    if (role) {
        await member.roles.add(role as any);
    }
};