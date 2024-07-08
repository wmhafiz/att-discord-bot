import { Client } from 'discord.js'
import { deployCommands } from './deploy-commands'
import { discordConfig } from './config'
import { commands } from './commands'
import { attBot } from './att-client'

const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
})

client.once('ready', async () => {
    console.log('starting bot..')
    await attBot.start()
    console.log('Discord bot is ready! 🤖')
})

client.on('guildCreate', async (guild) => {
    await deployCommands({ guildId: guild.id })
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }
    const { commandName } = interaction
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction)
    }
})

client.login(discordConfig.DISCORD_TOKEN)
