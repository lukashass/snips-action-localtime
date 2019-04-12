import { configFactory } from '../factories'

export const beautify = {    
    time: (date: Date, cancelTimezoneOffset: boolean = false): string => {
        const config = configFactory.get()
        let options: any = { hour: 'numeric', minute: 'numeric' }

        if (cancelTimezoneOffset) {
            options = {
                ...options,
                timeZone: 'UTC'
            }
        }

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
