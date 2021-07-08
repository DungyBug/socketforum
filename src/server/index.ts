import * as fs from 'fs';
import * as http from 'http';
import { TopicInterface } from '../_common/contracts/topic';
import User from '../_common/contracts/user';
import { DB } from "./services/database-worker";
import { WSTransport } from "./services/transport";

let wstransport: WSTransport;

DB.init();

function getUserById(id: number): Promise<User> {
    let user = {
        name: "",
        registrationDate: new Date(),
        status: false,
        index: -1,
        data: {}
    }

    if(id < DB.database.idsCount) {

        return new Promise((res, rej) => {
            DB.database.getByNumberId(id).then(data => {
                user = {
                    name: data.id,
                    registrationDate: new Date(data.data.registration),
                    status: false,
                    index: id,
                    data: data.data.data
                }

                res(user);
            })
        })
    } else {
        return new Promise((res, rej) => res(user));
    }
}

function getUser(id: string): Promise<User> {
    let user = {
        name: "",
        registrationDate: new Date(),
        status: false,
        index: -1,
        data: {}
    }


    return new Promise((res, rej) => {
        DB.database.get(id).then(data => {
            if(data === "") {
                res(user);
                return;
            }

            user = {
                name: id,
                registrationDate: new Date(data.registration),
                status: false,
                index: data.id - 1,
                data: data.data
            }

            res(user);
        })
    });
}

function getTopicByName(name: string): Promise<TopicInterface> {
    return new Promise((res, rej) => {
        DB.topics.get("topicids").then(data => {
            let index = data.indexOf(name);

            if(index === -1) {
                rej();
                return;
            }

            DB.topics.get("topics").then(topic => {
                topic[index].id = index;
                res(topic[index]);
            });
        });
    });
}

function getTopicById(id: number): Promise<TopicInterface> {
    return new Promise((res, rej) => {
        DB.topics.get("topics").then(data => {
            if(id >= data.length) {
                rej();
                return;
            }

            data[id].id = id;

            res(data[id]);
        });
    });
}

const server = http.createServer((req: any, res: any) => {
    if(req.url.match('id')) {
        let id = Number(req.url.slice(3));

        if(id < 1) {
            res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
            res.end("Неверный id.");
            return;
        }

        getUserById(id - 1).then(user => {
            if(user.index === -1) {
                res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
                res.end("Такого пользователя ещё не существует.");
            } else {
                res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
                res.end(`${user.name}
Дата регистрации: ${user.registrationDate}
ID: ${id}
Ранк: ${user.data.rank}
Репутация: ${user.data.reputation}
Сообщений: ${user.data.messages}
Топиков: ${user.data.topics}
Статус: ${user.data.unique_status ? user.data.unique_status : ""}`);
            }
        });

        return;
    }

    if(req.url.match('reg')) {
        DB.database.create("vladislav.webdev", {
            email: "vladislav.webdev@gmail.com",
            password: "zw5rddb21",
            registration: new Date().toISOString(),
            id: DB.database.idsCount + 1,
            data: {
                reputation: 0,
                messages: 0,
                topics: 0,
                rank: 1,
                unique_status: ""
            }
        });
        res.writeHead(200, {"Content-type": "text/plain; charset=utf-8"});
        res.end("Регистрация прошла успешно.\nИмя: vladislav.webdev@gmail.com\nEmail: vladislav.webdev@gmail.com\nПароль: zw5rddb21");

        return;
    }

    if(req.url === "/sock") {
        fs.readFile('./sock.html', (err, data) => {
            if(err) console.error(err);

            res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
            res.end(data);
        });
        return;
    }

    if(req.url.match('.js')) {
        fs.readFile('.' + req.url, (err, data) => {
            if(err) console.error(err);

            res.writeHead(200, {"Content-type": "text/js"});
            res.end(data);
        });
        return;
    }

    if(req.url.match('.map')) {
        fs.readFile('.' + req.url, (err, data) => {
            if(err) console.error(err);

            res.writeHead(200, {"Content-type": "text/plain"});
            res.end(data);
        });

        return;
    }

    if(req.url.match('.html')) {
        fs.readFile('.' + req.url, (err, data) => {
            if(err) console.error(err);

            res.writeHead(200, {"Content-type": "text/html"});
            res.end(data);
        });
        return;
    }
});

wstransport = new WSTransport(server);
server.listen(80, () => console.log("Server started"));

