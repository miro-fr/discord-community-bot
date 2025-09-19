import { CommandContext } from '../../types';

export default {
    name: 'warn',
    description: 'Warn a user for inappropriate behavior.',
    requiredPermissionLevel: 2,
    execute: async (args: string[], context: CommandContext) => {
        const { user, guild, channel } = context;

        if (!user.roles.includes('MODERATOR')) {
            (channel as any).send('You do not have permission to warn users.');
            return;
        }

        const targetUserId = args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';

        console.log(`User ${targetUserId} warned by ${user.username}: ${reason}`);

        (channel as any).send(`User <@${targetUserId}> has been warned for: ${reason}`);
    }
};