import React from 'react';
import { TopicInterface } from '../_common/contracts/topic';

import Timer from './components/button';
import Topic from './components/topic';
import ViewCount from './components/view-count'
import { CommandOutput } from './contracts/command';
import { UpdateInterface } from './contracts/update-handler';
import { sendCommand, onUpdate } from './utils/command';
import Header from './components/header';
import { State } from './core/state';
import { TopicPage } from './components/topic-page';

interface IAppState {
    topics: Array<TopicInterface>;
    topicsCount: number;
    update: number;
};

class App extends React.Component<any, IAppState> {
    state = {
        topics: [],
        topicsCount: 0,
        update: 0
    }

    componentDidMount() {
        let _this = this;

        State.currentPage = "MAIN";

        State.onLogin = this.handleLogin;

        State.loggedIn = false;

        sendCommand("get_topics_count", {}).then(count => {
            _this.state.topicsCount = count.output;

            State.topicCount = count.output;

            for(let i = 0; i < count.output; i++) {
                sendCommand("get_info_topic_id", {topicId: i}).then(data => {
                    _this.setState((state) => {
                        return {
                            topics: state.topics.concat(data.output as TopicInterface)
                        };
                    });
                });
            }
        });

        onUpdate((object: UpdateInterface) => this.handleTopicUpdate(object));
    }

    handleLogin = () => {
        State.loggedIn = true;
        this.setState(state => ({
            topics: state.topics,
            topicsCount: state.topicsCount,
            update: Number(!state.update)
        }));
    }

    handleTopicUpdate(object: UpdateInterface) {
        let _this = this;

        switch(object.type) {
            case "TOPIC": { // Topic created

                State.topicCount++;

                sendCommand("get_info_topic_id", {topicId: object.topicId}).then((data: CommandOutput) => {
                    _this.setState((state) => {
                        return {
                            topics: state.topics.concat(data.output as TopicInterface)
                        };
                    });
                });
                break;
            };

            case "MESSAGE": { // Sended a message to the topic
                // if(State.currentPage === "TOPIC" && State.currentTopic.id === object.topicId) {
                    sendCommand("get_info_topic_id", {topicId: object.topicId}).then((data: CommandOutput) => {
                        _this.setState((state) => {
                            let newTopics = state.topics;
                            newTopics[object.topicId] = (data.output as TopicInterface);
                            State.currentTopic = (data.output as TopicInterface);
                            return {
                                topics: newTopics
                            };
                        });
                    });
                // }
                break;
            }
        }
    }

    handleTopicClick(topicId: number) {
        State.currentTopic = this.state.topics[topicId];
        State.currentPage = "TOPIC";
        this.forceUpdate();
    }

    render() {
        switch(State.currentPage) {
            case 'MAIN': {
                let topics: Array<any> = [];
        
                for(let i = 0; i < this.state.topics.length; i++) {
                    topics.push(<Topic onClick={(id) => this.handleTopicClick(id)} id={i} key={i} title={(this.state.topics[i] as TopicInterface).title} author={(this.state.topics[i] as TopicInterface).author} viewsCount={(this.state.topics[i] as TopicInterface).views} answersCount={(this.state.topics[i] as TopicInterface).comments.length} dateOfCreation={(this.state.topics[i] as TopicInterface).date}></Topic>);
                }
        
                return (
                <div className="app">
                    <Header onMainPageClicked={() => this.forceUpdate()}></Header>
                    {topics}
                </div>
                );
                break;
            }
            case 'TOPIC': {
                return (
                    <div className="app">
                        <Header onMainPageClicked={() => this.forceUpdate()}></Header>
                        <TopicPage topic={State.currentTopic} key={this.state.update}></TopicPage>
                    </div>
                );
                break;
            }
        }

        return (
            <div>Loading...</div>
        );
    }
};

export default App;