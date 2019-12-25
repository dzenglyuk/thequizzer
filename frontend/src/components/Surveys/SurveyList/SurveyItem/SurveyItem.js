import React from "react";
import { Link } from "react-router-dom";
import "./SurveyItem.css";

const SurveyItem = props => (
  <li key={props.surveyId} className="survey__list-item">
    <div className="list-item__info">
      <h1> {props.title} </h1>
      <h3> {props.author.username} </h3>
      <h3> Attempts: {props.attempts.length || 0} </h3>
    </div>
    <div className="list-item__actions">
      <button className="btn" onClick={props.onDetail.bind(this, props.surveyId)}>
        View Details
      </button>
      {props.userId !== props.author._id && (
        <Link to={`/form/${props.surveyId}`} className="btn">Make Attempt</Link>
      )}
    </div>
  </li>
);

export default SurveyItem;
