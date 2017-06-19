import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import 'moment-duration-format';
import { Header, Item, Container } from 'semantic-ui-react';
import { selectors as mdbSelectors, actions as mdbActions } from '../../../../redux/modules/mdb';
import { LessonPart } from '../../../shapes';
import myimage from './image.png';

const getCollectionIdFromLesson = lesson => {
  if (lesson.collections) {
    return Object.values(lesson.collections)[0].id;
  }

  return null;
};

class RelevantParts extends Component {

  static propTypes = {
    fetchCollection: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    lesson: LessonPart.isRequired,
    parts: PropTypes.arrayOf(LessonPart)
  };

  static defaultProps = {
    parts: []
  };

  componentDidMount() {
    this.fetchCollectionIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchCollectionIfNeeded(nextProps);
  }

  fetchCollectionIfNeeded = (props) => {
    const { lesson, parts } = props;
    const collectionId = getCollectionIdFromLesson(lesson);
    if ((!parts || !parts.length) && collectionId !== null) {
      props.fetchCollection(collectionId);
    }
  };

  render() {
    const { lesson, parts } = this.props;
    const otherParts = parts.filter(part => part.id !== lesson.id);

    return (
      otherParts.length ? (
        <div style={{ marginTop: '50px' }}>
          <Header as="h3">Other parts from the same lesson</Header>
          <Item.Group divided link>
            {
              otherParts.slice(0, 3).map(part => (
                <Item key={part.id} onClick={() => this.props.push(`/lessons/${part.id}`)}>
                  <Item.Image src={myimage} size="tiny" />
                  <Item.Content >
                    <Header as="h4">Part {part.name_in_collection}</Header>
                    <Item.Meta><small>{moment.duration(part.duration, 'seconds').format('hh:mm:ss')}</small></Item.Meta>
                    <Item.Description>{part.name}</Item.Description>
                  </Item.Content>
                </Item>
              ))
            }
            <Item>
              <Item.Content>
                <Container fluid textAlign="right" as="a">more &raquo;</Container>
              </Item.Content>
            </Item>
          </Item.Group>
        </div>
      ) : <div />
    );
  }
}

export default connect(
  (state, ownProps) => {
    // collections should be id to object map
    const collectionId = getCollectionIdFromLesson(ownProps.lesson);

    return {
      parts: collectionId !== null
        ? mdbSelectors.getCollectionById(state.mdb)(collectionId).content_units
        : []
    };
  },
  {
    ...mdbActions,
    push
  }
)(RelevantParts);
