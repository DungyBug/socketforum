import { Database } from './database';

export const DB = {
    database: new Database(),
    topics: new Database(),

    init: function(): void {
        this.database.open("./users.json");
        this.topics.open("./topics.json");
    }
};