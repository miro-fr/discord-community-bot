import { CommandContext } from '../../src/types/index';
import { addRole } from '../../src/commands/admin/addRole';

describe('addRole Command', () => {
    let context: CommandContext;

    beforeEach(() => {
        context = {
            user: {
                id: '123456789',
                username: 'TestUser',
                discriminator: '0001',
                roles: ['ADMIN'],
            },
            guild: {
                id: '987654321',
                name: 'TestGuild',
                memberCount: 10,
            },
            channel: {
                id: '1234567890',
                name: 'test-channel',
                type: 'text',
            },
        };
    });

    it('should add a role to a user with sufficient permissions', async () => {
        const args = ['@UserToAdd', 'RoleName'];
        const result = await addRole.execute(args, context);
        expect(result).toBe('Role added successfully.');
    });

    it('should fail to add a role if the user does not have permission', async () => {
        context.user.roles = ['USER']; // Change role to USER
        const args = ['@UserToAdd', 'RoleName'];
        await expect(addRole.execute(args, context)).rejects.toThrow('You do not have permission to add roles.');
    });

    it('should handle invalid user mention', async () => {
        const args = ['InvalidUser', 'RoleName'];
        await expect(addRole.execute(args, context)).rejects.toThrow('Invalid user mention.');
    });

    it('should handle invalid role name', async () => {
        const args = ['@UserToAdd', 'InvalidRole'];
        await expect(addRole.execute(args, context)).rejects.toThrow('Role not found.');
    });
});