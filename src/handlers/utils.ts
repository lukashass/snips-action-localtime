const { configFactory } = require('../factories')

export const getCurrentLocation = function() {
    const config = configFactory.get()

    if (config.currentLocation)
        return config.currentLocation
    
    throw new Error('noCurrentLocation')
}
