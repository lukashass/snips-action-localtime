import { location, time, logger, slot, translation, MappingEntry } from '../utils'
import { Handler } from './index'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'
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