import React from "react";

import SurveyItem from "./SurveyItem/SurveyItem";
import "./SurveyList.css";

const SurveyList = props => {
  const surveys = props.surveys.map(survey => {
    return (
      <SurveyItem
        key={survey._id}
        surveyId={survey._id}
        title={survey.title}
        author={survey.author}
        attempts={survey.attempts}
        userId={props.authUserId}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="survey__list">{surveys}</ul>;
};

export default SurveyList;
