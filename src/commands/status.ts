import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { attBot } from '../att-client'
import { attConfig } from '../config'

export const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check server status')

const getServerStatus = async () => {
    const serverInfo = await attBot.api.getServerInfo(attConfig.serverId)
    const onlinePlayers = serverInfo.online_players.map(
        (player) => player.username
    )
    return `Server is ${serverInfo.server_status}. #Players: ${
        onlinePlayers.length
    } (${onlinePlayers.join(', ')})`
}

export async function execute(interaction: CommandInteraction) {
    try {
        return interaction.reply(await getServerStatus())
    } catch (err) {
        console.error(err)
        return interaction.reply(`Error trying to get server status =(`)
    }
}
