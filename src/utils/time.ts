import Moment from 'moment-timezone'

export const time = {
    getConvertedTime(timeValue: string, baseTimeZone: string, targetTimeZone: string): Date {
        // deleting the timezone info from the string
        const dateTime: string = timeValue.slice(0, -7)
        const rawTime: Moment.Moment = Moment.tz(dateTime, baseTimeZone)
        const converted: Moment.Moment = Moment.tz(rawTime, targetTimeZone)

       return converted.toDate()
    },
    
    getTimeFromPlace(timeZone: string): Date {
        return new Date(Moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss'))
    },

    getUtcOffset(timezone: string) {
        const offset: number = Moment.tz(timezone).utcOffset() / 60
        const prefix: string = offset > 0 ? '+' : ''

        return {
            hour: offset !== 0 ? prefix + Math.round(offset) : '',
            minute: offset % 1 ? '30' : ''
        }
    },

    getUtcOffsetDiff(baseTimeZone: string, targetTimeZone: string) {
        let baseOffset: number = Moment.tz(baseTimeZone).utcOffset() / 60
        let targetOffset: number = Moment.tz(targetTimeZone).utcOffset() / 60
        let offset: number = Math.abs(baseOffset - targetOffset)

        return {
            hour: offset !== 0 ? Math.round(offset) + '' : '',
            minute: offset % 1 ? '30' : ''
        }
    }
}
