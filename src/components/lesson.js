import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { FetchContentUnit } from './fetch';
import { Link } from 'react-router-dom';

class LessonView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson  : null,
      language: 'ru'
    };
  }

  handleDataFetch = (params, lesson) => {
    this.setState({ lesson });
  }

  componentDidMount() {
    const { match } = this.props;

    FetchContentUnit(match.params.id, {
      language: this.state.language,
    }, this.handleDataFetch);
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

const duration = (value) => {
  const days    = Math.floor(value / 86400);
  value %= 86400;
  const hours   = Math.floor(value / 3600);
  value %= 3600;
  const minutes = Math.floor(value / 60);
  value %= 60;
  const seconds = value;

  return (days ? `${days} d ` : '') + (hours ? `${hours}:` : '00:') + (minutes ? `${minutes}:` : '00') + (seconds ? seconds : '00')
};

const Lesson = ({ lesson }) => (
  lesson ?
    (
      <Segment>
        <Header as="h3">{lesson.name}</Header>
        <p>Content Type: {lesson.content_type}</p>
        <p>Duration: {duration(lesson.duration)}</p>
        <p>Filmed: {lesson.film_date}</p>
        <Files files={lesson.files} />
      </Segment>
    )
    : <h3>Loading...</h3>
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

const Files = ({ files }) => {
  const content = files.map((file) => <File key={file.id} file={file} />);

  return (
    <Segment>
      Files:
      { content }
    </Segment>
  )
}

const File = ({ file }) =>
  <Segment>
    <Header as="h5">{file.name}</Header>
    <div>{file.language}, {file.size} bytes, {file.type}, {file.mimetype}&nbsp;
      <Link to={file.url}><span>Listen</span></Link> <Link to={file.download_url}>Download</Link>
    </div>
  </Segment>
;

export default LessonView;
