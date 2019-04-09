import Session from '../helpers/session'
import { createEnglishPlaceSlot, createTimeSlot } from '../utils'
const intentKey: string = 'localTime.convertTime'
const noTime = '.noTime'
const timeProvided = '.timeProvided'


export function testConvertTime(): void {
    describe('convertTime', () => {

        it('common case', async () => {
            const session = new Session()
            await session.start({
                intentName: 'snips-assistant:ConvertTime_V2',
                input: 'what time is it in Tokyo when it\'s 3am in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'location_base'),
                    createEnglishPlaceSlot('Tokyo', 'location_target'),
                    createTimeSlot(new Date(2019, 0, 1, 3))
                ]
            })
            // (basically the arguments passed to i18n, in serialized string form)
            const endMessage = await session.end()
            const text = endMessage.text ? endMessage.text : ''

            const { key, options } = JSON.parse(text)
            expect(key).toBe(intentKey + timeProvided)
            expect(options.base_location).toBe('Paris')
            expect(options.target_location).toBe('Tokyo')
            expect(options.base_hour).toBe('3')
            expect(options.base_minute).toBe('')
            expect(options.base_period).toBe('AM')
            expect(options.target_hour).toBe('11')
            expect(options.target_minute).toBe('')
            expect(options.target_period).toBe('11')
        })

        it('No Time', async () => {
            const session = new Session()
            await session.start({
                intentName: 'snips-assistant:ConvertTime_V2',
                input: 'what time is it in Tokyo when it\'s in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'location_base'),
                    createEnglishPlaceSlot('Tokyo', 'location_target'),
                ]
            })
            // (basically the arguments passed to i18n, in serialized string form)
            const endMessage = await session.end()
            const text = endMessage.text ? endMessage.text : ''
            const { key, options } = JSON.parse(text)
            expect(key).toBe(intentKey + noTime)
            expect(options.basePlace).toBe('Paris')
            expect(options.targetPlace).toBe('Tokyo')
            expect(options.difference).toBe('11 AM')
        })    
    })
}