import { i18nFactory } from '../factories/i18nFactory'
import { MappingEntry } from './location'
import { beautify } from './beautify'

export const translation = {
    // Outputs an error message based on the error object, or a default message if not found.
    errorMessage: async (error: Error): Promise<string> => {
        let i18n = i18nFactory.get()

        if (!i18n) {
            await i18nFactory.init()
            i18n = i18nFactory.get()
        }

        if (i18n) {
            return i18n([`error.${error.message}`, 'error.unspecific'])
        } else {
            return 'Oops, something went wrong.'
        }
    },
    
    // Takes an array from the i18n and returns a random item.
    randomTranslation(key: string | string[], opts: {[key: string]: any}): string {
        const i18n = i18nFactory.get()
        const possibleValues = i18n(key, { returnObjects: true, ...opts })

        if (typeof possibleValues === 'string') {
            return possibleValues
        }

        const randomIndex = Math.floor(Math.random() * possibleValues.length)
        console.log(possibleValues[randomIndex])
        
        return possibleValues[randomIndex]
    },

    localTimeToSpeech(entry: MappingEntry, time: Date): string {
        return translation.randomTranslation('localTime.getLocalTime', {
            location: entry.value,
            time: beautify.time(time)
        })
    },

    timeZoneToSpeech(entry: MappingEntry, offsetInfo): string {
        const i18n = i18nFactory.get()

        return i18n('localTime.getTimeZone', {
            target_location: entry.value,
            offset_hour: offsetInfo.hour,
            offset_minute: offsetInfo.minute
        })
    },

    convertTimeToSpeech(baseEntry: MappingEntry, targetEntry: MappingEntry, baseTime: Date, targetTime: Date): string {
        return translation.randomTranslation('localTime.convertTime.timeProvided', {
            base_location: baseEntry.value,
            base_time: beautify.time(baseTime, true),
            target_location: targetEntry.value,
            target_time: beautify.time(targetTime, true),
        })
    },

    timeDifferenceToSpeech(baseEntry: MappingEntry, targetEntry: MappingEntry, diffData): string {
        const i18n = i18nFactory.get()

        const roundKey = diffData.minute === '30' ? 'halves' : 'round'
        const hourKey = (diffData.hour === '') ? 'zeroHour' : ((diffData.hour === '1') ? 'oneHour' : 'severalHours')

        return i18n(`localTime.getTimeDifference.${roundKey}.${hourKey}`, {
            base_location: baseEntry.value,
            target_location: targetEntry.value,
            diff_hour: diffData.hour
        })
    }
}
