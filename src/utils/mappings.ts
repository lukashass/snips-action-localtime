import { ASSETS_PATH } from '../constants'
import fs from 'fs'

let _mappings: any = null

function init(language: string) {
    _mappings = {
        city: JSON.parse(fs.readFileSync(`${ASSETS_PATH}/mappings/${language}/city.json`, 'utf8')),
        country: JSON.parse(fs.readFileSync(`${ASSETS_PATH}/mappings/${language}/country.json`, 'utf8')),
        region: JSON.parse(fs.readFileSync(`${ASSETS_PATH}/mappings/${language}/region.json`, 'utf8'))
    }
}

export const mappings = {
    init,
    get () {
        return _mappings
    }
}
