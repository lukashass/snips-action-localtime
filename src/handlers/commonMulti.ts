import { message } from '../utils'
import { IntentMessage, NluSlot, slotType } from 'hermes-javascript'
import {
    INTENT_PROBABILITY_THRESHOLD,
    ASR_UTTERANCE_CONFIDENCE_THRESHOLD,
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'

/* Common logic performed for various intents */
export default async function (msg: IntentMessage) {
    if (msg.intent) {
        if (msg.intent.confidenceScore < INTENT_PROBABILITY_THRESHOLD) {
            throw new Error('intentNotRecognized')
        }
        if (message.getAsrConfidence(msg) < ASR_UTTERANCE_CONFIDENCE_THRESHOLD) {
            throw new Error('intentNotRecognized')
        }
    }
    
    /* Extract slots */
    const slots: { [key: string]: NluSlot<slotType.custom>[] } = {
        baseCountrySlot: message.getSlotsByName<slotType.custom>(msg, 'country_base', { onlyMostConfident: false, threshold: SLOT_CONFIDENCE_THRESHOLD }),
        baseRegionSlot: message.getSlotsByName<slotType.custom>(msg, 'region_base', { onlyMostConfident: false, threshold: SLOT_CONFIDENCE_THRESHOLD }),
        baseCitySlot: message.getSlotsByName<slotType.custom>(msg, 'city_base', { onlyMostConfident: false, threshold: SLOT_CONFIDENCE_THRESHOLD }),
        targetCountrySlot: message.getSlotsByName<slotType.custom>(msg, 'country_target', { onlyMostConfident: false, threshold: SLOT_CONFIDENCE_THRESHOLD }),
        targetRegionSlot: message.getSlotsByName<slotType.custom>(msg, 'region_target', { onlyMostConfident: false, threshold: SLOT_CONFIDENCE_THRESHOLD }),
        targetCitySlot: message.getSlotsByName<slotType.custom>(msg, 'city_target', { onlyMostConfident: false, threshold: SLOT_CONFIDENCE_THRESHOLD })
    }
    // if a geographic level has 2 bases or 2 targets, shares them among base and target
    let rearrangedSlots: { 
        [key: string]: NluSlot<slotType.custom> | null,
    } = {}
    for (let slot in slots) {
        if (slots[slot].length > 1) {
            let corresponding: string = slot.startsWith('base') ? slot.replace('base', 'target') : slot.replace('target', 'base')
            rearrangedSlots[corresponding] = slots[slot][1]
            rearrangedSlots[slot] = slots[slot][0]
        } else if (Array.isArray(slots[slot])) {
            rearrangedSlots[slot] = slots[slot][0]
        }
    }
    rearrangedSlots.timeSlot = message.getSlotsByName<slotType.custom, true>(msg, 'time', { onlyMostConfident: true, threshold: SLOT_CONFIDENCE_THRESHOLD })
    return rearrangedSlots
}