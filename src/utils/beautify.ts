import { configFactory, i18nFactory } from '../factories'
import { LANGUAGE_MAPPINGS } from '../constants'
import moment from 'moment'
import 'moment/locale/fr'

export const beautify = {
    date: (date: Date): string => {
        const i18n = i18nFactory.get()
        const config = configFactory.get()
        const language = LANGUAGE_MAPPINGS[config.locale]

        return moment(date).locale(language).format(i18n('moment.date'))
    },

    time: (date: Date, cancelTimezoneOffset: boolean = false): string => {
        const i18n = i18nFactory.get()
        const config = configFactory.get()
        const language = LANGUAGE_MAPPINGS[config.locale]

        if (cancelTimezoneOffset) {
            return moment.utc(date)
                .locale(language)
                .format(i18n('moment.time'))
                .replace(' 0', '')
        }

        return moment(date)
            .locale(language)
            .format(i18n('moment.time'))
            .replace(' 0', '')
    }
}