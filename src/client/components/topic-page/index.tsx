import React from 'react';
import { TopicInterface } from '../../../_common/contracts/topic';
import { TopicMessage } from '../topic-message';
import { State } from '../../core/state';
import { sendCommand } from '../../utils/command';

interface TopicPageProps {
    topic: TopicInterface;
};

interface TopicPageState {
    message: string;
};



export class TopicPage extends React.Component<TopicPageProps, TopicPageState> {
    state = {
        message: ""
    }
    
    handleMessageKeyPress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState(() => ({ message: e.target.value }));
    }

    handleSendButtonClick = () => {
        sendCommand("send_message", {
            id: State.currentTopic.id,
            message: this.state.message
        })
        this.setState(() => ({
            message: ""
        }));
    }

    render() {
        const {
            topic: {
                title,
                author,
                message,
                comments
            }
        } = this.props;
        let messages: Array<any> = [];

        for(let i = 0; i < comments.length; i++) {
            messages.push(<TopicMessage author={comments[i].name} key={i} message={this.props.topic.comments[i].message} />);
        }

        return (
            <div className="topic-page">
                <h1 className="topic-title">{title}</h1>
                <div className="top-author">{author}</div>
                <div className="top-message message">{message}</div>
                <br />
                {messages}
                {State.loggedIn ? (<div><br />
                <textarea  value={this.state.message} onChange={this.handleMessageKeyPress} />
                <br />
                <button onClick={this.handleSendButtonClick}>Оставить сообщение</button></div>) : ""}
                
            </div>
        );
    }
}