import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

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
    console.log(JSON.stringify(interaction.options.data, null, 2))
    const usernameOption = interaction.options.data.find(
        (opt) => opt.name === 'username'
    )
    const username = usernameOption?.value
    if (!username) {
        return interaction.reply('Please provide a username!')
    }
    return interaction.reply(`Sent an invite to ${username}!`)
}
