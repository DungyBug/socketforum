import { CommandObject, CommandOutput, CommandHandler } from '../contracts/command';
import { io } from "socket.io-client";
import { UpdateHandler, UpdateInterface, UpdateHandlerCallback } from '../contracts/update-handler';
const socket = io();

const commandQueue: Array<CommandHandler> = [];
const onUpdateCallbacks: Array<UpdateHandler> = [];

socket.on("message", (message: string) => {
    if(message[0] === 'U') { // Update of topic or something else
        let object: UpdateInterface = JSON.parse(message.slice(1));

        for(let i = 0; i < onUpdateCallbacks.length; i++) {
            if(onUpdateCallbacks[i].type) {
                if(onUpdateCallbacks[i].type === object.type) {
                    onUpdateCallbacks[i].cb(object);
                }
            } else {
                onUpdateCallbacks[i].cb(object);
            }
        }

        return;
    }

    let output: CommandOutput = JSON.parse(message);

    for(let i = 0; i < commandQueue.length; i++) {
        if(commandQueue[i].id === output.command.commandId) {
            commandQueue[i].cb(output);
            commandQueue.splice(i, 1);
            break;
        }
    }
});

/**
 * sendCommand
 * @param command - name of the command to be executed
 * @param parameters - object, that contains some parameters in it, like "id" key, "topicId" key, etc.
 * Returns a promise, which the returns result of the command.
 */
function sendCommand(command: string, parameters: any): Promise<CommandOutput> {
    return new Promise<CommandOutput>((res) => {
        commandQueue.push({
            id: commandQueue.length,
            cb: res
        });
        socket.send(JSON.stringify({
            command,
            ...parameters,
            commandId: commandQueue.length - 1
        }));
    });
}

function onUpdate(cb: UpdateHandlerCallback, type?: string) {
    onUpdateCallbacks.push({
        type,
        cb
    });
}

export { sendCommand, onUpdate };