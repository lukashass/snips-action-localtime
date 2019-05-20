import { mappings as mappingsUtils } from './mappings'

export type MappingEntry = {
    geonameid: string, 
    country: string, 
    population: number, 
    value: string, 
    timezone: string,
    countryName?: string | null,
    type: string
}

export const location = {
    getMostPopulated(item: string, itemList: { [key: string]: MappingEntry }, countryCode: string = ''): MappingEntry | null {
        let value: MappingEntry | MappingEntry[] = itemList[item.toLowerCase()]

        if (value) {
            if (countryCode) {
                if (value instanceof Array) {
                    value = value.filter(v => v.country === countryCode)
                } else {
                    if ((value as MappingEntry).country !== countryCode) return null
                }
            }

            if (value instanceof Array) {
                return value.reduce((accu, item) => {
                    return (accu === null || accu.population < item.population) ? item : accu
                }, null)
            }
        }
        
        return value || null
    },

    getEntry(loc: string, countryCode: string = ''): MappingEntry | null {
        const mappings = mappingsUtils.get()

        const countryEntry = location.getMostPopulated(loc, mappings.country, countryCode)
        const regionEntry = location.getMostPopulated(loc, mappings.region, countryCode)
        const cityEntry = location.getMostPopulated(loc, mappings.city, countryCode)

        return (countryEntry) ? countryEntry : ((regionEntry) ? regionEntry : ((cityEntry) ? cityEntry : null))
    },

    getMostRelevantEntries(locations: string[]): MappingEntry[] | null {
        let entries: MappingEntry[] = []
        let ret: MappingEntry[] = []

        for (let loc of locations) {
            const entry = location.getEntry(loc)
            if (entry) {
                entries.push(entry)
            }
        }

        let countryEntry = entries.find(e => e.type === 'country')
        let regionEntry = entries.find(e => e.type === 'region')
        let cityEntry = entries.find(e => e.type === 'city')

        // Checking the consistency of more specific locations with respect to less specific locations
        if (countryEntry) {
            if (regionEntry) {
                if (regionEntry.country !== countryEntry.country) {
                    regionEntry = location.getEntry(regionEntry.value, countryEntry.country)
                    if (!regionEntry) return null
                }
            }

            if (cityEntry) {
                if (cityEntry.country !== countryEntry.country) {
                    cityEntry = location.getEntry(cityEntry.value, countryEntry.country)
                    if (!cityEntry) return null
                }
            }
        } else if (regionEntry) {
            if (cityEntry) {
                if (cityEntry.country !== regionEntry.country) {
                    cityEntry = location.getEntry(cityEntry.value, regionEntry.country)
                    if (!cityEntry) return null
                }
            }
        }

        if (cityEntry) ret.push(cityEntry)
        if (regionEntry) ret.push(regionEntry)
        if (countryEntry) ret.push(countryEntry)
        
        return ret
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
        const mappings: { [key: string]: MappingEntry } = mappingsUtils.get().country

        return Object.values(mappings).find(
            c => c.country === countryCode
        )
    }
}
