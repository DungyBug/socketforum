import IWebSocket from "../../_common/contracts/websocket"
import User from "../../_common/contracts/user";
import { DB } from "./database-worker";
import * as http from 'http';

const io = require("socket.io");

interface onMessageInterface {
    (data: string, from: User): void;
}

class WSTransport implements IWebSocket {
    socket: any;
    clients: Array<User>;
    sockets: Array<any>;
    onMessageCallbacks: Array<onMessageInterface>;

    constructor(server: http.Server) {
        this.socket = io({
            path: "/socket.io",
            serveClient: false
        });
        this.socket.attach(server, {
            pingInterval: 23000,
            pingTimeout: 5000,
            cookie: false
        })
        this.clients = [];
        this.sockets = [];
        this.onMessageCallbacks = [];

        this.socket.on("connection", (client: any) => {
            const index = this.sockets.length;
            this.sockets.push(client);
            let cuser: User = {
                name: "",
                registrationDate: new Date(),
                status: false,
                index: 0,
                data: {clientid: index}
            };

            client.on("message", async (data: string) => {
                let command = JSON.parse(data);
                if(command.command === 'auth') { // Auth user

                    let user: User = {
                        name: command.name,
                        registrationDate: new Date(0),
                        status: true,
                        index: 0,
                        data: undefined
                    };

                    DB.database.get(command.name).then(userdata => {

                        if(userdata) {
    
                            if(userdata.password === command.password && userdata.email === command.email) {
    
                                user.registrationDate = new Date(userdata.registration);
                                user.index = Number(userdata.id);
                                user.data = userdata.data;
                                (user.data as any).clientid = index;
    
                                cuser = user;
                                console.log("AUTH+", command);
                                this.send(JSON.stringify({
                                    command: command,
                                    output: 0 // ok
                                }), cuser.data.clientid);
    
                            } else {
                                this.send(JSON.stringify({
                                    command: command,
                                    output: 2 // invalid credentials
                                }), cuser.data.clientid);
                                console.log("AUTH-", command);
                            }
    
                        } else {
                            this.send(JSON.stringify({
                                command: command,
                                output: 1 // no such user
                            }), cuser.data.clientid);
                            console.log("AUTH-", command);
                        }

                    });
                } else {
                    for(let i = 0; i < this.onMessageCallbacks.length; i++) {
                        this.onMessageCallbacks[i](data, cuser);
                    }
                }
            })
        });
    }

    send(data: string, clientid?: number): void {
        if(clientid !== undefined) {
            this.sockets[clientid].send(data);
        } else {
            this.socket.send(data);
        }
    }

    onMessage(cb: onMessageInterface): void {
        this.onMessageCallbacks.push(cb);
    }

    getUser(index: number) {
        return this.clients[index];
    }

    getUsers() {
        return this.clients;
    }
};

export { WSTransport };