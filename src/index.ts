import { Hermes, Done } from 'hermes-javascript'
import { config, i18n, logger } from 'snips-toolkit'
import { mappings } from './utils'
import handlers from './handlers'

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
        await i18n.init(config.get().locale)
        mappings.init(config.get().locale)

        const dialog = hermes.dialog()

        // Subscribe to the app intents
        dialog.flows([
            {
                intent: 'snips-assistant:GetLocalTime',
                action : handlers.getLocalTime
            },
            {
                intent: 'snips-assistant:CheckTime',
                action: handlers.getLocalTime
            },
            {
                intent: 'snips-assistant:ConvertTime',
                action : handlers.convertTime
            },
            {
                intent: 'snips-assistant:GetTimezone',
                action : handlers.getTimeZone
            },
            {
                intent: 'snips-assistant:GetTimeDifference',
                action : handlers.getTimeDifference
            },
            {
                intent: 'snips-assistant:GetDate',
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
