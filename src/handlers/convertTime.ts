import {
    location,
    time,
    translation,
    timeInfo
} from '../utils'
import { i18nFactory } from '../factories/'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const { getTimeDifference } = require('../handlers')
    let timeInfo: timeInfo,
        key: string,
        params: timeInfo,
        noTime: string
    
    const {
        timeSlot, baseCountrySlot, baseRegionSlot, baseCitySlot, targetCountrySlot, targetRegionSlot, targetCitySlot
    } = await commonHandler(msg)
    flow.end()
    
    /* Extract places names and timezones */
    const {
        value: basePlace,
        timezone: baseTimeZone
    } = location.extractGeoNameIdAndPlace(baseCountrySlot, baseRegionSlot, baseCitySlot)
    const {
        value: targetPlace,
        timezone: targetTimeZone
    } = location.extractGeoNameIdAndPlace(targetCountrySlot, targetRegionSlot, targetCitySlot)
    
    if (!basePlace && !targetPlace)
        throw new Error('location')
    else if (basePlace == targetPlace)
        throw new Error('samePlaces')
    
    try {
        timeInfo = time.getConvertedTime(timeSlot, baseTimeZone, targetTimeZone)
    } catch(e) {
        key = 'localTime.convertTime.noTime'
        noTime = i18nFactory.get()(key)
        return noTime + await getTimeDifference(msg, flow)
    }
    
    key = 'localTime.convertTime.timeProvided'
    params = {
        basePlace,
        baseHour: timeInfo.baseHour,
        baseMinute: timeInfo.baseMinute,
        basePeriod: timeInfo.basePeriod,
        targetPlace,
        targetHour: timeInfo.targetHour,
        targetMinute: timeInfo.targetMinute,
        targetPeriod: timeInfo.targetPeriod
    }
    return translation.randomTranslation(key, params)
}