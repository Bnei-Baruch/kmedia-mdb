import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';

import { FetchContentUnit } from './fetch';

class LessonView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson  : null,
      language: 'ru'
    };
  }

  componentDidMount() {
    const { match } = this.props;

    FetchContentUnit(match.params.id, {
      language: this.state.language,
    }, this.handleDataFetch);
  }

  handleDataFetch = (params, lesson) => {
    this.setState({ lesson });
  }

  render() {
    return (
      <Lesson lesson={this.state.lesson} />
    );
  }
}

LessonView.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params : PropTypes.object,
    path   : PropTypes.string,
    url    : PropTypes.string,
  }).isRequired
};

const duration = (source) => {
  let value     = source;
  const days    = Math.floor(value / 86400);
  value %= 86400;
  const hours   = Math.floor(value / 3600);
  value %= 3600;
  const minutes = Math.floor(value / 60);
  value %= 60;

  return (days ? `${days} d ` : '') + (hours ? `${hours}:` : '00:') + (minutes ? `${minutes}:` : '00') + (value || '00');
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
  lesson: PropTypes.shape({
    uid        : PropTypes.string,
    description: PropTypes.string
  })
};

Lesson.defaultProps = {
  lesson: null
};

const Files = ({ files }) => {
  const content = files.map(file => <File key={file.id} file={file} />);

  return (
    <Segment>
      Files:
      { content }
    </Segment>
  );
};

Files.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  }))
};

Files.defaultProps = {
  files: []
};

const File = ({ file }) =>
  <Segment>
    <Header as="h5">{file.name}</Header>
    <div>{file.language}, {file.size} bytes, {file.type}, {file.mimetype}&nbsp;
      <Link to={file.url}><span>Listen</span></Link> <Link to={file.download_url}>Download</Link>
    </div>
  </Segment>
;

File.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    language: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
    mimetype: PropTypes.string,
    url: PropTypes.string,
    download_url: PropTypes.string,
  }).isRequired
};

export default LessonView;
