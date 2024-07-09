import {
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
    ChannelType,
    Embed,
    Guild,
    RoleCreateOptions,
    GuildChannelCreateOptions,
    OverwriteResolvable,
    GuildMember,
} from 'discord.js'
import { discordConfig } from '../config'

const getField = (embed: Embed, fieldName: string) => {
    return embed.fields.find((field) => field.name === fieldName)?.value
}

const createRole = async (guild: Guild, opts: RoleCreateOptions) => {
    const roles = guild.roles.cache
    const existingRole = roles.find((role) => role.name === opts.name)
    if (existingRole) return existingRole
    return guild.roles.create(opts)
}

const createChannel = async (guild: Guild, opts: GuildChannelCreateOptions) => {
    const channels = guild.channels.cache
    // console.log('channels', JSON.stringify(channels, null, 2))
    const existingChannel = channels.find(
        (channel) => channel.name === opts.name
    )
    // console.log('opts.name', JSON.stringify(opts.name, null, 2))
    // console.log('existingChannel', existingChannel)

    if (existingChannel) return existingChannel
    return guild.channels.create(opts)
}

const hasAllowedRole = (member: GuildMember | undefined) => {
    if (!member) return false
    const { allowedAdminRoles } = discordConfig
    for (const role of allowedAdminRoles) {
        if (member.roles.cache.has(role)) return true
    }
    return false
}

export const processCreateOrg = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => {
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()

    const guild = reaction.message.guild
    if (!guild) return
    const member = guild.members.cache.get(user.id)

    if (user.bot) return

    const embed = reaction.message.embeds[0]
    if (!embed || embed.title !== 'Organisation Creation Request') return

    if (!member || !hasAllowedRole(member)) {
        await reaction.message.channel.send(
            `${user.tag} does not have permission to approve this request`
        )
        return
    }

    const orgName = getField(embed, 'Org Name')
    const orgDescription = getField(embed, 'Org Description')
    const channelName = getField(embed, 'Channel Name')
    const leader = getField(embed, 'Leader')
    const leaderRoleName = getField(embed, 'Leader Role Name')
    const employeeRoleName = getField(embed, 'Employee Role Name')

    if (!channelName || !leaderRoleName || !orgName || !orgDescription) return

    if (reaction.emoji.name === '✅') {
        try {
            // Create the roles
            const leaderRole = await createRole(guild, {
                name: leaderRoleName,
                mentionable: true,
                permissions: [],
            })

            const employeeRole = await createRole(guild, {
                name: employeeRoleName,
                mentionable: true,
                permissions: [],
            })

            // Create the channel
            const permissionOverwrites = [
                {
                    id: guild.id, // @everyone role
                    allow: ['ViewChannel', 'SendMessages'],
                },
                {
                    id: leaderRole.id,
                    allow: [
                        'ViewChannel',
                        'SendMessages',
                        'SendMessagesInThreads',
                        'ReadMessageHistory',
                        'KickMembers',
                        'MuteMembers',
                        'ModerateMembers',
                        'AttachFiles',
                        'ManageMessages',
                        'ManageThreads',

                        'ManageChannels',
                        'ManageEvents',
                        'ManageRoles',
                    ],
                },
                {
                    id: employeeRole.id,
                    allow: [
                        'ViewChannel',
                        'SendMessages',
                        'SendMessagesInThreads',
                        'ReadMessageHistory',
                        'KickMembers',
                        'MuteMembers',
                        'ModerateMembers',
                        'AttachFiles',
                        'ManageMessages',
                        'ManageThreads',
                    ],
                },
            ] as OverwriteResolvable[]
            const category = await createChannel(guild, {
                name: orgName,
                type: ChannelType.GuildCategory,
                permissionOverwrites,
            })
            const channel = await createChannel(guild, {
                name: channelName,
                type: ChannelType.GuildText,
                topic: orgDescription,
                parent: category.id,
                permissionOverwrites,
            })
            const tradeChannel = await createChannel(guild, {
                name: 'trade',
                type: ChannelType.GuildText,
                topic: orgDescription,
                parent: category.id,
                permissionOverwrites,
            })

            // Assign the leader role
            if (leader) {
                const leaderMember = guild.members.cache.find(
                    (m) => m.user.tag === leader
                )
                // console.log(
                //     'assign-leader',
                //     JSON.stringify({ leader, leaderMember }, null, 2)
                // )
                if (leaderMember) {
                    await leaderMember.roles.add(leaderRole)
                }
            }

            await reaction.message.channel.send(
                `Organisation ${channel.name} created`
            )
        } catch (error) {
            console.error(error)
            await reaction.message.channel.send(
                'An error occurred while creating the organisation or roles.'
            )
        }
    } else if (reaction.emoji.name === '❌') {
        await reaction.message.channel.send(
            'Organisation creation request denied.'
        )
    }
}
