import React, { Component } from "react";

import Spinner from "../components/Spinner/Spinner";
import AttemptList from "../components/Attempts/AttemptList/AttemptList";
import AuthContext from "../context/auth-context";

class AttemptsPage extends Component {
  state = {
    isLoading: false,
    attempts: []
  };

  static contextType = AuthContext;  

  componentDidMount() {
    this.fetchAttempts();
  }

  fetchAttempts = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
              query {
                  attempts {
                      _id
                      createdAt
                      survey {
                        title
                        questions {
                          questionValue
                        }
                      }
                      answers                      
                  }
              }
          `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        const attempts = resData.data.attempts;
        this.setState({ attempts: attempts, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };
  render() {
    return (
      <>
      <div className="surveys__header">
          <h1> Attempts </h1>
        </div>
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.attempts.length === 0 ? (
          <div className="surveys__empty">
            <p> There are no attempts for now.</p>
          </div>
        ) : (
          <AttemptList attempts={this.state.attempts} />
        )}
      </>
    );
  }
}

export default AttemptsPage;
