import { createServer, AddressInfo } from 'net'
import camelcase from 'camelcase'

type obj = {[key: string]: any}

export function camelize(item: obj | obj[]): obj | obj[] {
    if(typeof item !== 'object' || !item)
        return item
    if(item instanceof Array) {
        return item.map(value => camelize(value))
    }
    Object.entries(item).forEach(([ key, value ]) => {
        const camelizedKey = camelcase(key)
        const isSameKey = key === camelizedKey
        item[camelizedKey] = camelize(value)
        if(!isSameKey) {
            delete item[key]
        }
    })
    return item
}

export function getFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = createServer()
        server.on('error', err => {
            reject(err)
        })
        server.on('listening', () => {
            const address: AddressInfo = server.address() as AddressInfo
            const port = address && address['port']
            server.close()
            resolve(port)
        })
        server.listen()
    })
}

export function getMessageKey(message: {text: any, [key: string]: any}) {
    return JSON.parse(message.text).key
}
