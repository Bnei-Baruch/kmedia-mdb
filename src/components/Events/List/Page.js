import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, LoadingSplash } from '../../shared/Splash';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import Filters from './Filters';
import List from './List';

class EventsPage extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.EventCollection),
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  render() {
    const { items, wip, err, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    return (
      <div>
        <Filters />
        <Container className="padded">
          <ResultsPageHeader pageNo={1} pageSize={1000} total={items.length} />
          <Divider fitted />
          <List items={items} t={t}/>
        </Container>
      </div>
    );
  }

}

export default translate()(EventsPage);
