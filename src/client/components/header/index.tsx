import React from 'react';
import { CommandOutput } from '../../contracts/command';
import { State } from '../../core/state';
import { sendCommand } from '../../utils/command';
import LoginWindow from '../login-window';
import { CreateTopicWindow } from '../create-topic-window';

interface HeaderStateInterface {
    username: string;
    userid: number;
    showWindow: boolean;
    showCreateTopicWindow: boolean;
};

interface HeaderPropsInterface {
    onMainPageClicked: () => void;
};

class Header extends React.Component<HeaderPropsInterface, HeaderStateInterface> {
    state = {
        username: "Guest",
        userid: -1,
        showWindow: false,
        showCreateTopicWindow: false
    };

    handleLogin(name: string, email: string, password: string): Promise<number> {
        return new Promise((res) => {
            sendCommand("auth", {
                name,
                email,
                password
            }).then((output: any) => {
                if(output.output === 0) {
                    res(0);

                    requestAnimationFrame(() => {
                        State.onLogin(); // Needed to close window when loggined

                        State.userName = output.command.name;

                        this.setState((state) => {
                            return {
                                username: output.command.name,
                                userid: 0,
                                showWindow: false
                            };
                        });
                    });
                } else {
                    res(1);
                }
            });
        });
    }

    handleClose = () => {
        this.setState((state) => ({
            username: state.username,
            userid: state.userid,
            showWindow: false,
            showCreateTopicWindow: false
        }));
    }

    handleCreateTopicClick = () => {
        if(State.loggedIn) {
            this.setState(state => ({
                username: state.username,
                userid: state.userid,
                showWindow: false,
                showCreateTopicWindow: true
            }));
        } else {
            alert("Вы должны зарегистрироваться для создания топика!");
        }
    }

    handleLoginClick() {
        this.setState((state) => {
            return {
                username: state.username,
                userid: state.userid,
                showWindow: true,
                showCreateTopicWindow: false
            };
        });
    }

    handleTopicCreate(title: string, message: string) {
        State.currentTopic = {
            author: State.userName,
            title,
            message,
            date: new Date(),
            comments: [],
            views: 0,
            rates: [],
            id: State.topicCount,
            protect: {
                minRank: 0,
                usersAllowed: [],
                usersDisallowed: [],
                displayAsProtected: false,
                minReputation: 0,
                minMessagesCount: 0,
                protected: false
            }
        };
        State.currentPage = "TOPIC";
    }

    switchToMainPage = () => {
        State.currentPage = "MAIN";
        this.props.onMainPageClicked();
    }

    render() {
        return (<div className="header">
            <div className="flex-header">
                <button className="login" onClick={() => this.handleLoginClick()}>{ this.state.userid === -1 ? "Login" : "Login another account"}</button>
                <div className="user-name">{this.state.username}</div>
            </div>
            <br></br>
            <button className="create-topic-btn" onClick={this.handleCreateTopicClick}>Create topic</button>
            <br />
            <br />
            <a onClick={this.switchToMainPage} href="#">Main page</a>
            { this.state.showWindow ? <LoginWindow onClose={this.handleClose} onLogin={(name: string, email: string, password: string) => this.handleLogin(name, email, password)}></LoginWindow> : "" }
            { this.state.showCreateTopicWindow ? <CreateTopicWindow onClose={this.handleClose} onCreate={this.handleTopicCreate} /> : "" }
        </div>);
    }
};

export default Header;