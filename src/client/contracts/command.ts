export interface CommandObject {
    command: string;
    commandId: number;
};

export interface CommandOutput {
    command: CommandObject,
    output: any,
    error?: string
};

export interface CommandHandler {
    id: number,
    cb: (data: CommandOutput) => void;
};
