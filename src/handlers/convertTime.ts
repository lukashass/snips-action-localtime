import { location, time, logger, slot, translation, message, MappingEntry } from '../utils'
import { i18nFactory } from '../factories'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation, NluSlot, slotType } from 'hermes-javascript'
import {
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const i18n = i18nFactory.get()

    logger.info('ConvertTime')

    const {
        baseLocations,
        targetLocations
    } = await commonHandler(msg)

    let timeValue: string

    // extracting time slot
    const timeSlot: NluSlot<slotType.custom> = message.getSlotsByName(msg, 'time', {
        onlyMostConfident: true,
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    if (timeSlot) {
        timeValue = timeSlot.value.value
    }

    //TODO: handle default location
    if (slot.missing(baseLocations) || slot.missing(targetLocations)) {
        throw new Error('intentNotRecognized')
    }

    if (slot.missing(timeValue)) {
        return i18n('localTime.convertTime.noTime') + await require('../handlers').getTimeDifference(msg, flow)
    }

    const baseEntries: MappingEntry[] = location.getMostRelevantEntries(baseLocations)
    const baseEntry = location.reduceToRelevantEntry(baseEntries)

    const targetEntries: MappingEntry[] = location.getMostRelevantEntries(targetLocations)
    const targetEntry = location.reduceToRelevantEntry(targetEntries)
    
    if (!baseEntry || !targetEntry)
        throw new Error('place')

    if (baseEntry.value === targetEntry.value)
        throw new Error('samePlaces')
    
    const timeInfo = time.getConvertedTime(timeValue, baseEntry.timezone, targetEntry.timezone)
    
    flow.end()
    return translation.randomTranslation('localTime.convertTime.timeProvided', {
        base_location: baseEntry.value,
        base_hour: timeInfo.baseHour,
        base_minute: timeInfo.baseMinute,
        base_period: timeInfo.basePeriod,
        target_location: targetEntry.value,
        target_hour: timeInfo.targetHour,
        target_minute: timeInfo.targetMinute,
        target_period: timeInfo.targetPeriod
    })
}
