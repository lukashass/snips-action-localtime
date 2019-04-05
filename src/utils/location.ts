import { mappingsFactory, configFactory } from '../factories'

export type MappingEntry = {
    geonameid: string, 
    country: string, 
    population: number, 
    value: string, 
    timezone: string,
    countryName?: string | null
}

export const location = {
    getMostPopulated(item: string, itemList: { [key: string]: MappingEntry }): MappingEntry | null {
        let value: MappingEntry | MappingEntry[] = itemList[item]

        if (value) {
            if (value instanceof Array) {
                return value.reduce((accu, item) => {
                    return (accu === null || accu.population < item.population) ? item : accu
                }, null)
            }

            return value
        }
        
        return null
    },
    
    getCountryByCode (countryCode: string) {
        const mappings: { [key: string]: MappingEntry } = mappingsFactory.get().country

        return Object.values(mappings).find(
            c => c.country === countryCode
        )
    }
}
