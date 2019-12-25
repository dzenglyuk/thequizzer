import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

import './Auth.css';

class AuthPage extends Component {
    state = {
        isSignIn: true,
        error: null
    };
    
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.firstNEl = React.createRef();
        this.lastNEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isSignIn: !prevState.isSignIn};
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        let firstname;
        let lastname;
        if (!this.state.isSignIn) {
            firstname = this.firstNEl.current.value;
            lastname = this.lastNEl.current.value;
        }
        
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        token
                        username
                        tokenExpiration
                    }
                }
            `
        };

        if (!this.state.isSignIn) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}", username: "${firstname} ${lastname}"}) {
                            _id
                            email
                        }
                    }
                `
            };
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Incorrect email or password!');
            }
            return res.json();
        })
        .then(resData => {
            if (resData.data.login.token) {
                this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.username, resData.data.login.tokenExpiration);
            }
        })
        .catch(err => {
            this.setState({error: 'Incorrect email or password!'});
            console.log(err);
        });
    };

    render() {
        const userNameInput = (
            <div className="form-control username">
                <input type="text" id="firstname" placeholder="First Name" ref={this.firstNEl}></input>
                <input type="text" id="lastname" placeholder="Last Name" ref={this.lastNEl}></input>
            </div>);

        return (
            <form className="auth_form" onSubmit={this.submitHandler}>
                <h2> Let`s Get Started </h2>
                <h3> Enter your details below to continue </h3>
                {this.state.isSignIn ? null : userNameInput}
                <div className="form-control">
                    <input type="email" id="email" placeholder="Email" ref={this.emailEl}></input>
                </div>
                <div className="form-control">
                    <input type="password" id="password" placeholder="Password" ref={this.passwordEl}></input>
                </div>
                <div className="form-actions">
                    <button type="submit">
                        {this.state.isSignIn ? `Sign In` : `Sign Up`}
                    </button> 
                </div>
                <p className="auth__message">
                    {this.state.isSignIn ? `Not registered? ` : `Already registered? `}
                    <span className="auth__link" onClick={this.switchModeHandler}>
                        {this.state.isSignIn ? `Create an account` : `Sign In`}
                    </span>
                </p>
                {this.state.error && <p className="auth__error"> {this.state.error} </p>}
            </form>
        );
    }
}

export default AuthPage;