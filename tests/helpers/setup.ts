/* eslint no-console: off */

import { spawn, ChildProcess } from 'child_process'
import mqtt, { MqttClient } from 'mqtt'
import { getFreePort } from './tools'
import index from '../../dist/index'

export let setupVars : {
    mosquitto: ChildProcess,
    mosquittoPort: string,
    mqttClient: MqttClient,
    killHermes: () => void
} = {} as any

export function bootstrap() {
    beforeAll(async () => {
        require('debug').enable('*:error')
        const mosquittoPort = '' + await getFreePort()
        console.log('Launching mosquitto on port [' + mosquittoPort + ']')
        // To print full mosquitto logs, replace stdio: 'ignore' with stdio: 'inherit'
        const mosquitto = spawn('mosquitto', ['-p', mosquittoPort, '-v'], { stdio: 'ignore' })
        console.log('Mosquitto ready!')
        try {
            setupVars.mosquitto = mosquitto
            setupVars.mosquittoPort = mosquittoPort
            setupVars.killHermes = await index({
                hermesOptions: {
                    address: 'localhost:' + mosquittoPort,
                    logs: true
                },
                bootstrapOptions: {
                    i18n: {
                        mock: true
                    }
                }
            })
        } catch (error) {
            console.error(error)
        }
    })

    beforeEach(done => {
        const client = mqtt.connect(`mqtt://localhost:${setupVars.mosquittoPort}`)
        client.on('connect', function () {
            done()
        })
        client.on('error', function(err) {
            client.end(true)
            throw err
        })
        setupVars.mqttClient = client
    })

    afterEach(() => {
        setupVars.mqttClient.end(true)
    })

    afterAll(done => {
        const { mosquitto, killHermes } = setupVars
        setTimeout(() => {
            mosquitto.kill()
            console.log('Mosquitto killed.')
            killHermes()
            console.log('Hermes killed.')
            done()
        }, 500)
    })
}
