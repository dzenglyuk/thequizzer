import React from "react";

import "./AttemptItem.css";

const AttemptItem = props => {
    return (
        <li className="attempt">
          <div className="attempt-info">
            <div className="attempt-info__name">
                <h1> Survey:<br/> {props.survey.title} </h1>
            </div>            
            <div className="attempt-info__from">
                <h4> Created at: {props.createdAt} </h4>
                <h4> From: {props.username} </h4>
            </div>    
          </div>
          <h3> Answers: </h3>
          <ol>
              {props.survey.questions.map((q, idx) => {
                  return (<li key={idx}> {q.questionValue} - {props.answers[idx]} </li>);
              })}
          </ol>
      </li>
  );
};

export default AttemptItem;
