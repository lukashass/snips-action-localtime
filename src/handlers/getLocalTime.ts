import { location, time, logger, slot, translation, MappingEntry } from '../utils'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    logger.info('GetLocalTime')
    
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
    const timeInfo = time.getTimeFromPlace(timeZone)

    flow.end()
    return translation.randomTranslation('localTime.getLocalTime', {
        target_location: entry.value,
        target_hour: timeInfo.hour,
        target_minute: timeInfo.minute,
        target_period: timeInfo.period,
    })
}
