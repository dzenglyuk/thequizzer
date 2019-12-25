import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import BackDrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context"; 
import "./Surveys.css";

class SurveysPage extends Component {
  state = {
    creating: false,
    questionsNumber: 1,
    values: [""],
    types: ["bool"]
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  startCreateSurveyHandler = () => {
    this.setState({creating: true});
  };
  
  transformValues = arr => {
    return arr.map(a => `"${a}"`);
  }; 

  modalConfirmHandler = () => {
    this.setState({creating: false});
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    // let questions = [];
    // for (let idx in this.state.values) {
    //   questions[idx] = {questionValue: this.state.values[idx], questionType: this.state.types[idx]};
    // }
        
    if (title.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    const requestBody = {
          query: `
              mutation {
                  createSurvey(surveyInput: {title: "${title}", description: "${description}"},
                    questionInput: {values: [${this.transformValues(this.state.values)}], types: [${this.transformValues(this.state.types)}]}) {
                      _id
                      
                  }
              }
          `
    };

  const token = this.context.token;
    console.log(requestBody);
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      }
  })
  .then(res => {
      if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
      }
      return res.json();
  })
  .then(resData => {
      console.log(resData);
  })
  .catch(err => {
      console.log(err);
  });
  };

  modalCancelHandler = () => {
    this.setState({creating: false});
  };

  questionNumberHandler = event => {
    this.setState({questionsNumber: Number(event.target.value)});
    let defaultTypes = [];
    for (let i = 0; i < event.target.value; i++) {
      defaultTypes = [...defaultTypes, this.state.types[i] || "bool"];
    }
    this.setState({types: defaultTypes});
    this.forceUpdate();
  };
  
  questionValuesHandler = (event) => {
    let num = event.target.name-1;
    let name = event.target.type === 'text' ? 'values' : 'types';
    let newValue = event.target.value;
    let newValues;
    if (num >= this.state[name].length) {
      newValues = [...this.state[name], newValue];
    } else {
      newValues = this.state[name].map((oldValue, idx) => {
      return idx === num ? newValue : oldValue;
      });
    }
    this.setState({[name]: newValues});
  };
  
  render() {
    const createBtn = <button className="btn" onClick={this.startCreateSurveyHandler}> Create Survey </button>;
    let generateQuestions = number => {
      let questionList = [];
      for (let i = 1; i <= number; i++) {
        questionList = [...questionList, (
          <div className="question-input" key={i}>
            <h4> {"Question " + i} </h4>
            <div className="form-control">
              <label htmlFor={"question-" + i}> Question </label>
              <input type="text" id={"question-" + i} name={i} onChange={this.questionValuesHandler}></input>
            </div>
            <div className="form-control">
              <label htmlFor={"answer-type-" + i}> Type </label>
              <select id={"answer-type-" + i} name={i} onChange={this.questionValuesHandler} defaultValue={this.state.defaultType}>
                <option value="bool">Yes/No</option>
                <option value="open">Answer</option>
                <option value="range">Range</option>
              </select>
            </div>
          </div>
        )];
      }
      return questionList;
    };

    return (
      <React.Fragment>
        {this.state.creating && <BackDrop />}
        {this.state.creating && (
          <Modal title="Create New Survey" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            <form>
              <h3> General information: </h3>
              <div className="form-control">
                <label htmlFor="title"> Title </label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="description"> Description </label>
                <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
              </div>
              <h3> Questions: </h3>
              <div className="form-control">
                <label htmlFor="questionNumber"> Questions number </label>
                <input type="number" id="questionNumber" min="1" max="20" step="1" value={this.state.questionsNumber} onChange={this.questionNumberHandler}></input>
              </div>
              {generateQuestions(this.state.questionsNumber)}
            </form>
          </Modal>
        )}
        <div className="surveys__header">
          <h1> My Surveys </h1>
          {createBtn}
        </div>
        <div className="surveys__empty">
          <p> You have not created any surveys for now. </p>
          {createBtn}
        </div>
      </React.Fragment>
    );
  }
}

export default SurveysPage;
