import { withHermes } from 'hermes-javascript'
import bootstrap from './bootstrap'
import handlers from './handlers'
import { translation, logger } from './utils'

// Initialize hermes
export default function ({ hermesOptions = {}, bootstrapOptions = {} } = {}) : Promise<() => void> {
    return new Promise((resolve, reject) => {
        withHermes(async (hermes, done) => {
            try {
                await bootstrap(bootstrapOptions)
                
                const dialog = hermes.dialog()
                
                dialog.flows([
                    {
                        intent: 'snips-assistant:GetLocalTime_V2',
                        action : handlers.getLocalTime
                    },
                    {
                        intent: 'snips-assistant:CheckTime_V2',
                        action: handlers.getLocalTime
                    },
                    {
                        intent: 'snips-assistant:ConvertTime_V2',
                        action : handlers.convertTime
                    },
                    {
                        intent: 'snips-assistant:GetTimezone_V2',
                        action : handlers.getTimeZone
                    },
                    {
                        intent: 'snips-assistant:GetTimeDifference_V2',
                        action : handlers.getTimeDifference
                    }
                ])
                resolve(done)
            } catch (error) {
                console.log(error)
                
                // Output initialization errors to stderr and exit
                const message = await translation.errorMessage(error)
                
                logger.error(message)
                logger.error(error)
                // Exit
                done()
                // Reject
                reject(error)
            }
        }, hermesOptions)
    })
}