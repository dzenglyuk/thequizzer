import React from "react";

import AttemptItem from "./AttemptItem/AttemptItem";
import "./AttemptList.css";

const AttemptList = props => {
  const attempts = props.attempts.map((attempt, idx) => {
    return (
      <AttemptItem
        key={idx}
        createdAt={attempt.createdAt}
        survey={attempt.survey}        
        username={"Anonymous"}
        answers={attempt.answers}
      />
    );
  });
  return <ul className="attempts">{attempts}</ul>;
};

export default AttemptList;
