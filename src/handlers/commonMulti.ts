import { message, logger } from '../utils'
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

    let baseLocations: string[], targetLocations: string[]
    
    const baseLocationsSlot: NluSlot<slotType.custom>[] = message.getSlotsByName(msg, 'location_base', {
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    if (baseLocationsSlot) {
        baseLocations = baseLocationsSlot.map(x => x.value.value)
    }

    const targetLocationsSlot: NluSlot<slotType.custom>[] = message.getSlotsByName(msg, 'location_target', {
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    if (targetLocationsSlot) {
        targetLocations = targetLocationsSlot.map(x => x.value.value)
    }

    logger.info('\tbase_locations: ', baseLocations)
    logger.info('\ttarget_locations: ', targetLocations)

    return { baseLocations, targetLocations }
}