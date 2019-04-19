import Moment from 'moment-timezone'

export type DatePair = {
    baseTime: Date,
    targetTime: Date
}

export const time = {
    getConvertedTime(timeValue: string, baseTimeZone: string, targetTimeZone: string): DatePair {
        // deleting the timezone info from the string
        const dateTime: string = timeValue.slice(0, -7)

        const baseTimeMoment = Moment.tz(dateTime, baseTimeZone)
        const targetTimeMoment = baseTimeMoment.clone().tz(targetTimeZone)

        const retDate1 = new Date(baseTimeMoment.format().slice(0, -6))
        const userTimezoneOffset1 = retDate1.getTimezoneOffset() * 60000
        const baseTime = new Date(retDate1.getTime() - userTimezoneOffset1)

        const retDate2 = new Date(targetTimeMoment.format().slice(0, -6))
        const userTimezoneOffset2 = retDate2.getTimezoneOffset() * 60000
        const targetTime = new Date(retDate2.getTime() - userTimezoneOffset2)
    
        return { baseTime, targetTime }
    },
    
    getTimeFromPlace(timeZone: string): Date {
        return new Date(Moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss'))
    },

    getDateFromPlace(timeZone: string): Date {
        return new Date(Moment().tz(timeZone).format('YYYY-MM-DD'))
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
