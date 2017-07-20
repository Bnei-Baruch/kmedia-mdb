import React from 'react';
import PropTypes from 'prop-types';
import 'moment-duration-format';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import FullVideoBox from './FullVideoBox';

const FullLesson = (props) => {
  const { fullLesson, wip, err, language } = props;

  if (err) {
    return <ErrorSplash text="Server Error" subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text="Loading" subtext="Hold on tight..." />;
  }

  if (fullLesson) {
    return (
      <Grid.Column width={16}>
        <Grid>
          <FullVideoBox fullLesson={fullLesson} language={language} />
        </Grid>
      </Grid.Column>
    );
  }

  return (
    <FrownSplash
      text="Couldn't find lesson"
      subtext={<span>Try the <Link to="/lessons">lessons list</Link>...</span>}
    />
  );
};

FullLesson.propTypes = {
  language: PropTypes.string.isRequired,
  fullLesson: shapes.LessonCollection,
  wip: shapes.WIP,
  error: shapes.Error,
};

FullLesson.defaultProps = {
  fullLesson: null,
  wip: false,
  error: null,
};

export default FullLesson;
