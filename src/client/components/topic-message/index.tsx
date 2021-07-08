import React from 'react';

interface TopicMessageProps {
    author: string;
    message: string;
    // TODO: Uncomment when adding "Rate" functional
    // messageId: number;
    // topicId: number;
}

export class TopicMessage extends React.Component<TopicMessageProps, any> {
    render() {
        return (
            <div className="topic-message">
                <div className="message-author">{this.props.author}</div>
                <div className="message">{this.props.message}</div>
            </div>
        );
    }
}