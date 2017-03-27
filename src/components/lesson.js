import React from 'react';
import { Header } from 'semantic-ui-react';
import Fetcher from './fetch';

class LessonView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: null
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const lessonId  = match.params.id;

    Fetcher(`/lesson/${lessonId}.json`)
      .then(response => response.json())
      .then(lesson => this.setState({ lesson }))
      .catch(ex => console.log(`get /lesson/${lessonId}.json failed`, ex));
  }

  render() {
    return (
      <Lesson lesson={this.state.lesson} />
    );
  }
}

LessonView.propTypes = {
  match: React.PropTypes.shape({
    isExact: React.PropTypes.bool,
    params : React.PropTypes.object,
    path   : React.PropTypes.string,
    url    : React.PropTypes.string,
  }).isRequired
};

const Lesson = ({ lesson }) => (
  lesson ?
    (
      <div>
        <Header as="h3">Single lesson {lesson.uid}</Header>
        <p>{lesson.description}</p>
      </div>
    )
    : <div />
);

Lesson.propTypes = {
  lesson: React.PropTypes.shape({
    uid        : React.PropTypes.string,
    description: React.PropTypes.string
  })
};

Lesson.defaultProps = {
  lesson: null
};

export default LessonView;
