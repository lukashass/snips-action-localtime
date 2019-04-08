import { location, time, logger, slot, MappingEntry } from '../utils'
import { i18nFactory, mappingsFactory } from '../factories'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const i18n = i18nFactory.get()
    const mappings = mappingsFactory.get()

    logger.info('GetTimeDifference')

    const {
        baseLocations,
        targetLocations
    } = await commonHandler(msg)
    
    //TODO: handle default location
    if (slot.missing(baseLocations) && slot.missing(targetLocations)) {
        throw new Error('intentNotRecognized')
    }

    let baseEntry: MappingEntry, targetEntry: MappingEntry

    //TODO: to be rewritten
    // At the moment, entry is overwritten
    for (let loc of baseLocations) {
        const cityEntry = location.getMostPopulated(loc, mappings.city)
        const regionEntry = location.getMostPopulated(loc, mappings.region)
        const countryEntry = location.getMostPopulated(loc, mappings.country)

        baseEntry = (cityEntry) ? cityEntry : ((regionEntry) ? regionEntry : ((countryEntry) ? countryEntry : null))
    }

    //TODO: to be rewritten
    // At the moment, entry is overwritten
    for (let loc of targetLocations) {
        const cityEntry = location.getMostPopulated(loc, mappings.city)
        const regionEntry = location.getMostPopulated(loc, mappings.region)
        const countryEntry = location.getMostPopulated(loc, mappings.country)

        targetEntry = (cityEntry) ? cityEntry : ((regionEntry) ? regionEntry : ((countryEntry) ? countryEntry : null))
    }
    
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
