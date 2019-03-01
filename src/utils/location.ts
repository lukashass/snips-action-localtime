import { mappingsFactory, configFactory } from '../factories'
import { NluSlot, slotType } from 'hermes-javascript'

export type mappingEntry = {
    geonameid: string, 
    country: string, 
    population: number, 
    value: string, 
    timezone: string,
    countryName?: string | null
}

function getMostPopulated(item: string | undefined, itemList: { [key: string]: mappingEntry }, countryCodeToFilterOn?: string): mappingEntry | null {
    let value: mappingEntry | mappingEntry[]

    if(!item)
        return null
    value = itemList[item]
    if(value && value instanceof Array) {
        return value.reduce((accu, item) => {
            return (
                (
                    !countryCodeToFilterOn ||
                    item.country === countryCodeToFilterOn
                ) &&
                (
                    accu === null ||
                    accu.population < item.population
                )
            ) ? item : accu
        }, null)
    } else {
        return value || null
    }
}

function getCountryByCode (countryCode: string | null) {
    const mappings: { [key: string]: mappingEntry } = mappingsFactory.get().country
    
    return Object.values(mappings).find(country => country.country === countryCode) || null
}

export const location = {
    extractGeoNameIdAndPlace(countrySlot: NluSlot<slotType.custom> | null, regionSlot: NluSlot<slotType.custom> | null, citySlot: NluSlot<slotType.custom> | null): mappingEntry {
        let countryCode: string | null,
            countryName: string | null,
            defaultLocation: string,
            location: mappingEntry | null,
            country: mappingEntry | null,
            region: mappingEntry | null,
            locationName: string | null
        
        const mappings = mappingsFactory.get()
        
        const config = configFactory.get()
        locationName = null
        if (citySlot && typeof(citySlot.value.value) === 'string')
            locationName = citySlot.value.value
        else if (regionSlot && typeof(regionSlot.value.value) === 'string')
            locationName = regionSlot.value.value
        else if (countrySlot && typeof(countrySlot.value.value) === 'string')
            locationName = countrySlot.value.value

        // If no location was specified, fallback to the default location
        if(!locationName) {
            defaultLocation = config.defaultLocation
            // Try to match cities, then regions
            location = (getMostPopulated(defaultLocation, mappings.city) || getMostPopulated(defaultLocation, mappings.region))
            if(!location)
                throw new Error('defaultLocation')
            return location
        }

        country = getMostPopulated(countrySlot && typeof(countrySlot.value.value) === 'string' ? countrySlot.value.value : undefined, mappings.country)
        if (countrySlot && !regionSlot && !citySlot) {
            if (!country)
                throw new Error('country')
            return country
        }
        
        // Use the region country code if needed
        if (country) {
            countryCode = country.country
            countryName = country.value
        } else {
            region = getMostPopulated(regionSlot && typeof(regionSlot.value.value) === 'string' ? regionSlot.value.value : undefined, mappings.region)
            countryCode = region ? region.country : null
            country = region ? getCountryByCode(region.country) : null
            countryName = country ? country.value : null
        }
        location = getMostPopulated(locationName, citySlot ? mappings.city : mappings.region, countryCode ? countryCode : undefined)

        if(!location)
            throw new Error('place')
        return {
            ...location,
            countryName
        }
    }
}