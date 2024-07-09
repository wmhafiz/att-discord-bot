import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ChannelType,
    CategoryChannel,
} from 'discord.js'
import { discordConfig } from '../config'
import {
    getChannelName,
    getEmployeeRoleName,
    getLeaderRoleName,
} from '../utils'

export const data = new SlashCommandBuilder()
    .setName('employee')
    .setDescription('Manage Organization')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('hire')
            .setDescription('Hire an employee to an organisation')
            .addChannelOption((option) =>
                option
                    .setName('organisation')
                    .setDescription('Select an organisation')
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true)
            )
            .addUserOption((option) =>
                option
                    .setName('employee')
                    .setDescription('The user to be hired')
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('fire')
            .setDescription('Fire an employee from an organisation')
            .addChannelOption((option) =>
                option
                    .setName('organisation')
                    .setDescription('Select an organisation')
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true)
            )
            .addUserOption((option) =>
                option
                    .setName('employee')
                    .setDescription('The user to be fired')
                    .setRequired(true)
            )
            .addStringOption((option) =>
                option
                    .setName('reason')
                    .setDescription('The reason the employee is getting fired')
            )
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isCommand()) return

    const user = interaction.user
    if (user.bot) return

    const member = interaction.guild?.members.cache.get(user.id)
    const channelId = interaction.channelId
    const allowedChannels = discordConfig.DISCORD_ALLOWED_CHANNELS.split(',')
    if (!allowedChannels.includes(channelId)) {
        await interaction.reply({
            content: 'This command cannot be used in this channel.',
            ephemeral: true,
        })
        return
    }

    if (interaction.commandName === 'employee') {
        const org = interaction.options.getChannel(
            'organisation'
        ) as CategoryChannel

        if (org?.name?.endsWith('Channels')) {
            return interaction.reply(
                `Error: ${org.name} is not an organisation!`
            )
        }
        const channelName = getChannelName(org.name)
        const leaderRoleName = getLeaderRoleName(channelName)
        const employeesRoleName = getEmployeeRoleName(channelName)

        if (!member?.roles.cache.find((role) => role.name === leaderRoleName)) {
            return interaction.reply(
                `Error: ${user.globalName ?? user.tag} is not ${
                    org.name
                } leader, and do not have permission to ${interaction.options.getSubcommand()} employees`
            )
        }

        const employee = interaction.options.getUser('employee')
        const employeeMember = interaction?.guild?.members.cache.find(
            (m) => m.user.tag === employee?.tag
        )
        const employeesRole = interaction.guild?.roles.cache.find(
            (role) => role.name === employeesRoleName
        )
        if (!employeesRole) return

        if (interaction.options.getSubcommand() === 'hire') {
            await employeeMember?.roles.add(employeesRole)
            return interaction.reply(
                `${employee?.globalName ?? employee?.tag} has been hired to ${
                    employeesRole.name
                }!`
            )
        }

        if (interaction.options.getSubcommand() === 'fire') {
            const reason = interaction.options.getString('reason')
            await employeeMember?.roles.remove(
                employeesRole,
                reason ? reason : undefined
            )
            return interaction.reply(
                `${employee?.globalName ?? employee?.tag} has been fired from ${
                    employeesRole.name
                }! ${reason ? reason : null}`
            )
        }
    }

    return interaction.reply('Invalid input')
}
