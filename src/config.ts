import dotenv from 'dotenv'
dotenv.config()

const {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_ALLOWED_CHANNELS,
    DISCORD_ADMIN_ROLE_ID,
} = process.env

if (
    !DISCORD_TOKEN ||
    !DISCORD_CLIENT_ID ||
    !DISCORD_GUILD_ID ||
    !DISCORD_ALLOWED_CHANNELS ||
    !DISCORD_ADMIN_ROLE_ID
) {
    throw new Error('Missing discord environment variables')
}

export const discordConfig = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_ALLOWED_CHANNELS,
    allowedAdminRoles: DISCORD_ADMIN_ROLE_ID.split(','),
}

const { ATT_USERNAME, ATT_PASSWORD, ATT_GROUP_ID, ATT_SERVER_ID } = process.env

if (!ATT_USERNAME || !ATT_PASSWORD || !ATT_GROUP_ID || !ATT_SERVER_ID) {
    throw new Error('Missing a township tale environment variables')
}

export const attConfig = {
    username: ATT_USERNAME,
    password: ATT_PASSWORD,
    groupId: Number(ATT_GROUP_ID),
    serverId: Number(ATT_SERVER_ID),
}
