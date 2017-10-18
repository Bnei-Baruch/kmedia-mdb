import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import { formatError, isEmpty } from '../../../../helpers/utils';
import { ErrorSplash } from '../../../shared/Splash';
import * as shapes from '../../../shapes';

class Sources extends Component {

  static propTypes = {
    sources: PropTypes.object,
    t: PropTypes.func.isRequired,
    err: shapes.Error,
  };

  static defaultProps = {
    sources: {},
    err: null,
  };

  render() {
    const { t, sources, err } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (!isEmpty(sources)) {
      const keys = Object.keys(sources);
      if (keys.length === 1) {
        return (
          <Segment basic>
            <div>1</div>
            <div dangerouslySetInnerHTML={{ __html: sources[keys[0]] }} />
          </Segment>
        );
      } else if (keys.length > 1) {
        return (
          <Segment basic>
            <div>{keys.length}</div>
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
  }
}

export default translate()(Sources);
