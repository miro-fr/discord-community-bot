import { CommandContext } from '../../types';

export default {
    name: 'mute',
    description: 'Mutes a user in the server.',
    requiredPermissionLevel: 3,
    execute: async (args: string[], context: CommandContext) => {
        const { user, guild } = context;

        // Check is handled centrally, but keep guard
        if (!user.roles.includes('ADMIN') && !user.roles.includes('MODERATOR')) {
            throw new Error('You do not have permission to mute users.');
        }

        const userIdToMute = args[0];
        const userToMute = (guild as any).members?.find?.((member: any) => member.id === userIdToMute);

        if (!userToMute) {
            throw new Error('User not found.');
        }

        // Placeholder mute logic
        userToMute.roles = userToMute.roles || [];
        userToMute.roles.push('Muted');

        // Notify the channel about the mute action
        await (context.channel as any).send?.(`${userToMute.username} has been muted.`);
    }
};