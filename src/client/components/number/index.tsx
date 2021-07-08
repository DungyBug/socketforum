import { spawn } from 'child_process';
import React from 'react';

interface NumberDisplayProps {
    number: number;
};

class NumberDisplay extends React.Component<NumberDisplayProps, any> {
    render() {
        let output: string;

        if(this.props.number < 1000) {
            output = this.props.number.toString();
        } else if(this.props.number < 1000000) {
            output = (this.props.number - this.props.number % 1000) / 1000 + 'K';
        } else {
            output = (this.props.number - this.props.number % 1000000) / 1000000 + 'M';
        }

        return (<span>{output}</span>);
    }
};

export default NumberDisplay;