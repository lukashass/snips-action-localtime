import { location, time, logger, slot, MappingEntry } from '../utils'
import { i18nFactory } from '../factories'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const i18n = i18nFactory.get()

    logger.info('GetTimeZone')

    const locations = await commonHandler(msg)

    //TODO: handle default location
    if (slot.missing(locations)) {
        throw new Error('intentNotRecognized')
    }

    const entries: MappingEntry[] = location.getMostRelevantEntries(locations)
    if (!entries || entries.length === 0) {
        throw new Error('place')
    }
    const entry = entries[0]

    const timeZone = entry.timezone
    const offsetInfo = time.getUtcOffset(timeZone)
    
    flow.end()
    return i18n('localTime.getTimeZone', {
        target_location: entry.value,
        offset_hour: offsetInfo.hour,
        offset_minute: offsetInfo.minute
    })
}
