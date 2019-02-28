import {
    location,
    time,
    translation,
    timeInfo
} from '../utils'
import commonSimple from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    let timeInfo: timeInfo,
        key: string,
        params: timeInfo
    
    const { countrySlot, regionSlot, citySlot } = await commonSimple(msg)
    flow.end()

    /* Extract target geonameid and name */
    const { value: place, timezone: timeZone } = location.extractGeoNameIdAndPlace(countrySlot, regionSlot, citySlot)

    timeInfo = time.getTimeFromPlace(timeZone)
    params = {
        targetPlace: place,
        targetHour: timeInfo.hour,
        targetMinute: timeInfo.minute,
        targetPeriod: timeInfo.period,
    }
    key = 'localTime.getLocalTime'

    return translation.randomTranslation(key, params)
}