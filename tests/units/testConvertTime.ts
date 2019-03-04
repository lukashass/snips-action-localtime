import Session from '../helpers/session'
import { createEnglishPlaceSlot, createTimeSlot } from '../utils'
const intentName: string = 'snips-assistant:ConvertTime'
const intentKey: string = 'localTime.convertTime'
const noTime = '.noTime'
const timeProvided = '.timeProvided'


export function testConvertTime(): void {
    describe('convertTime', () => {

        it('common case', async () => {
            const session = new Session()
            await session.start({
                intentName,
                input: 'what time is it in Tokyo when it\'s 3am in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'city_base'),
                    createEnglishPlaceSlot('Tokyo', 'city_target'),
                    createTimeSlot(new Date(2019, 0, 1, 3))
                ]
            })
            // (basically the arguments passed to i18n, in serialized string form)
            const endMessage = await session.end()
            const text = endMessage.text ? endMessage.text : ''
            const { key, options } = JSON.parse(text)
            expect(key).toBe(intentKey + timeProvided)
            expect(options.basePlace).toBe('Paris')
            expect(options.targetPlace).toBe('Tokyo')
            expect(options.baseHour).toBe('3')
            expect(options.baseMinute).toBe('')
            expect(options.basePeriod).toBe('am')
            expect(options.targetHour).toBe('11')
            expect(options.targetMinute).toBe('')
            expect(options.targetPeriod).toBe('11')
        })

        it('No Time', async () => {
            const session = new Session()
            await session.start({
                intentName,
                input: 'what time is it in Tokyo when it\'s in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'city_base'),
                    createEnglishPlaceSlot('Tokyo', 'city_target'),
                ]
            })
            // (basically the arguments passed to i18n, in serialized string form)
            const endMessage = await session.end()
            const text = endMessage.text ? endMessage.text : ''
            const { key, options } = JSON.parse(text)
            expect(key).toBe(intentKey + noTime)
            expect(options.basePlace).toBe('Paris')
            expect(options.targetPlace).toBe('Tokyo')
            expect(options.difference).toBe('11 am')
        })    
    })
}