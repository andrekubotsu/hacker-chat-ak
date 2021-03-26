// recebe as regas de negócio e faz a delegação dos eventos - é sempre o intermediário
// não tem permissão para acessar os comandos do terminal
// não tem permissão para alterar o socket

import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
    #usersCollors = new Map()

    constructor() {}

    #pickCollor() {
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg` 
    }

    #getUserCollor(userName) {
        if(this.#usersCollors.has(userName)) return this.#usersCollors.get(userName) // verifica se já tem uma cor setada

        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)

        return collor
    }

    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue()
            eventEmitter.emit(constants.events.app.MESSAGE_SENT, message)
            this.clearValue()
        }
    }

    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg

            const collor = this.#getUserCollor(userName)

            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onLogChange({ screen, activityLog }) {
        
        
        return msg => {
            // user left or user join
            const [ userName ] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)
            screen.render()
        }
    }

    #onStatusChange({ screen, status }) {
        // ['andre', 'amanda'] 
        return users => {
            // vamos pegar o primeiro elemento da lista
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)

            users.forEach(userName => {
               const collor = this.#getUserCollor(userName)
               status.addItem(`{${collor}}{bold}${userName}{/}`)
           }) 

           screen.render()
        }
    }


    #registerEvents(eventEmitter, components) {
       /* eventEmitter.emit('turma01', 'hey')                                 -- tem alguem enviando
        eventEmitter.on('turma01', msg => console.log(msg.toString()))        -- tem alguem escutando */     

        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChange(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChange(components))
    }

    async initializeTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({title: 'Hacker Chat - Andre'})
            .setLayoutComponent()
            .setInputComponent((this.#onInputReceived(eventEmitter)))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()

        // teste
        // setInterval(() => {
        //     const users = ['andre']
        //     eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'hey', userName: 'andre' })
        //     eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { message: 'ho', userName: 'amanda' })
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'andre join')
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'andre left')
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'amanda join')
        //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        //     users.push('mariazinha')
        //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        //     users.push('amanda', 'maravilha')
        //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        // }, 2000)
    }
}