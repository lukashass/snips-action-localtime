import {
    location,
    time,
    timeInfo,
} from '../utils'
import { i18nFactory } from '../factories'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    let offsetInfo: timeInfo,
        params: timeInfo,
        key: string

    const { countrySlot, regionSlot, citySlot } = await commonHandler(msg)
    flow.end()

    if(!countrySlot && !regionSlot && !citySlot)
        throw new Error('intentNotRecognized')

    /* Extract target geonameid and name */
    const { value: place, timezone: timeZone } = location.extractGeoNameIdAndPlace(countrySlot, regionSlot, citySlot)

    offsetInfo = time.getUtcOffset(timeZone)
    params = {
        targetPlace: place,
        offsetHour: offsetInfo.hour,
        offsetMinute: offsetInfo.minute
    }
    key = 'localTime.getTimeZone'
    
    const i18n = i18nFactory.get()
    
    return i18n(key, params)
}