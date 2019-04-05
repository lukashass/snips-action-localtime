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

    let locations: string[]

    const locationsSlot: NluSlot<slotType.custom>[] = message.getSlotsByName(msg, 'location', {
        threshold: SLOT_CONFIDENCE_THRESHOLD
    })

    if (locationsSlot) {
        locations = locationsSlot.map(x => x.value.value)
    }

    logger.info('\tlocations: ', locations)

    return locations
}
