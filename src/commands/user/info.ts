import { CommandContext } from '../../types';

export default {
    name: 'info',
    description: 'Retrieve information about the user.',
    requiredPermissionLevel: 1,
    execute: async (args: string[], context: CommandContext) => {
        const { user, guild } = context;

        const userInfo = {
            username: user.username,
            discriminator: user.discriminator,
            guildName: guild.name,
            roles: (user.roles || []).join(', ') || 'No roles assigned',
        };

        console.log(`User Info: ${JSON.stringify(userInfo, null, 2)}`);
    }
};