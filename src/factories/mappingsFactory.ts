import { DEFAULT_LANGUAGE } from '../constants'

let mappings: any = null

function init (language = DEFAULT_LANGUAGE) {
    mappings = {
        city: require(`../../assets/mappings/${language}/city.json`),
        country: require(`../../assets/mappings/${language}/country.json`),
        region: require(`../../assets/mappings/${language}/region.json`)
    }
}

export const mappingsFactory = {
    init,
    get () {
        return mappings
    }
}