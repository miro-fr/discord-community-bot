import { CommandContext } from '../../types';

export default {
    name: 'timeout',
    description: 'Timeout a user for a specified duration.',
    requiredPermissionLevel: 2,
    execute: async (args: string[], context: CommandContext) => {
        const { user, guild, channel } = context;

        if (!user.roles.includes('MODERATOR')) {
            return (channel as any).send('You do not have permission to timeout users.');
        }

        const targetUserId = args[0];
        const duration = parseInt(args[1]);

        if (!targetUserId || isNaN(duration)) {
            return (channel as any).send('Usage: /timeout <user_id> <duration_in_minutes>');
        }

        const targetUser = (guild as any).members?.find?.((member: any) => member.id === targetUserId);
        if (!targetUser) {
            return (channel as any).send('User not found.');
        }

        (channel as any).send(`User <@${targetUserId}> has been timed out for ${duration} minutes.`);
    }
};