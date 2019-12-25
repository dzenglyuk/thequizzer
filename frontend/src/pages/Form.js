import React, { Component } from 'react';

class FormPage extends Component {
    state = {
        survey: null
    }

    componentDidMount() {
        this.fetchSurvey();
    }
    
      fetchSurvey = () => {
        const requestBody = {
          query: `
                  query {
                      survey(surveyId: "${this.props.match.params.surveyId}") {
                          _id
                          title
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
            this.setState({ isLoading: false });
          });
      };

    render() {
        return (
            <>
            <h1> The Form page! </h1>
            {!this.state.survey && <p> Loading... </p>}
            {this.state.survey === "undefined" && (
                <h2> Sorry, no such survey... </h2>
            )}
            {this.state.survey && (
                <h2> {this.state.survey.title} </h2>
            )}
            </>
        );
    }
}

export default FormPage;