import React from 'react';
import './styles.scss';

interface IButtonStateProps {
    // text ob button
    text: string;
}

interface IButtonMethodsProps {
    onClick(): void;
}

type ButtonProps = IButtonStateProps & IButtonMethodsProps;

const Button: React.FunctionComponent<ButtonProps> = ({ text, onClick }) => (
    <button className='button' onClick={onClick}>{text} <Timer seconds={10000} /></button>
);


interface ITimerProps {
    seconds: number;
    onDone?(): void;
}

interface ITimerState {
    secondsLeft: number;
}


class Timer extends React.Component<ITimerProps, ITimerState> {
    private _timer: any;

    state = {
        secondsLeft: this.props.seconds ?? 10,
    }
    componentDidMount() {
        const { seconds, onDone } = this.props;

        this._timer = setInterval(() => {
            const { secondsLeft } = this.state;
            if (secondsLeft <= 0) {
                clearInterval(this._timer);
                typeof onDone === 'function' && onDone();
                return;
            }

            this.setState({ secondsLeft: secondsLeft - 1 })
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }

    render() {
        let text = "";
        let seconds = this.state.secondsLeft % 60;
        if(this.state.secondsLeft > 59) {

            let minutes = (this.state.secondsLeft % 3600 - this.state.secondsLeft % 60) / 60;

            if(this.state.secondsLeft > 3599) {

                let hours = (this.state.secondsLeft % 86400 - this.state.secondsLeft % 3600) / 3600

                if(this.state.secondsLeft > 86399) {

                    let days = (this.state.secondsLeft % 604800 - this.state.secondsLeft % 86400) / 86400;

                    if(this.state.secondsLeft > 604800) {

                        let weeks = (this.state.secondsLeft % 2419200 - this.state.secondsLeft % 604800) / 604800;

                        if(this.state.secondsLeft > 29030400) {

                            let months = (this.state.secondsLeft % 29030400 - this.state.secondsLeft % 2419200) / 2419200;

                            text += `${months} месяцев, `;
                        }

                        text += `${weeks} недель, `;
                    }

                    text += `${days} дней, `;
                }

                text += `${hours} часов, `;
            }

            text += `${minutes} минут, `;
        }

        text += `${seconds} секунд`;

        return <span>{text}</span>
    }
}

export default Timer;