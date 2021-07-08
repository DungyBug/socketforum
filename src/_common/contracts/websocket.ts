import User from "./user";

interface onMessageInterface {
    (data: string, from: User): void;
}

interface onMessageAddCallbackInterface {
    (cb: onMessageInterface): void;
}

interface sendInterface {
    (data: string, clientid?: number): void; 
}

interface getUserInterface {
    (index: number): User;
}

interface getUsersInterface {
    (): Array<User>;
}

interface IWebSocket {
    socket: any;
    onMessage: onMessageAddCallbackInterface;
    send: sendInterface;
    getUser: getUserInterface;
    getUsers: getUsersInterface;
}

/*
WebSocket on client side
If you disconnected from server by some reason,
websocket will try to reconnect until it
connect to server or you close the page.

If you got data from server, you will recieve
it by onMessage, where "from.index" will be 0.
Server is a "User", but always with index 0.

Yes, you also can send and recieve data from
other users.
*/

export default IWebSocket;