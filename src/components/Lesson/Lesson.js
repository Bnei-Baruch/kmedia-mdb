import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Link } from 'react-router-dom';
import { Item, Container, Table, Button, Header, Segment, Grid, List, Menu } from 'semantic-ui-react';

import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { actions, selectors as lessonsSelectors } from '../../redux/modules/lessons';

import defaultImage from '../../images/image.png';

class LessonIndex extends React.Component {
  componentDidMount() {
    const { language, match } = this.props;
    this.askForData(match.params.id, language);
  }

  componentWillReceiveProps(nextProps) {
    const { language, match } = nextProps;
    const props               = this.props;

    if (language !== props.language || match.params.id !== props.match.params.id) {
      this.askForData(language, match.params.id);
    }
  }

  askForData(id, language) {
    this.props.fetchLesson({ id, language });
  }

  render() {
    return (
      <Segment>Lesson</Segment>
    );
  }
}

LessonIndex.propTypes = {
  match      : PropTypes.shape({
    isExact: PropTypes.bool.isRequired,
    params : PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    path   : PropTypes.string.isRequired,
    url    : PropTypes.string.isRequired,
  }).isRequired,
  language   : PropTypes.string.isRequired,
  lesson     : PropTypes.shape({
    id           : PropTypes.string,
    film_date    : PropTypes.string,
    content_type : PropTypes.string,
    content_units: PropTypes.arrayOf(
      PropTypes.shape({
        id         : PropTypes.string,
        name       : PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }),
  fetchLesson: PropTypes.func.isRequired,
};

LessonIndex.defaultProps = {
  lesson: {}
};

function mapStateToProps(state /* , ownProps */) {
  return {
    lesson  : lessonsSelectors.getLesson(state.lessons),
    language: settingsSelectors.getLanguage(state.settings),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonIndex);
