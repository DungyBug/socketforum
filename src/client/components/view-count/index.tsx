import React from 'react';

interface IViewCountProps {
    count: number;
}

const ViewCount: React.FunctionComponent<IViewCountProps> = ({ count }) => (
    <div>View count: {count}</div>
)

export default ViewCount;