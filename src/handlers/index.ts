import { handler, ConfidenceThresholds } from 'snips-toolkit'
import { getTimeDifferenceHandler } from './getTimeDifference'
import { getLocalTimeHandler } from './getLocalTime'
import { getTimeZoneHandler } from './getTimeZone'
import { convertTimeHandler } from './convertTime'
import { getDateHandler } from './getDate'
import { INTENT_PROBABILITY_THRESHOLD, ASR_UTTERANCE_CONFIDENCE_THRESHOLD } from '../constants'

const thresholds: ConfidenceThresholds = {
    intent: INTENT_PROBABILITY_THRESHOLD,
    asr: ASR_UTTERANCE_CONFIDENCE_THRESHOLD
}

// Add handlers here, and wrap them.
export default {
    getLocalTime: handler.wrap(getLocalTimeHandler, thresholds),
    getTimeZone: handler.wrap(getTimeZoneHandler, thresholds),
    getTimeDifference: handler.wrap(getTimeDifferenceHandler, thresholds),
    convertTime: handler.wrap(convertTimeHandler, thresholds),
    getDate: handler.wrap(getDateHandler, thresholds)
}