wstransport.onMessage(function(data: string, from: User) {
    let command = JSON.parse(data);

    switch(command.command) {
        case 'get_info_user_id': { // Get info about user by its id
            getUserById(command.userId).then((user: User) => {
                let output: any;
                output = user;
                output.request = "user data";
                wstransport.send(JSON.stringify({
                    command: command,
                    output: output
                }), from.data.clientid);
            });
            break;
        };

        case 'get_info_user_name': { // Get info about user by its name
            getUser(command.userName ).then((user: User) => {
                let output: any;
                output = user;
                output.request = "user data";
                wstransport.send(JSON.stringify({
                    command: command,
                    output: output
                }), from.data.clientid);
            });

            break;
        };

        case 'get_info_topic_id': { // Get info about topic by its id
            getTopicById(command.topicId).then((topic: TopicInterface) => {
                let output: any;
                output = topic;
                output.request = "topic data";
                wstransport.send(JSON.stringify({
                    command: command,
                    output: output
                }), from.data.clientid);
            }).catch(error => {
                wstransport.send(JSON.stringify({
                    command: command,
                    error: "invalid_id"
                }), from.data.clientid);
            });
            break;
        };

        case "get_info_topic_name": {

            getTopicByName(command.topicName).then((topic: TopicInterface) => {
                let output: any;
                output = topic;
                output.request = "topic data";
                wstransport.send(JSON.stringify({
                    command: command,
                    output: output
                }), from.data.clientid);
            }).catch(error => {
                wstransport.send(JSON.stringify({
                    command: command,
                    error: "invalid_name"
                }), from.data.clientid);
            });

            break;
        };

        case 'get_info_self': {
            let output: any;
            output = from;
            output.request = "user data";
            wstransport.send(JSON.stringify({
                command: command,
                output: output
            }), from.data.clientid);
            break;
        };

        case 'get_topics_count': {
            DB.topics.get("topicids").then(data => {
                wstransport.send(JSON.stringify({
                    command: command,
                    output: data.length
                }), from.data.clientid);
            });
            break;
        };

        case 'create_account': {

            if(command.email.match(/.@./) === null) {
                wstransport.sockets[from.data.clientid].send("F" + String.fromCharCode(3));
                return;
            }

            let _data = {
                email: command.email,
                password: command.password,
                registration: new Date().toISOString(),
                id: DB.database.idsCount + 1,
                data: command.data || {}
            };

            _data.data.rank = "1";
            _data.data.reputation = "0";
            _data.data.messages = "0";
            _data.data.topics = "0";
            _data.data.unique_status = "";

            getUser(command.name).then(user => {
                if(user.index === -1) { // User doesn't exists
                    DB.database.create(command.name, _data);
                } else {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "user_already_exists"
                    }));
                }
            });

            break;
        };

        case 'send_message': {
            DB.topics.get("topics").then(data => {
                if(command.id >= data.length) {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "invalid_id"
                    }));
                    return;
                }
                if(from.name === "") {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "user_unloginned"
                    }));
                    return;
                }
                if(data[command.id].protect.protected === "true") {
                    if(data.protect.minRank > wstransport.clients[from.data.clientid].data.rank ||
                        data.protect.usersDisallowed.indexOf(wstransport.clients[from.data.clientid].name) > -1 ||
                        data.protect.minReputation > wstransport.clients[from.data.clientid].data.reputation ||
                        data.protect.minMessagesCount > wstransport.clients[from.data.clientid].data.messages) { // Check for protection conditions
                        if(data.protect.usersAllowed.indexOf(wstransport.clients[from.data.clientid].name) === -1) { // If user isn't in "allow" list

                            if(data.protect.displayAsProtected === "true") { // If topic displays as protected
                                wstransport.sockets[from.data.clientid].send(JSON.stringify({
                                    command: command,
                                    error: "topic_protected_from_user"
                                }));
                            } else {
                                wstransport.sockets[from.data.clientid].send(JSON.stringify({
                                    command: command,
                                    error: "invalid_id"
                                }));
                            }

                            return;
                        }
                    }
                }

                data[command.id].comments[data[command.id].comments.length] = {
                    name: from.name,
                    message: command.message,
                    date: new Date().toISOString(),
                    rates: []
                };

                DB.topics.set("topics", data);
                wstransport.send("U" + JSON.stringify({
                    type: "MESSAGE", // Message update
                    topicId: command.id,
                    messageId: data[command.id].comments.length - 1
                }));
            });

            break;
        };

        case 'rate_message': {
            DB.topics.get("topics").then(data => {
                if(command.id >= data.length) {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "invalid_id"
                    }));
                    return;
                }
                if(wstransport.clients[from.data.clientid].name === "") {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "user_unloginned"
                    }));
                    return;
                }
                if(data[command.id].comments.length <= command.messageId) {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "invalid_message_id"
                    }));
                    return;
                }

                if(data[command.id].comments[command.messageId].rates.indexOf(wstransport.clients[from.data.clientid].name) === -1) { // Check if user already rated this message
                    data[command.id].comments[command.messageId].rates.push(wstransport.clients[from.data.clientid].name);

                    DB.topics.set("topics", data);
                    wstransport.send("U" + JSON.stringify({
                        type: "RATE", // Message update
                        topicId: command.id,
                        messageId: data[command.id].comments[command.messageId]
                    }));
                } else {
                    wstransport.sockets[from.data.clientid].send(JSON.stringify({
                        command: command,
                        error: "message_already_rated"
                    }));
                }
            });

            break;
        }

        case 'create_topic': {

            // TODO: Check for topic protection permissions of user

            DB.topics.get("topicids").then(data => {
                data.push(command.title);

                DB.topics.get("topics").then(dat => {
                    
                    dat.push({
                        author: from.name,
                        date: new Date().toISOString(),
                        comments: [],
                        views: 0,
                        title: command.title,
                        message: command.message,
                        rates: [],
                        protect: {
                            minRank: command.minRank || 0,
                            usersAllowed: command.usersAllowed || [],
                            usersDisallowed: command.usersDisallowed || [],
                            displayAsProtected: command.displayAsProtected || "false",
                            minReputation: command.minReputation || 0,
                            minMessagesCount: command.minMessagesCount || 0,
                            protected: command.protected || "false"
                        }
                    });
                    
                    DB.topics.set("topicids", data).then(() => {
                        DB.topics.set("topics", dat).then(() => {
                            wstransport.send("U" + JSON.stringify({
                                type: "TOPIC", // Topic created
                                topicId: dat.length - 1
                            }));
                        });
                    });
                });
            });

            break;
        }
    }
});