import { mappingsFactory } from '../factories'

export type MappingEntry = {
    geonameid: string, 
    country: string, 
    population: number, 
    value: string, 
    timezone: string,
    countryName?: string | null,
    type?: string
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

    getMostRelevantEntry(loc: string): MappingEntry | null {
        const mappings = mappingsFactory.get()

        const countryEntry = location.getMostPopulated(loc, mappings.country)
        const regionEntry = location.getMostPopulated(loc, mappings.region)
        const cityEntry = location.getMostPopulated(loc, mappings.city)

        return (countryEntry) ? countryEntry : ((regionEntry) ? regionEntry : ((cityEntry) ? cityEntry : null))
    },

    reduceToRelevantEntry(entries: MappingEntry[]): MappingEntry | null {
        if (entries.length === 0) {
            return null
        }

        if (entries.filter(e => e.type === 'country').length > 1) return null
        if (entries.filter(e => e.type === 'region').length > 1) return null
        if (entries.filter(e => e.type === 'city').length > 1) return null

        const countryEntry = entries.find(e => e.type === 'country')
        const regionEntry = entries.find(e => e.type === 'region')
        const cityEntry = entries.find(e => e.type === 'city')
        
        if (countryEntry) {
            if (regionEntry) {
                if (regionEntry.country !== countryEntry.country) return null
                if (cityEntry) {
                    if (cityEntry.country !== countryEntry.country) return null
                }
                return cityEntry || regionEntry
            }

            if (cityEntry) {
                if (cityEntry.country !== countryEntry.country) return null
                return cityEntry
            }

            return countryEntry
        }

        if (regionEntry) {
            if (cityEntry) {
                if (cityEntry.country !== regionEntry.country) return null
                return cityEntry
            }

            return regionEntry
        }

        return cityEntry || null
    },
    
    getCountryByCode (countryCode: string) {
        const mappings: { [key: string]: MappingEntry } = mappingsFactory.get().country

        return Object.values(mappings).find(
            c => c.country === countryCode
        )
    }
}
