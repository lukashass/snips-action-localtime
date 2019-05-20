import { message, logger } from 'snips-toolkit'
import { IntentMessage, NluSlot, slotType } from 'hermes-javascript/types'
import {
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'

/* Common logic performed for various intents */
export default async function (msg: IntentMessage) {
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
