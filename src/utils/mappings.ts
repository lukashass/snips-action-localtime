let _mappings: any = null

function init (language: string) {
    _mappings = {
        city: require(`../../assets/mappings/${language}/city.json`),
        country: require(`../../assets/mappings/${language}/country.json`),
        region: require(`../../assets/mappings/${language}/region.json`)
    }
}

export const mappings = {
    init,
    get () {
        return _mappings
    }
}
