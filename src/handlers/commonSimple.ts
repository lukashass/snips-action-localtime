import { message } from '../utils'
import { IntentMessage, NluSlot, slotType } from 'hermes-javascript'
import { INTENT_PROBABILITY_THRESHOLD, GEOMETRIC_MEAN_THRESHOLD, SLOT_CONFIDENCE_THRESHOLD } from '../constants'

/* Common logic performed for various intents */
export default async function (msg: IntentMessage) {

    if (msg.intent.confidenceScore < INTENT_PROBABILITY_THRESHOLD || message.getAsrConfidence(msg) < GEOMETRIC_MEAN_THRESHOLD) {
        throw new Error('intentNotRecognized')
    }

    /* Extract slots */
    const countrySlot: NluSlot<slotType.custom> | null = message.getSlotsByName<slotType.custom, true>(msg, 'country', { onlyMostConfident: true, threshold: SLOT_CONFIDENCE_THRESHOLD })
    const regionSlot: NluSlot<slotType.custom> | null = message.getSlotsByName<slotType.custom, true>(msg, 'region', { onlyMostConfident: true, threshold: SLOT_CONFIDENCE_THRESHOLD })
    const citySlot: NluSlot<slotType.custom> | null = message.getSlotsByName<slotType.custom, true>(msg, 'city', { onlyMostConfident: true, threshold: SLOT_CONFIDENCE_THRESHOLD })

    return {
        countrySlot, regionSlot, citySlot
    }
}