import React from 'react';
import PropTypes from 'prop-types';
import { Grid, List, ListItem } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { CT_LESSON_PART } from '../../helpers/consts';
import * as shapes from '../shapes';

const renderPart = part => (
  <Grid.Row key={part.id}>
    <Grid.Column width={2}><strong>{part.film_date}</strong></Grid.Column>
    <Grid.Column width={14}>
      <List divided relaxed="very">
        <ListItem>
          <Link to={`/lessons/${part.id}`}> {part.name} </Link>
          <br />{part.description}
        </ListItem>
      </List>
    </Grid.Column>
  </Grid.Row>
);

const renderCollection = (collection) => {
  const units = collection.content_units.map(unit => (
    <Link to={`/lessons/${unit.id}`} key={`u-${unit.id}`}>{unit.name}<br />{unit.description}</Link>
  ));

  return (
    <Grid.Row key={`l-${collection.id}`}>
      <Grid.Column width={2}><strong>{collection.film_date}</strong></Grid.Column>
      <Grid.Column width={14}>
        <List divided relaxed="very">
          <ListItem><strong>{collection.content_type}</strong></ListItem>
          {units}
        </List>
      </Grid.Column>
    </Grid.Row>
  );
};

const LessonsList = ({ lessons }) => {
  if (!lessons) {
    return (<Grid columns={2} celled="internally" />);
  }

  return (
    <Grid columns={2} celled="internally">
      {
        lessons.map(x => (x.content_type === CT_LESSON_PART ? renderPart(x) : renderCollection(x)))
      }
    </Grid>
  );
};

LessonsList.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
};

LessonsList.defaultProps = {
  lessons: []
};

export default LessonsList;
