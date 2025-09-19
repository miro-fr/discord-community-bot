export const config = {
    token: process.env.TOKEN || 'YOUR_BOT_TOKEN',
    prefix: process.env.PREFIX || '!',
    ownerId: process.env.OWNER_ID || 'YOUR_DISCORD_USER_ID',
    defaultRole: process.env.USER_ROLE_ID || 'Member',
    adminRole: process.env.ADMIN_ROLE_ID || 'Admin',
    moderatorRole: process.env.MODERATOR_ROLE_ID || 'Moderator',
    databaseUrl: process.env.DATABASE_URL || '',
    clientId: process.env.CLIENT_ID || '',
};