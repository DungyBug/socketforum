import { TopicInterface } from "../../_common/contracts/topic";

type Pages = "" | "TOPIC" | "MAIN";

export class State {
    static currentPage: Pages = '';
    /*
    currentPage
    Possible values:
    MAIN - Main page
    TOPIC - Topic page ( topic contains in currentTopic )
    */
    static currentTopic: TopicInterface; // Loaded topic
    static loggedIn: boolean;
    static userName: string;
    static topicCount: number;
    static onLogin: () => void;
}