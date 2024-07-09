import { REST, Routes } from 'discord.js'
import { discordConfig } from './config'
import { commands } from './commands'

const commandsData = Object.values(commands).map((command) => command.data)

const rest = new REST({ version: '10' }).setToken(discordConfig.DISCORD_TOKEN)

type DeployCommandsProps = {
    guildId: string
}

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        console.log('Started refreshing application (/) commands.', { guildId })

        await rest.put(
            Routes.applicationGuildCommands(
                discordConfig.DISCORD_CLIENT_ID,
                guildId
            ),
            {
                body: commandsData,
            }
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}
