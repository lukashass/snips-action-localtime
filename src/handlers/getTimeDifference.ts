import {
    location,
    time,
    timeInfo,
} from '../utils'
import { i18nFactory } from '../factories'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    let diffData: timeInfo,
        params: timeInfo,
        key: string,
        roundKey: string,
        hourKey: string
    
    flow.end()
    /*
    const {
        baseCountrySlot, baseRegionSlot, baseCitySlot, targetCountrySlot, targetRegionSlot, targetCitySlot
    } = await commonHandler(msg)
    
    if((!baseCountrySlot && !baseRegionSlot && !baseCitySlot) || ((!targetCountrySlot && !targetRegionSlot && !targetCitySlot))) {
        throw new Error('intentNotRecognized')
    }

    const {
        value: basePlace,
        timezone: baseTimeZone
    } = location.extractGeoNameIdAndPlace(baseCountrySlot, baseRegionSlot, baseCitySlot)
    const {
        value: targetPlace,
        timezone: targetTimeZone
    } = location.extractGeoNameIdAndPlace(targetCountrySlot, targetRegionSlot, targetCitySlot)
    
    if (basePlace === targetPlace)
        throw new Error('samePlaces')
    
    diffData = time.getUtcOffsetDiff(baseTimeZone, targetTimeZone)
    params = {
        basePlace,
        targetPlace,
        diffHour: diffData.hour
    } 
    roundKey = diffData.minute === '30' ? 'halves' : 'round'
    hourKey = diffData.hour === '' ? 'zeroHour' : diffData.hour === '1' ? 'oneHour' : 'severalHours'
    key = `localTime.getTimeDifference.${roundKey}.${hourKey}`
    */
    return i18nFactory.get()(key, params)
}