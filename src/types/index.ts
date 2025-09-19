export interface Command {
    name: string;
    description: string;
    execute: (args: string[], context: CommandContext) => Promise<void>;
}

export interface CommandContext {
    user: User;
    guild: Guild;
    channel: Channel;
}

export interface User {
    id: string;
    username: string;
    discriminator: string;
    roles: string[];
}

export interface Guild {
    id: string;
    name: string;
    memberCount: number;
}

export interface Channel {
    id: string;
    name: string;
    type: 'text' | 'voice' | 'category';
}

export interface PermissionLevels {
    ADMIN: number;
    MODERATOR: number;
    USER: number;
}

export const PermissionLevels: PermissionLevels = {
    ADMIN: 3,
    MODERATOR: 2,
    USER: 1,
};