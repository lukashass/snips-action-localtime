import { config } from 'snips-toolkit'
import moment from 'moment'
import fs from 'fs'
import 'moment/locale/fr'
import { ASSETS_PATH } from '../constants'

export type DateFormats = {[key: string]: any}

let dateFormats: DateFormats = {}

export const beautify = {
    init: () => {
        dateFormats = JSON.parse(fs.readFileSync(`${ASSETS_PATH}/dates/${ config.get().locale }.json`, 'utf8'))
    },

    date: (date: Date): string => {
        return moment(date).locale(config.get().locale).format(dateFormats.moment.date)
    },

    time: (date: Date, cancelTimezoneOffset: boolean = false): string => {
        if (cancelTimezoneOffset) {
            return moment.utc(date)
                .locale(config.get().locale)
                .format(dateFormats.moment.time)
                .replace(' 0', '')
        }

        return moment(date)
            .locale(config.get().locale)
            .format(dateFormats.moment.time)
            .replace(' 0', '')
    }
}
