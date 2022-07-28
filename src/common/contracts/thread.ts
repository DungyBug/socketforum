import ITopic from "./topic";

export interface IThreadGroupPermissions {
    groupName: string;
    permissions: Array<string>;
}

export interface IBaseThread {
    title: string;
    permissions: Array<IThreadGroupPermissions>;
}

interface IThreadWithTopics extends IBaseThread {
    hasTopics: true;
    topics: Array<ITopic>;
}

interface IThreadWithoutTopics extends IBaseThread {
    hasTopics: false;
    topics: undefined;
}

type BaseThread<T extends boolean = boolean> = (
    T extends true
        ? IThreadWithTopics 
        : IThreadWithoutTopics
    ) & {
    children: Array<BaseThread>;
};

export default BaseThread;