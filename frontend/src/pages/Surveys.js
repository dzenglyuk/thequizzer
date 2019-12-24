import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import BackDrop from "../components/Backdrop/Backdrop";
import "./Surveys.css";

class SurveysPage extends Component {
  state = {
    creating: false,
    questionsNumber: 1
  };

  startCreateSurveyHandler = () => {
    this.setState({creating: true});
  };

  modalConfirmHandler = () => {
    this.setState({creating: false});
  };

  modalCancelHandler = () => {
    this.setState({creating: false});
  };

  questionNumberHandler = event => {
    this.setState({questionsNumber: Number(event.target.value)});
    this.forceUpdate();
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
              <label htmlFor="question"> Question </label>
              <input type="text" id="question"></input>
            </div>
            <div className="form-control">
              <label htmlFor={"answer-type-" + i}> Type </label>
              <select id={"answer-type-" + i}>
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
                <input type="text" id="title"></input>
              </div>
              <div className="form-control">
                <label htmlFor="description"> Description </label>
                <textarea id="description" rows="4"></textarea>
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
