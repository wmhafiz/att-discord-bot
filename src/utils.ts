export const getChannelName = (name: string) =>
    name.toLowerCase().replace(' ', '-').replace("'", '')

export const getLeaderRoleName = (channelName: string) =>
    `${channelName}-leader`

export const getEmployeeRoleName = (channelName: string) =>
    `${channelName}-employees`
