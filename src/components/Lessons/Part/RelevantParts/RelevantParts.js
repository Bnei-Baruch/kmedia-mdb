import React from 'react';
import moment from 'moment';
import 'moment-duration-format';
import { Link } from 'react-router-dom';
import { Container, Header, Item } from 'semantic-ui-react';

import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../shared/Splash';
import myimage from './image.png';

const RelevantParts = (props) => {
  const { lesson, fullLesson, wip, err } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text="Loading" subtext="Hold on tight..." />;
  }

  if (fullLesson && Array.isArray(fullLesson.content_units)) {
    const otherParts = fullLesson.content_units.filter(part => part.id !== lesson.id);

    return (
      otherParts.length ? (
        <div style={{ marginTop: '50px' }}>
          <Header as="h3">Other parts from the same lesson</Header>
          <Item.Group divided link>
            {
              otherParts.slice(0, 3).map(part => (
                <Item as={Link} key={part.id} to={`/lessons/part/${part.id}`}>
                  <Item.Image src={myimage} size="tiny" />
                  <Item.Content >
                    <Header as="h4">Part {fullLesson.ccuNames[part.id]}</Header>
                    <Item.Meta>
                      <small>{moment.duration(part.duration, 'seconds').format('hh:mm:ss')}</small>
                    </Item.Meta>
                    <Item.Description>{part.name}</Item.Description>
                  </Item.Content>
                </Item>
              ))
            }
            <Item>
              <Item.Content>
                <Container
                  fluid
                  as={Link}
                  textAlign="right"
                  to={`/lessons/full/${fullLesson.id}`}>
                  more &raquo;
                </Container>
              </Item.Content>
            </Item>
          </Item.Group>
        </div>
      ) : <div />
    );
  }

  return (
    <FrownSplash
      text="Couldn't find lesson"
      subtext={<span>Try the <Link to="/lessons">lessons list</Link>...</span>}
    />
  );
};

RelevantParts.propTypes = {
  lesson: shapes.LessonPart.isRequired,
  fullLesson: shapes.LessonCollection,
  wip: shapes.WIP,
  error: shapes.Error,
};

RelevantParts.defaultProps = {
  fullLesson: null,
  wip: false,
  error: null,
};

export default RelevantParts;
