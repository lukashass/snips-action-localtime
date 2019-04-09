import { location, time, logger, slot, translation, MappingEntry } from '../utils'
import { Handler } from './index'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export const getLocalTimeHandler: Handler = async function (msg: IntentMessage, flow: FlowContinuation) {
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
    return translation.localTimeToSpeech(entry, timeInfo)
}
