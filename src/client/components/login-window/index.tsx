import React from 'react';

interface LoginWindowProps {
    onLogin: (name: string, email: string, password: string) => Promise<number>;
    onClose: () => void;
}

interface LoginWindowState {
    name: string;
    email: string;
    password: string;
    show: boolean;
    error: string;
}

class LoginWindow extends React.Component<LoginWindowProps, LoginWindowState> {
    state = {
        name: "",
        email: "",
        password: "",
        show: false,
        error: ""
    };

    componentDidMount() {
        this.setState((state) => {
            return {
                name: "",
                email: "",
                password: "",
                show: true
            };
        });
    }

    handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState((state) => {
            return {
                name: e.target.value,
                email: state.email,
                password: state.password,
                show: true
            };
        })
    }

    handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState((state) => {
            return {
                name: state.name,
                email: e.target.value,
                password: state.password,
                show: true
            };
        })
    }

    handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState((state) => {
            return {
                name: state.name,
                email: state.email,
                password: e.target.value,
                show: true
            };
        })
    }

    hideWindow() {
        this.setState(() => {
            return {
                name: "",
                email: "",
                password: "",
                show: false,
                error: ""
            };
        });
    }

    displayError() {
        this.setState((state) => {
            return {
                name: state.name,
                email: state.email,
                password: state.password,
                show: true,
                error: "Invalid credentials"
            };
        });
    }

    handleLoginClick() {
        this.props.onLogin(this.state.name, this.state.email, this.state.password).then(status => {
            switch(status) {
                case 0: { // Ok
                    this.hideWindow();
                    break;
                }
    
                case 1: { // Invalid credentials
                    this.displayError();
                    break;
                }
            }
        });
    }

    closeWindow() {
        this.props.onClose();
        this.hideWindow();
    }

    render() {
        return (<div className={this.state.show ? "window" : "invisible"}>
            <div className="close-button" onClick={() => this.closeWindow()}>&#10006;</div>
            <div className="window-title">Login</div>
            <br/>
            <table>
                <tbody>
                    <tr>
                        <td>Name:</td>
                        <td><input type="text" onChange={(e) => this.handleNameChange(e)} /></td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td><input type="email" onChange={(e) => this.handleEmailChange(e)} /></td>
                    </tr>
                    <tr>
                        <td>Password:</td>
                        <td><input type="password" onChange={(e) => this.handlePasswordChange(e)} /></td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <div className="error-text">{this.state.error}</div>
            <br/>
            <div className="login-div"><button onClick={() => this.handleLoginClick()} className="login">Login</button></div>
        </div>);
    }
};

export default LoginWindow;