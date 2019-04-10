import { location, time, logger, slot, MappingEntry, translation } from '../utils'
import { Handler } from './index'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'
import { getCurrentLocation } from './utils'

export const getTimeZoneHandler: Handler = async function (msg: IntentMessage, flow: FlowContinuation) {
    logger.info('GetTimeZone')

    const locations = await commonHandler(msg)

    if (slot.missing(locations)) {
        locations.push(getCurrentLocation())
    }

    const entries: MappingEntry[] = location.getMostRelevantEntries(locations)
    if (!entries || entries.length === 0) {
        throw new Error('place')
    }
    const entry = entries[0]

    const offsetInfo = time.getUtcOffset(entry.timezone)
    
    flow.end()
    return translation.timeZoneToSpeech(entry, offsetInfo)
}
