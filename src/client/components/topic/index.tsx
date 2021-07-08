import '../date-from-now/index.tsx';
import React from 'react';
import DateFromNow from '../date-from-now';
import NumberDisplay from '../number';


interface TopicPropsInterface {
    title: string;
    author: string;
    viewsCount: number;
    answersCount: number;
    dateOfCreation: Date;
    id: number;
    onClick(topicId: number): void;
};

interface TopicStateInterface {
    views: number;
    answers: number;
}

class Topic extends React.Component<TopicPropsInterface, TopicStateInterface> {

    state = {
        views: 0,
        answers: 0
    }

    render() {
        return (
            <div className="topic">
                <div className="topic topic-author">
                    <span>{this.props.author}</span>
                </div>
                <div className="topic topic-title" onClick={() => this.props.onClick(this.props.id)}>
                    <span className="link">{this.props.title}</span>
                </div>
                <div className="topic topic-info">
                    <div className="topic topic-answers">
                        <span>{this.props.answersCount}</span>
                    </div>
                    <div className="topic topic-views">
                        <NumberDisplay number={this.state.views}></NumberDisplay>
                    </div>
                    <div className="topic topic-date">
                        {<DateFromNow date={this.props.dateOfCreation}/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Topic;