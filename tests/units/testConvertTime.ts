import { Test } from 'snips-toolkit'
import { createEnglishPlaceSlot, createTimeSlot } from '../utils'

const { Session, Tools} = Test
const { getMessageKey, getMessageOptions } = Tools

export function testConvertTime(): void {
    describe('convertTime', () => {

        it('common case', async () => {
            const session = new Session()
            await session.start({
                intentName: 'snips-assistant:ConvertTime',
                input: 'what time is it in Tokyo when it\'s 3 am in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'location_base'),
                    createEnglishPlaceSlot('Tokyo', 'location_target'),
                    createTimeSlot('2019-04-10 03:00:00 +00:00')
                ]
            })
            
            const endMsg = await session.end()
            expect(getMessageKey(endMsg)).toBe('localTime.convertTime.timeProvided')
            expect(getMessageOptions(endMsg).base_location).toBe('Paris')
            expect(getMessageOptions(endMsg).target_location).toBe('Tokyo')
            expect(getMessageOptions(endMsg).base_time).toBe('3 AM')
            expect(getMessageOptions(endMsg).target_time).toBe('10 AM')
        })

        it('no time', async () => {
            const session = new Session()
            await session.start({
                intentName: 'snips-assistant:ConvertTime',
                input: 'what time is it in Tokyo when it\'s in Paris?',
                slots: [
                    createEnglishPlaceSlot('Paris', 'location_base'),
                    createEnglishPlaceSlot('Tokyo', 'location_target'),
                ]
            })
            
            const endMsg = await session.end()
            expect(getMessageKey(endMsg)[0]).toBe('error.noTime')
        })    
    })
}
