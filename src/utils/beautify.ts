import { config, i18n } from 'snips-toolkit'
import moment from 'moment'
import 'moment/locale/fr'

export const beautify = {
    date: (date: Date): string => {
        return moment(date).locale(config.get().locale).format(i18n.translate('moment.date'))
    },

    time: (date: Date, cancelTimezoneOffset: boolean = false): string => {
        if (cancelTimezoneOffset) {
            return moment.utc(date)
                .locale(config.get().locale)
                .format(i18n.translate('moment.time'))
                .replace(' 0', '')
        }

        return moment(date)
            .locale(config.get().locale)
            .format(i18n.translate('moment.time'))
            .replace(' 0', '')
    }
}
