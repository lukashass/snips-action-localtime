import { location, time, logger, slot, translation, message, MappingEntry } from '../utils'
import { Handler } from './index'
import { i18nFactory } from '../factories'
import commonHandler from './commonMulti'
import { IntentMessage, FlowContinuation, NluSlot, slotType } from 'hermes-javascript'
import {
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'
import { getTimeDifferenceHandler } from './getTimeDifference'

export const convertTimeHandler: Handler = async function (msg: IntentMessage, flow: FlowContinuation) {
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
        throw new Error('noTime')
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
    
    const timeInfo = time.getConvertedTime(timeValue, baseEntry.timezone, targetEntry.timezone)
    
    flow.end()
    return translation.convertTimeToSpeech(baseEntry, targetEntry, timeInfo)
}
