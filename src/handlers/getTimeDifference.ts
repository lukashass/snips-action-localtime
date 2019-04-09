import { location, time, logger, slot, MappingEntry } from '../utils'
import { i18nFactory } from '../factories'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const i18n = i18nFactory.get()

    logger.info('GetTimeDifference')

    const {
        baseLocations,
        targetLocations
    } = await commonHandler(msg)
    
    //TODO: handle default location
    if (slot.missing(baseLocations) && slot.missing(targetLocations)) {
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

    const roundKey = diffData.minute === '30' ? 'halves' : 'round'
    const hourKey = (diffData.hour === '') ? 'zeroHour' : ((diffData.hour === '1') ? 'oneHour' : 'severalHours')

    flow.end()
    return i18n(`localTime.getTimeDifference.${roundKey}.${hourKey}`, {
        base_location: baseEntry.value,
        target_location: targetEntry.value,
        diff_hour: diffData.hour
    })
}
