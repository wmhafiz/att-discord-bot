import { Client } from 'att-client'
import { attConfig } from './config'

export const attBot = new Client({
    username: attConfig.username,
    password: attConfig.password,
    logVerbosity: 4,
    apiRequestAttempts: 0,
})
