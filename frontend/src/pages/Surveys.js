import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import BackDrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import "./Surveys.css";
import SurveyList from "../components/Surveys/SurveyList/SurveyList";
import Spinner from "../components/Spinner/Spinner";

class SurveysPage extends Component {
  state = {
    creating: false,
    questionsNumber: 1,
    surveys: [],
    values: [""],
    types: ["bool"],
    isLoading: false,
    selectedSurvey: null,
    copied: false
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchSurveys();
  }

  fetchSurveys = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
              query {
                  surveys {
                      _id
                      title
                      description
                      questions {
                        questionValue
                      }
                      attempts {
                        _id
                      }
                      author {
                        _id
                        username
                      }                      
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
        const surveys = resData.data.surveys;
        this.setState({ surveys: surveys, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  startCreateSurveyHandler = () => {
    this.setState({ creating: true });
  };

  transformValues = arr => {
    return arr.map(a => `"${a}"`);
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
              mutation {
                  createSurvey(surveyInput: {title: "${title}", description: "${description}"},
                    questionInput: {values: [${this.transformValues(
                      this.state.values
                    )}], types: [${this.transformValues(this.state.types)}]}) {
                      _id
                      title
                      description
                      questions {
                        questionValue
                      }
                      attempts {
                        _id
                      }
                  }
              }
          `
    };

    const token = this.context.token;
    console.log(requestBody);
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
        this.setState(state => {
          const updatedSurveys = [
            ...state.surveys,
            {
              _id: resData.data.createSurvey._id,
              title: resData.data.createSurvey.title,
              description: resData.data.createSurvey.description,
              questions: resData.data.createSurvey.questions,
              attempts: resData.data.createSurvey.attempts,
              author: {
                _id: this.context.userId,
                username: this.context.username
              }
            }
          ];
          return { surveys: updatedSurveys };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, values: [""], types: ["bool"], selectedSurvey: null });
  };

  questionNumberHandler = event => {
    this.setState({ questionsNumber: Number(event.target.value) });
    let defaultTypes = [];
    for (let i = 0; i < event.target.value; i++) {
      defaultTypes = [...defaultTypes, this.state.types[i] || "bool"];
    }
    this.setState({ types: defaultTypes });
    this.forceUpdate();
  };

  questionValuesHandler = event => {
    let num = event.target.name - 1;
    let name = event.target.type === "text" ? "values" : "types";
    let newValue = event.target.value;
    let newValues;
    if (num >= this.state[name].length) {
      newValues = [...this.state[name], newValue];
    } else {
      newValues = this.state[name].map((oldValue, idx) => {
        return idx === num ? newValue : oldValue;
      });
    }
    this.setState({ [name]: newValues });
  };

  showDetailHandler = surveyId => {
    this.setState(state => {
      const selectedSurvey = state.surveys.find(s => s._id === surveyId);
      return { selectedSurvey: selectedSurvey };
    });
  };

  shareLinkHandler = () => {
    this.setState({copied: true});
    setTimeout(() => {
      this.setState({copied: false});  
    },1000);
  };

  render() {
    const createBtn = (
      <button className="btn" onClick={this.startCreateSurveyHandler}>
        Create Survey
      </button>
    );
    let generateQuestions = number => {
      let questionList = [];
      for (let i = 1; i <= number; i++) {
        questionList = [
          ...questionList,
          <div className="question-input" key={i}>
            <h4> {"Question " + i} </h4>
            <div className="form-control">
              <label htmlFor={"question-" + i}> Question </label>
              <input
                type="text"
                id={"question-" + i}
                name={i}
                onChange={this.questionValuesHandler}
              ></input>
            </div>
            <div className="form-control">
              <label htmlFor={"answer-type-" + i}> Type </label>
              <select
                id={"answer-type-" + i}
                name={i}
                onChange={this.questionValuesHandler}
                defaultValue={this.state.defaultType}
              >
                <option value="bool">Yes/No</option>
                <option value="open">Answer</option>
                <option value="range">Range</option>
              </select>
            </div>
          </div>
        ];
      }
      return questionList;
    };

    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedSurvey) && <BackDrop />}
        {this.state.creating && (
          <Modal
            title="Create New Survey"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <h3> General information: </h3>
              <div className="form-control">
                <label htmlFor="title"> Title </label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="description"> Description </label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                ></textarea>
              </div>
              <h3> Questions: </h3>
              <div className="form-control">
                <label htmlFor="questionNumber"> Questions number </label>
                <input
                  type="number"
                  id="questionNumber"
                  min="1"
                  max="20"
                  step="1"
                  value={this.state.questionsNumber}
                  onChange={this.questionNumberHandler}
                ></input>
              </div>
              {generateQuestions(this.state.questionsNumber)}
            </form>
          </Modal>
        )}
        {this.state.selectedSurvey && (
          <Modal
            title={this.state.selectedSurvey.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onCopy={this.shareLinkHandler}
            copyValue={`http://localhost:3000/form/${this.state.selectedSurvey._id}`}
            confirmText="Share"
            copied={this.state.copied}
          >
            <div className="details__modal">
              <div className="details__modal-info">
                <h1>{this.state.selectedSurvey.title}</h1>
                <p> {this.state.selectedSurvey.description} </p>
              </div>
              <div className="details__modal-stats">              
                <h3> {this.state.selectedSurvey.author.username} </h3>
                <h3> Attempts: {this.state.selectedSurvey.length || 0} </h3>
              </div>
            </div>
            <div className="question__list">
              <h2> Questions: </h2>
              <ol>
                {/* {console.log(this.state.selectedSurvey)} */}
                {this.state.selectedSurvey.questions.map((q, idx) => <li key={idx}> {q.questionValue} </li>)}
              </ol>
            </div>
          </Modal>
        )}
        <div className="surveys__header">
          <h1> Surveys </h1>
          {this.state.surveys.length !== 0 && createBtn}
        </div>
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.surveys.length === 0 ? (
          <div className="surveys__empty">
            <p> You have not created any surveys for now. </p>
            {createBtn}
          </div>
        ) : (
          <SurveyList
            surveys={this.state.surveys}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default SurveysPage;
