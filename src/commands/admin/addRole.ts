import { CommandContext } from '../../types';
import { RoleService } from '../../services/roleService';

export default {
    name: 'addrole',
    description: 'Adds a role to a user.',
    requiredPermissionLevel: 3,
    execute: async (args: string[], context: CommandContext) => {
        const { user, guild } = context;

        if (!user.roles.includes('ADMIN')) {
            throw new Error('You do not have permission to add roles.');
        }

        if (args.length < 2) {
            throw new Error('Usage: /addrole <user_id> <role_id>');
        }

        const userId = args[0];
        const roleId = args[1];

    const roleService = new RoleService(guild as any);
    const success = await roleService.addRoleToUser(guild.id, userId, roleId);

        if (success) {
            console.log(`Role ${roleId} added to user ${userId}.`);
        } else {
            throw new Error('Failed to add role. Please check the user ID and role ID.');
        }
    }
};