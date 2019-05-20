import { location, time, slot, translation, MappingEntry } from '../utils'
import { logger, Handler } from 'snips-toolkit'
import { IntentMessage, FlowContinuation } from 'hermes-javascript/types'
import { getCurrentLocation } from './utils'

export const getDateHandler: Handler = async function (msg: IntentMessage, flow: FlowContinuation) {
    logger.info('Getdate')
    console.log('GetDate')

    //const wherearewe = getCurrentLocation()
    var wherearewe = []
    wherearewe.push(getCurrentLocation())

    const entries: MappingEntry[] = location.getMostRelevantEntries(wherearewe)
    if (!entries || entries.length === 0) {
        throw new Error('place')
    }
    const entry = entries[0]

    const dateInfo = time.getDateFromPlace(entry.timezone)
    flow.end()
    return translation.localDateToSpeech(dateInfo)
}
