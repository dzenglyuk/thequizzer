import React from "react";

import QuestionItem from "./QuestionItem/QuestionItem";
import "./QuestionList.css";

const QuestionList = props => {
  const questions = props.questions.map((question, idx) => {
    return (
      <QuestionItem
        key={idx}
        name={idx}
        value={question.questionValue}
        type={question.questionType}
        answerHandler={props.answerHandler}
      />
    );
  });
  return <ul className="questions">{questions}</ul>;
};

export default QuestionList;
