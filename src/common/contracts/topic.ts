import IMessage from "./message";

export default interface ITopic {
    authorId: number;
    title: string;
    id: number;
    messages: Array<IMessage>;
}