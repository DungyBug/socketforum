import IMessage from "./contracts/message";
import ITopic from "./contracts/topic";
import TopicEvents from "./contracts/topic-events";
import EventEmitter from "./utils/event-emitter";

class Topic<T extends Record<string, unknown[]> & TopicEvents = TopicEvents> extends EventEmitter<T> implements ITopic {
    authorId: number;
    title: string;
    id: number;
    messages: Array<IMessage>;
    
    constructor(topic: ITopic) {
        super();
        this.authorId = topic.authorId;
        this.title = topic.title;
        this.id = topic.id;
        this.messages = topic.messages;
    }

    addMessage(message: IMessage) {
        this.messages.push(message);
        this.emit("message", message);
    }

    getMessagesFromUser(userId: number, limit: number = 0): Array<IMessage> {
        let messages: Array<IMessage> = [];

        for(const message of this.messages) {
            if(message.authorId === userId) {
                messages.push(message);

                if(messages.length === limit && limit > 0) {
                    break;
                }
            }
        }

        return messages;
    }
}

export default Topic;