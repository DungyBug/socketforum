import React from 'react';
import { sendCommand } from '../../utils/command';

interface CreateTopicWindowProps {
    onCreate: (title: string, message: string) => void;
    onClose: () => void;
};

interface CreateTopicWindowState {
    title: string;
    message: string;
    show: boolean;
};

class CreateTopicWindow extends React.Component<CreateTopicWindowProps, CreateTopicWindowState> {
    state = {
        title: "",
        message: "",
        show: true
    };

    handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState((state) => ({
            title: e.target.value,
            message: state.message
        }));
    }

    handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState((state) => ({
            title: state.title,
            message: e.target.value
        }));
    }

    handleCreateClick = () => {
        sendCommand("create_topic", {
            title: this.state.title,
            message: this.state.message
        });

        this.props.onCreate(this.state.title, this.state.message);
        this.hideWindow();
    }

    hideWindow() {
        this.setState(() => {
            return {
                title: "",
                message: "",
                show: false,
            };
        });
    }
    
    closeWindow() {
        this.props.onClose();
        this.hideWindow();
    }

    render() {
        return (
            <div className={this.state.show ? "window" : "invisible"}>
                <div className="close-button" onClick={() => this.closeWindow()}>&#10006;</div>
                <div className="window-title">Create topic</div>
                <br/>
                <table>
                    <tbody>
                        <tr>
                            <td>Title:</td>
                            <td><input type="text" onChange={this.handleTitleChange} /></td>
                        </tr>
                        <tr>
                            <td>Message:</td>
                            <td><textarea onChange={this.handleMessageChange} /></td>
                        </tr>
                    </tbody>
                </table>
                <br/>
                <div className="login-div"><button onClick={this.handleCreateClick} className="login">Create</button></div>
            </div>
        );
    }
};

export { CreateTopicWindow };