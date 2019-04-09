import { configFactory } from '../factories'

export const beautify = {    
    time: (date: Date): string => {
        const config = configFactory.get()
        const options = { hour: 'numeric', minute: 'numeric' }

        if (config.locale === 'french') {
            // French
            return date.toLocaleString('fr-FR', {
                ...options,
                hour12: false
            }).replace(':', ' heure ').replace(' 00', '')
        } else {
            // English
            return date.toLocaleString('en-US', {
                ...options,
                hour12: true
            }).replace(':', ' ').replace(' 00','')
        }
    }
}
