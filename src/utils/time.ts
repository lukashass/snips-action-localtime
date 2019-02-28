import Moment from 'moment-timezone'
import { NluSlot, slotType } from 'hermes-javascript'

export type timeInfo = {
    [key: string]: string
}

export const time = {
    getConvertedTime(timeSlot: NluSlot<slotType.custom> | null, baseTimeZone: string = '', targetTimeZone: string = ''): timeInfo {
        if (!timeSlot || typeof(timeSlot.value.value) !== 'string')
            throw new Error()
        let dateTime:string = timeSlot.value.value.slice(0, -7)
        let rawTime: Moment.Moment = Moment.tz(dateTime, baseTimeZone)
        let converted: Moment.Moment = Moment.tz(rawTime, targetTimeZone)

        return {
            baseHour: rawTime.format('h'),
            baseMinute: rawTime.minute() ? rawTime.format('m') : '',
            basePeriod: rawTime.format('a'),
            targetHour: converted.format('h'),
            targetMinute: converted.minute() ? converted.format('m') : '',
            targetPeriod: converted.format('a'),
        }
    },
    getTimeFromPlace(timeZone: string): timeInfo {
        const rawTime: Moment.Moment = Moment().tz(timeZone)

        return {
            hour: rawTime.format('h'),
            minute: rawTime.minute() ? rawTime.minute() + '' : '',
            period: rawTime.format('a')
        }
    },
    getUtcOffset(timezone: string): timeInfo {
        const offset: number = Moment.tz(timezone).utcOffset() / 60
        const prefix: string = offset > 0 ? '+' : ''

        return {
            hour: offset !== 0 ? prefix + Math.round(offset) : '',
            minute: offset % 1 ? '30' : ''
        }
    },
    getUtcOffsetDiff(baseTimeZone: string, targetTimeZone: string): timeInfo {
        let baseOffset: number = Moment.tz(baseTimeZone).utcOffset() / 60
        let targetOffset: number = Moment.tz(targetTimeZone).utcOffset() / 60
        let offset: number = Math.abs(baseOffset - targetOffset)

        return {
            hour: offset !== 0 ? Math.round(offset) + '' : '',
            minute: offset % 1 ? '30' : ''
        }
    }
}