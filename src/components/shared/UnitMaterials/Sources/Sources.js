import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import { formatError } from '../../../../helpers/utils';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import * as shapes from '../../../shapes';

const Sources = (props) => {
  const { t, sources, err, wip } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (sources) {
    const keys = Object.keys(sources);
    if (keys.length === 1) {
      return (
        <Segment basic>
          <div dangerouslySetInnerHTML={{ __html: sources[keys[0]] }} />
        </Segment>
      );
    } else if (keys.length > 1) {
      return (
        <Segment basic>
          {
            keys.map(key => (
              <div key={key} dangerouslySetInnerHTML={{ __html: sources[key] }} />
            ))
          }
        </Segment>
      );
    }
  }

  return (<Segment basic>NO SOURCES</Segment>);
};

Sources.propTypes = {
  // sources: PropTypes.object,
  t: PropTypes.func.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
};

Sources.defaultProps = {
  sources: {},
  wip: false,
  err: null,
};

export default translate()(Sources);
