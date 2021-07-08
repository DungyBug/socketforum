import EventEmitter from '../../_common/services/eventemitter';

interface ITransport_getFunction {
    (data: string): void;
}

interface ITransport {
    send(message: string): void;
    get(cb: ITransport_getFunction): void;
}

export type { ITransport, ITransport_getFunction };