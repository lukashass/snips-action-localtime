import { location, time, logger, slot, translation, MappingEntry } from '../utils'
import { mappingsFactory } from '../factories'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const mappings = mappingsFactory.get()

    logger.info('GetLocalTime')
    
    const locations = await commonHandler(msg)

    //TODO: handle default location
    if (slot.missing(locations)) {
        throw new Error('intentNotRecognized')
    }

    let entry: MappingEntry

    //TODO: to be rewritten
    // At the moment, entry is overwritten
    for (let loc of locations) {
        const cityEntry = location.getMostPopulated(loc, mappings.city)
        const regionEntry = location.getMostPopulated(loc, mappings.region)
        const countryEntry = location.getMostPopulated(loc, mappings.country)

        entry = (cityEntry) ? cityEntry : ((regionEntry) ? regionEntry : ((countryEntry) ? countryEntry : null))
    }

    if (!entry)
        throw new Error('place')

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
