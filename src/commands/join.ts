import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { attBot } from '../att-client'
import { attConfig } from '../config'

export async function getUserIdFromUsername(username: string) {
    console.log(`looking userid for ${username}`)
    const response = await attBot.api.request(
        'POST',
        '/users/search/username',
        {},
        {},
        {
            username,
        }
    )
    const result = await response.json()
    return result.id ? Number(result.id) : null
}

export async function invitePlayerToGroup(groupId: number, userId: number) {
    const response = await attBot.api.request(
        'POST',
        '/groups/{groupId}/invites/{userId}',
        { groupId, userId }
    )
    return await response.json()
}

export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('Receive an invite to the ATT Server')
    .addStringOption((option) =>
        option
            .setName('username')
            .setDescription('ATT username')
            .setRequired(true)
    )

export async function execute(interaction: CommandInteraction) {
    const usernameOption = interaction.options.get('username')
    const username = String(usernameOption?.value)
    if (!username) {
        return interaction.reply('Please provide a username!')
    }
    try {
        const userId = await getUserIdFromUsername(username)
        if (!userId) {
            return interaction.reply(`No user found: ${userId}!`)
        }
        const groupId = attConfig.groupId
        await invitePlayerToGroup(groupId, userId)
        return interaction.reply(`Sent an invite to ${username} (${userId})!`)
    } catch (err) {
        console.error(err)
        return interaction.reply(`No user found: ${username}!`)
    }
}
