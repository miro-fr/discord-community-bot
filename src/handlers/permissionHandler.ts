import { CommandContext } from '../types/index';
import { PermissionLevels } from '../permissions/levels';

// Map of role name patterns (from backup) to permission levels.
const roleToLevelMap: Array<{ match: RegExp; level: number }> = [
    { match: /Direction Suprême|Fondateur|Architecte Suprême|Élite Tech/i, level: PermissionLevels.ADMIN },
    { match: /Sentinelle|Technicien|Drone|Modération|MODERATOR/i, level: PermissionLevels.MODERATOR },
    { match: /.*/, level: PermissionLevels.USER },
];

export const checkPermissions = (context: CommandContext, requiredLevel: number): boolean => {
    const userLevel = getUserPermissionLevel(context.user.roles || []);
    return userLevel >= requiredLevel;
};

const getUserPermissionLevel = (roles: string[]): number => {
    for (const entry of roleToLevelMap) {
        if (roles.some(r => entry.match.test(r))) return entry.level;
    }
    return PermissionLevels.USER;
};