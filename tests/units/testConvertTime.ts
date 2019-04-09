import Session from '../helpers/session'
import { createEnglishPlaceSlot, createTimeSlot } from '../utils'
import { getMessageKey, getMessageOptions } from '../helpers'

export function testConvertTime(): void {
    describe('convertTime', () => {

        it('common case', async () => {
            const session = new Session()
            await session.start({
                intentName: 'snips-assistant:ConvertTime_V2',
                input: 'what time is it in Tokyo when it\'s 3 am in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'location_base'),
                    createEnglishPlaceSlot('Tokyo', 'location_target'),
                    createTimeSlot('2019-04-10 03:00:00 +00:00')
                ]
            })
            
            const endMsg = (await session.end()).text
            expect(getMessageKey(endMsg)).toBe('localTime.convertTime.timeProvided')
            expect(getMessageOptions(endMsg).base_location).toBe('Paris')
            expect(getMessageOptions(endMsg).target_location).toBe('Tokyo')
            expect(getMessageOptions(endMsg).base_hour).toBe('3')
            expect(getMessageOptions(endMsg).base_minute).toBe('')
            expect(getMessageOptions(endMsg).base_period).toBe('AM')
            expect(getMessageOptions(endMsg).target_hour).toBe('10')
            expect(getMessageOptions(endMsg).target_minute).toBe('')
            expect(getMessageOptions(endMsg).target_period).toBe('AM')
        })

        it('no time', async () => {
            const session = new Session()
            await session.start({
                intentName: 'snips-assistant:ConvertTime_V2',
                input: 'what time is it in Tokyo when it\'s in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'location_base'),
                    createEnglishPlaceSlot('Tokyo', 'location_target'),
                ]
            })
            
            const endMsg = (await session.end()).text
            expect(getMessageKey(endMsg)[0]).toBe('error.noTime')
        })    
    })
}
