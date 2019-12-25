import React from "react";

import "./QuestionItem.css";

const QuestionItem = props => {
    let input;
    switch(props.type) {
        case 'bool':
            input = (
                <div>
                    <input onChange={props.answerHandler} type="radio" name={props.name} value="Yes"/>Yes
                    <input onChange={props.answerHandler} type="radio" name={props.name} value="No"/>No
                </div>
            );
            break;
        case 'open':
            input = (
                <div className="form-control">
                    <input onChange={props.answerHandler} type="text" name={props.name} placeholder="Type your answer here..."></input>
                </div>
            );
            break;
        case 'range':
            input = (
                <div className="form-control__range">
                    <span>Totally disagree</span>
                    <input onChange={props.answerHandler} className="slider" type="range" min="0" max="10" defaultValue="5" name={props.name}></input>
                    <span> Totally agree </span>
                </div>
            );
            break;
        default:
            console.error('Unknown question type');    
    }

    return (
    <li>
      <h2> {props.value} </h2>
      {input}
    </li>
  );
};

export default QuestionItem;
