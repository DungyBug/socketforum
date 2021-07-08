interface UpdateInterface {
    type: string;
    topicId: number;
    messageId?: number;
};

interface UpdateHandlerCallback {
    (object: UpdateInterface): void
};

interface UpdateHandler {
    type?: string;
    cb: UpdateHandlerCallback;
};

export { UpdateInterface, UpdateHandler, UpdateHandlerCallback };