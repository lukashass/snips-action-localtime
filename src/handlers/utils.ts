import { config as configUtils } from 'snips-toolkit'

export const getCurrentLocation = function() {
    const config = configUtils.get()

    if (config.currentLocation)
        return config.currentLocation
    
    throw new Error('noCurrentLocation')
}
