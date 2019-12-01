import { i18n } from 'snips-toolkit'
import { MappingEntry } from './location'
import { beautify } from './beautify'

export const translation = {
    localTimeToSpeech(entry: MappingEntry, time: Date, useLocation: boolean): string {
        if (!useLocation) {
            return i18n.randomTranslation('localTime.getLocalTime', {
                location: entry.value,
                time: beautify.time(time)
            })
        } else {
            return i18n.randomTranslation('localTime.getLocalTimeNoLocation', {
                time: beautify.time(time)
            })
        }
    },

    localDateToSpeech(date: Date): string {
        console.log(beautify.date(date))
        return i18n.randomTranslation('localTime.getLocalDate', {
            date: beautify.date(date)
        })
    },

    timeZoneToSpeech(entry: MappingEntry, offsetInfo): string {
        return i18n.translate('localTime.getTimeZone', {
            target_location: entry.value,
            offset_hour: offsetInfo.hour,
            offset_minute: offsetInfo.minute
        })
    },

    convertTimeToSpeech(baseEntry: MappingEntry, targetEntry: MappingEntry, baseTime: Date, targetTime: Date): string {
        return i18n.randomTranslation('localTime.convertTime.timeProvided', {
            base_location: baseEntry.value,
            base_time: beautify.time(baseTime, true),
            target_location: targetEntry.value,
            target_time: beautify.time(targetTime, true),
        })
    },

    timeDifferenceToSpeech(baseEntry: MappingEntry, targetEntry: MappingEntry, diffData): string {
        const roundKey = diffData.minute === '30' ? 'halves' : 'round'
        const hourKey = (diffData.hour === '') ? 'zeroHour' : ((diffData.hour === '1') ? 'oneHour' : 'severalHours')

        return i18n.translate(`localTime.getTimeDifference.${roundKey}.${hourKey}`, {
            base_location: baseEntry.value,
            target_location: targetEntry.value,
            diff_hour: diffData.hour
        })
    }
}
