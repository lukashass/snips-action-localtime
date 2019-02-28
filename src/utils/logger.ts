import debug from 'debug'
const name = require('../../package.json')
const infoLogger = debug(name + ':info')
const debugLogger = debug(name + ':debug')
const errorLogger = debug(name + ':error')

export const logger = {
    info: (formatter: string, ...args: any[]) => infoLogger(formatter, ...args),
    debug: (formatter: string, ...args: any[]) => debugLogger(formatter, ...args),
    error: (formatter: string, ...args: any[]) => errorLogger(formatter, ...args)
}