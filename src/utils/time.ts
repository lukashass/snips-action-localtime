import Moment from 'moment-timezone'

export const time = {
    getConvertedTime(timeValue: string, baseTimeZone: string, targetTimeZone: string) {
        let dateTime: string = timeValue.slice(0, -7)
        let rawTime: Moment.Moment = Moment.tz(dateTime, baseTimeZone)
        let converted: Moment.Moment = Moment.tz(rawTime, targetTimeZone)

        return {
            baseHour: rawTime.format('h'),
            baseMinute: rawTime.minute() ? rawTime.format('m') : '',
            basePeriod: rawTime.format('A'),
            targetHour: converted.format('h'),
            targetMinute: converted.minute() ? converted.format('m') : '',
            targetPeriod: converted.format('A'),
        }
    },
    
    getTimeFromPlace(timeZone: string) {
        const rawTime: Moment.Moment = Moment().tz(timeZone)

        return {
            hour: rawTime.format('h'),
            minute: rawTime.minute() ? rawTime.minute() + '' : '',
            period: rawTime.format('A')
        }
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