import { discordConfig } from './config'
import { deployCommands } from './deploy-commands'

const run = async () => {
    await deployCommands({ guildId: discordConfig.DISCORD_GUILD_ID })
}

run()
