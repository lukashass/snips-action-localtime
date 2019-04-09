import { location, time, logger, slot, MappingEntry, translation } from '../utils'
import { Handler } from './index'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export const getTimeDifferenceHandler: Handler = async function (msg: IntentMessage, flow: FlowContinuation) {
    logger.info('GetTimeDifference')

    const {
        baseLocations,
        targetLocations
    } = await commonHandler(msg)
    
    if (slot.missing(baseLocations) || slot.missing(targetLocations)) {
        throw new Error('intentNotRecognized')
    }

    const baseEntries: MappingEntry[] = location.getMostRelevantEntries(baseLocations)
    if (!baseEntries || baseEntries.length === 0) {
        throw new Error('place')
    }
    const baseEntry = location.reduceToRelevantEntry(baseEntries)

    const targetEntries: MappingEntry[] = location.getMostRelevantEntries(targetLocations)
    if (!targetEntries || targetEntries.length === 0) {
        throw new Error('place')
    }
    const targetEntry = location.reduceToRelevantEntry(targetEntries)
    
    if (baseEntry.value === targetEntry.value)
        throw new Error('samePlaces')
    
    const diffData = time.getUtcOffsetDiff(baseEntry.timezone, targetEntry.timezone)

    flow.end()
    return translation.timeDifferenceToSpeech(baseEntry, targetEntry, diffData)
}
