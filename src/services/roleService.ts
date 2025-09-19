import { Guild, User } from '../types/index';

export class RoleService {
    private guild: Guild;

    constructor(guild: Guild) {
        this.guild = guild;
    }

    addRole(user: User, role: string): boolean {
        if (!this.hasRole(user, role)) {
            user.roles.push(role);
            return true;
        }
        return false;
    }

    removeRole(user: User, role: string): boolean {
        const roleIndex = user.roles.indexOf(role);
        if (roleIndex > -1) {
            user.roles.splice(roleIndex, 1);
            return true;
        }
        return false;
    }

    hasRole(user: User, role: string): boolean {
        return user.roles.includes(role);
    }

    listRoles(user: User): string[] {
        return user.roles;
    }

    // Compatibility helper used by commands: add role by id/name to user in this guild
    async addRoleToUser(guildId: string, userId: string, roleIdOrName: string): Promise<boolean> {
        // In this simplified local service we don't have guild members; return false to indicate not implemented
        return false;
    }
}