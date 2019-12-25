import React, { Component } from "react";

import QuestionList from '../components/Questions/QuestionList/QuestionList';
import Spinner from '../components/Spinner/Spinner';
import './Form.css';

class FormPage extends Component {
  state = {
    survey: null,
    answers: [],
    sended: false
  };

  componentDidMount() {
    this.fetchSurvey();
  }

  answerValuesHandler = event => {
    let num = +event.target.name;
    let newValue = event.target.value;
    let newValues;
    if (num >= this.state.answers.length) {
      newValues = [...this.state.answers, newValue];
    } else {
      newValues = this.state.answers.map((oldValue, idx) => {
        return idx === num ? newValue : oldValue;
      });
    }
    this.setState({ answers: newValues });
  }; 

  fetchSurvey = () => {
    const requestBody = {
      query: `
                  query {
                      survey(surveyId: "${this.props.match.params.surveyId}") {
                          _id
                          title
                          description
                          questions {
                            questionValue
                            questionType
                          }
                          author {
                            _id
                            username
                          }                      
                      }
                  }
              `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          this.setState({ survey: "undefined" });
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ survey: resData.data.survey });
      })
      .catch(err => {
        console.log(err);
      });
  };

  transformValues = arr => {
    return arr.map(a => `"${a}"`);
  };

  sendForm = () => {
    const requestBody = {
        query: `
        mutation {
            makeAttempt(attemptInput: {
                survey: "${this.state.survey._id}",
                createdAt: "${new Date()}",
                answers: [${this.transformValues(this.state.answers)}]}) {
                _id
                createdAt
            }
        }
    `
      };
      console.log(requestBody);
      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",

        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
          }
          return res.json();
        })
        .then(resData => {
          this.setState({sended: true, survey: null});
        })
        .catch(err => {
          console.log(err);
        });
  };

  render() {
    return (
        <>
        {(!this.state.survey && !this.state.sended) && <Spinner />}
        {this.state.survey === "undefined" && (
          <h2 className="no-survey"> Sorry, no such survey... </h2>
        )}
        {this.state.survey && (
            <div className="form__container">
                <h1 className="form__title"> {this.state.survey.title} </h1>
                <p className="form__description"> {this.state.survey.description} </p>
                <QuestionList questions={this.state.survey.questions} answerHandler={this.answerValuesHandler}/>
                <div className="submit-form">
                    <button onClick={this.sendForm} className="btn"> Send form </button>
                </div>
            </div>
        )}
        {this.state.sended && (
            <div className="form__container">
            <h1> Thank you! </h1>
            </div>
        )}
        </>
    );
  }
}

export default FormPage;
