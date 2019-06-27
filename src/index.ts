import { Hermes, Done } from 'hermes-javascript'
import { config, i18n, logger } from 'snips-toolkit'
import { mappings } from './utils'
import handlers from './handlers'
import { beautify } from './utils/beautify'

// Enables deep printing of objects.
process.env.DEBUG_DEPTH = undefined

export default async function ({
    hermes,
    done
}: {
    hermes: Hermes,
    done: Done
}) {
    try {
        const { name } = require('../package.json')
        logger.init(name)
        // Replace 'error' with '*' to log everything
        logger.enable('error')

        config.init()
        beautify.init()
        await i18n.init(config.get().locale)
        mappings.init(config.get().locale)

        const dialog = hermes.dialog()

        // Subscribe to the app intents
        dialog.flows([
            {
                intent: `${ config.get().assistantPrefix }:GetLocalTime`,
                action : handlers.getLocalTime
            },
            {
                intent: `${ config.get().assistantPrefix }:CheckTime`,
                action: handlers.getLocalTime
            },
            {
                intent: `${ config.get().assistantPrefix }:ConvertTime`,
                action : handlers.convertTime
            },
            {
                intent: `${ config.get().assistantPrefix }:GetTimezone`,
                action : handlers.getTimeZone
            },
            {
                intent: `${ config.get().assistantPrefix }:GetTimeDifference`,
                action : handlers.getTimeDifference
            },
            {
                intent: `${ config.get().assistantPrefix }:GetDate`,
                action : handlers.getDate
            }
        ])
    } catch (error) {
        // Output initialization errors to stderr and exit
        const message = await i18n.errorMessage(error)
        logger.error(message)
        logger.error(error)
        // Exit
        done()
    }
}
