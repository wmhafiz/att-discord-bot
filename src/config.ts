import dotenv from 'dotenv'
dotenv.config()

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error('Missing discord environment variables')
}

export const discordConfig = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
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
