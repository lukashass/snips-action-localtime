import { handler } from 'snips-toolkit'
import { getTimeDifferenceHandler } from './getTimeDifference'
import { getLocalTimeHandler } from './getLocalTime'
import { getTimeZoneHandler } from './getTimeZone'
import { convertTimeHandler } from './convertTime'
import { getDateHandler } from './getDate'

// Add handlers here, and wrap them.
export default {
    getLocalTime: handler.wrap(getLocalTimeHandler),
    getTimeZone: handler.wrap(getTimeZoneHandler),
    getTimeDifference: handler.wrap(getTimeDifferenceHandler),
    convertTime: handler.wrap(convertTimeHandler),
    getDate: handler.wrap(getDateHandler)
}
