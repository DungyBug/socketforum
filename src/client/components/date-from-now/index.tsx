import React from 'react';

// Getting time metrics
function seconds(ms: number) {
    return (ms - ms % 1000) / 1000;
}

function minutes(ms: number) {
    return (ms - ms % 60000) / 60000;
}

function hours(ms: number) {
    return (ms - ms % 36000000) / 36000000;
}

function days(ms: number) {
    return (ms - ms % 864000000) / 864000000;
}

function weeks(ms: number) {
    return (ms - ms % 604800000) / 604800000;
}

function months(ms: number) {
    return (ms - ms % 24192000000) / 24192000000;
}

function years(ms: number) {
    return (ms - ms % 290304000000) / 290304000000;
}

interface DateFromNowPropsInterface {
    date: Date;
}

class DateFromNow extends React.Component<DateFromNowPropsInterface, any> {
    componentDidMount() {
        setInterval(() => this.forceUpdate(), 1000);
    }

    render() {
        let timeAgo: string;
        let delta = Date.now() - Number(new Date(this.props.date));
        let num: number;

        if(delta > 290304000000) { // years
            
            num = years(delta);
            timeAgo = num.toString();
            timeAgo += " year";

        } else if(delta > 24192000000) { // moths

            num = months(delta);
            timeAgo = num.toString();
            timeAgo += " month";

        } else if(delta > 604800000) { // weeks

            num = weeks(delta);
            timeAgo = num.toString();
            timeAgo += " week";

        } else if(delta > 864000000) { // days

            num = days(delta);
            timeAgo = num.toString();
            timeAgo += " day";

        } else if(delta > 36000000) { // hours

            num = hours(delta);
            timeAgo = num.toString();
            timeAgo += " hour";

        } else if(delta > 60000) { // minutes

            num = minutes(delta);
            timeAgo = num.toString();
            timeAgo += " minute";

        } else { // seconds
            num = seconds(delta);

            timeAgo = num.toString();

            timeAgo += " second";
        }

        if(num !== 1) {
            timeAgo += "s";
        }

        return <span>{timeAgo}</span>
    }
}

export default DateFromNow;