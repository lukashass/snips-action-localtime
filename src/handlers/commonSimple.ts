import { message, logger } from 'snips-toolkit'
import { IntentMessage, NluSlot, slotType } from 'hermes-javascript/types'
import {
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'

/* Common logic performed for various intents */
export default async function (msg: IntentMessage) {
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
