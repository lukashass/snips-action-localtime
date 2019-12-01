import { location, time, slot, translation, MappingEntry } from '../utils'
import { Handler, logger } from 'snips-toolkit'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript/types'
import { getCurrentLocation } from './utils'

export const getLocalTimeHandler: Handler = async function (msg: IntentMessage, flow: FlowContinuation) {
    logger.info('GetLocalTime')
    
    const locations = await commonHandler(msg)
    let isCurrentLocation = false

    if (slot.missing(locations)) {
        locations.push(getCurrentLocation())
        isCurrentLocation = true
    }

    const entries: MappingEntry[] = location.getMostRelevantEntries(locations)
    if (!entries || entries.length === 0) {
        throw new Error('place')
    }
    const entry = entries[0]

    const timeInfo = time.getTimeFromPlace(entry.timezone)

    flow.end()
    return translation.localTimeToSpeech(entry, timeInfo, isCurrentLocation)
}
