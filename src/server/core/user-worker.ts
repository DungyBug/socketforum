import User from "../../_common/contracts/user";
import { DB } from "../services/database-worker";

class UserWorker {
    user: User;

    constructor(user: User) {
        this.user = user;
    }

    // requestAction
    // TODO: make tools to work with users

    /*
    requestAction

    Requests actions for user and returs status:
    0 - Ok
    -1 - Unknown error
    -2 - Permission denied
    -3 - Action protected
    -4 - Message deleted
    -5 - Topic deleted
    -6 - Unknown action

    Actions:
    "rate topic", [topic id] - rate topic
    "rate message", [message id] - rate message
    "send message" - send message
    "view topic", [topic id] - view topic
    "edit message", [message id] - edit message
    "delete message", [message id] - delete message
    "create topic" - create topic

    @param action - Action to do
    @param args - arguments
    */
    async requestAction(action: string, ...args: Array<string>): Promise<number> {
        switch(action) {
            case "rate topic": {
                let topic = JSON.parse(await DB.topics.get("topics"))[args[0]];

                if(topic) {

                    if(topic.protect.protected === "true") {
                        for(let i = 0; i < topic.protect.usersAllowed; i++) {
                            
                        }
                    }

                } else {
                    return -5;
                }

                break;
            }

            case "rate message": {
                
                break;
            }

            case "send message": {
                
                break;
            }

            case "view topic": {
                
                break;
            }

            case "edit message": {
                
                break;
            }

            case "delete message": {
                
                break;
            }

            case "create topic": {
                
                break;
            }

            default: {
                return -6;
            }
        }

        return 0;
    }
};

export { UserWorker }