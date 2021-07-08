import { ITransport, ITransport_getFunction } from './transport';
import {io, Socket} from 'socket.io-client';

class WSTransport implements ITransport {
    socket: Socket;

    constructor() {
        this.socket = io();
        this.socket.send("A" + localStorage.getItem("authkey"));
    }

    send(message: string) {
        this.socket.send(message);
    }

    get(cb: ITransport_getFunction): void {
        this.socket.on("data", cb);
    }
};

export default WSTransport;