import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    User,
    EmbedBuilder,
} from 'discord.js'
import { discordConfig } from '../config'

export const data = new SlashCommandBuilder()
    .setName('org')
    .setDescription('Manage Organization')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('create')
            .setDescription('Submit a new create organization request')
            .addStringOption((option) =>
                option
                    .setName('name')
                    .setDescription('Organization Name')
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('description')
                    .setDescription('Organization Description')
                    .setRequired(true)
            )
            .addUserOption((option) =>
                option
                    .setName('leader')
                    .setDescription(
                        'Who shall be the leader of this organisation'
                    )
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('edit')
            .setDescription('Submit a new edit organization name request')
            .addStringOption((option) =>
                option
                    .setName('name1')
                    .setDescription('Old Organization Name')
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('name2')
                    .setDescription('New Organization Description')
                    .setRequired(true)
            )
    )

interface CreateChannelOpts {
    name: string | null
    description: string | null
    leader: User | null
}

const createChannel = async (
    interaction: ChatInputCommandInteraction,
    { name, description, leader }: CreateChannelOpts
) => {
    const guild = interaction.guild
    if (!guild) {
        await interaction.reply('This command can only be used in a server.')
        return
    }

    if (!name || !description || !leader) {
        await interaction.reply('Invalid input')
        return
    }

    // Define the role names internally
    const channelName = name.toLowerCase().replace(' ', '-').replace("'", '')
    const leaderRoleName = `${channelName}-leader`
    const employeeRoleName = `${channelName}-employees`

    // Send request to the same channel
    const embed = new EmbedBuilder()
        .setTitle('Organisation Creation Request')
        .setDescription(
            `User ${interaction.user.tag} requested to create an organisation.`
        )
        .addFields([
            {
                name: 'Org Name',
                value: name,
                inline: true,
            },
            {
                name: 'Org Description',
                value: description,
                inline: true,
            },
            {
                name: 'Channel Name',
                value: channelName,
                inline: true,
            },
            {
                name: 'Leader',
                value: leader.tag,
                inline: true,
            },
            {
                name: 'Leader Role Name',
                value: leaderRoleName,
                inline: true,
            },
            {
                name: 'Employee Role Name',
                value: employeeRoleName,
                inline: true,
            },
        ])
        .setColor('Blue')

    const message = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
    })
    await message.react('✅') // Approve reaction
    await message.react('❌') // Deny reaction
}

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isCommand()) return

    const channelId = interaction.channelId
    const allowedChannels = discordConfig.DISCORD_ALLOWED_CHANNELS.split(',')
    if (!allowedChannels.includes(channelId)) {
        await interaction.reply({
            content: 'This command cannot be used in this channel.',
            ephemeral: true,
        })
        return
    }

    if (interaction.commandName === 'org') {
        if (interaction.options.getSubcommand() === 'create') {
            const name = interaction.options.getString('name')
            const description = interaction.options.getString('description')
            const leader = interaction.options.getUser('leader')
            const employee = interaction.options.getUser('employee')
            // console.log(
            //     'options',
            //     JSON.stringify(
            //         { name, description, leader, employee, channelId },
            //         null,
            //         2
            //     )
            // )
            return createChannel(interaction, {
                name,
                description,
                leader,
            })
        }
    }

    return interaction.reply('Invalid input')
}
