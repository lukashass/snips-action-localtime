import { NluSlot, slotType, grain } from 'hermes-javascript'

export function createEnglishPlaceSlot(placeName: string, slotName: string): NluSlot<slotType.custom> {
    return {
        confidenceScore: 1,
        rawValue: placeName,
        slotName: slotName,
        entity: slotName,
        range: {
            start: 0,
            end: 1
        },
        value: {
            kind: slotType.custom,
            value: placeName
        }
    }
}

export function createTimeSlot(time: string): NluSlot<slotType.instantTime> {
    return {
        slotName: 'time',
        entity: 'snips/datetime',
        confidenceScore: 1,
        rawValue: time,
        value: {
            kind: slotType.instantTime,
            value: time,
            grain: grain.minute,
            precision: 'Exact'
        },
        range: {
            start: 0,
            end: 1
        }
    }
}