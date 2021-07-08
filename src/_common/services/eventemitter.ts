// export interface IEventEmitter {
//     events: any;
// };

export default class EventEmitter {
    events: {[key: string]: any}
    
    constructor() {
        this.events = {};
    }

    on(name: string, callback: Function) {
        if(!this.events.hasOwnProperty(name)) {
            this.events[name] = [];
        }

        this.events[name].push(callback);
    }

    emit(name: string, ...params: any) {
        if (this.events[name]) {
            for(let i = 0; i < this.events[name].length; i++) {
                this.events[name][i](params);
            }
        }
    }

    off(name: string, callback: Function) {
        if(this.events.hasOwnProperty(name)) {
            this.events[name] = this.events[name].filter((handler: any) => handler !== callback);
        }
    }
}