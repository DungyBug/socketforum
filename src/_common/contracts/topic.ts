import User from "./user";

interface ProtectInterface {
    minRank: number;
    usersAllowed: Array<string>; // Nicknames
    usersDisallowed: Array<string>; // Nicknames
    displayAsProtected: boolean; // Display to users, that disallowed to this topic, that this topic exists and protected from them.
    minReputation: number;
    minMessagesCount: number;
    protected: boolean;
};

interface MessageInterface {
    name: string; // Nickname
    message: string;
    date: Date;
    rates: Array<string>; // Nicknames
};

interface TopicInterface {
    author: string; // Nickname
    date: Date;
    comments: Array<MessageInterface>;
    views: number;
    id: number; // Id of topic. Needed to get topic id having only it's title
    title: string;
    message: string;
    rates: Array<string>; // Nicknames of users, who rated this topic
    protect: ProtectInterface;
};

export { TopicInterface };