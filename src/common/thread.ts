import IMessage from "./contracts/message";
import BaseThread, { IBaseThread, IThreadGroupPermissions } from "./contracts/thread";
import Topic from "./topic";
import EventEmitter from "./utils/event-emitter";
import ThreadEvents from "./contracts/thread-events";

class Thread<T extends boolean = boolean, U extends Record<string, unknown[]> & ThreadEvents = ThreadEvents> extends EventEmitter<U> implements IBaseThread {
    title: string;
    permissions: Array<IThreadGroupPermissions>;
    children: Array<Thread>;
    hasTopics: T;
    topics: T extends true ? Array<Topic> : never;

    constructor(thread: BaseThread<T>) {
        super();
        this.title = thread.title;
        this.permissions = thread.permissions;

        if(thread.hasTopics === true) {
            this.hasTopics = true as T;
            this.topics = thread.topics?.map(topic => new Topic(topic)) as T extends true ? Array<Topic> : never;
        } else {
            this.hasTopics = false as T;
        }

        this.children = thread.children.map(children => new Thread(children));
    }

    /**
     * Finds topic in this and child threads
     * @param id - id of a topic
     * @returns Topic if topic has found and null otherwise
     */
    getTopicById(id: number): Topic | null {
        if(this.hasTopics) {
            for(const topic of this.topics) {
                if(topic.id === id) {
                    return topic;
                }
            }
        }

        for(const child of this.children) {
            const thread = child.getTopicById(id);

            if(thread !== null) {
                return thread;
            }
        }

        return null;
    }

    /**
     * Finds messages from user
     * @param userId - id of a user
     * @param limit - limit length of messages
     * @param searchInChildThreads - search all messages from user in this thread and child threads
     * @returns Array of messages
     */
    getMessagesFromUser(userId: number, limit: number = 0, searchInChildThreads: boolean = true): Array<IMessage> {
        let messages: Array<IMessage> = [];

        if(this.hasTopics) {
            for(const topic of this.topics) {
                if(limit > 0) {
                    messages = messages.concat(topic.getMessagesFromUser(userId, limit - messages.length));

                    if(messages.length === limit) {
                        break;
                    }
                } else {
                    messages = messages.concat(topic.getMessagesFromUser(userId, 0));
                }
            }
        }

        if(searchInChildThreads) {
            for(const thread of this.children) {
                if(limit > 0) {
                    messages = messages.concat(thread.getMessagesFromUser(userId, limit - messages.length, true));

                    if(messages.length === limit) {
                        break;
                    }
                } else {
                    messages = messages.concat(thread.getMessagesFromUser(userId, 0, true));
                }
            }
        }

        return messages;
    }

    /**
     * Finds topics from user
     * @param userId - id of a user
     * @param limit - limit length of topics
     * @param searchInChildThreads - search all topics from user in this thread and child threads
     * @returns Array of topics
     */
    getTopicsFromUser(userId: number, limit: number = 0, searchInChildThreads: boolean = true): Array<Topic> {
        let topics: Array<Topic> = [];

        if(this.hasTopics) {
            for(const topic of this.topics) {
                if(topic.authorId === userId) {
                    topics.push(topic);

                    if(topics.length === limit && limit > 0) {
                        return topics;
                    }
                }
            }
        }

        if(searchInChildThreads) {
            for(const thread of this.children) {
                if(limit > 0) {
                    topics = topics.concat(thread.getTopicsFromUser(userId, limit - topics.length, true));

                    if(topics.length === limit) {
                        break;
                    }
                } else {
                    topics = topics.concat(thread.getTopicsFromUser(userId, 0, true));
                }
            }
        }

        return topics;
    }

    /**
     * Adds topic and fires a "topic" event
     * @param topic - topic to add
     */
    addTopic(topic: Topic) {
        this.topics.push(topic);
        this.emit("topic", topic);
    }
}

export default Thread;