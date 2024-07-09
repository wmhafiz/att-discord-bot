import {
    ChannelType,
    Client,
    CommandInteraction,
    GatewayIntentBits,
} from 'discord.js'
import { deployCommands } from './deploy-commands'
import { discordConfig } from './config'
import { commands } from './commands'
import { attBot } from './att-client'
import { processCreateOrg } from './reactions'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
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
    if (interaction.isChatInputCommand() || interaction.isCommand()) {
        const { commandName } = interaction
        if (commands[commandName as keyof typeof commands]) {
            commands[commandName as keyof typeof commands].execute(interaction)
        }
        return
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    await processCreateOrg(reaction, user)
})

client.login(discordConfig.DISCORD_TOKEN)
