import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, LoadingSplash } from '../../shared/Splash';
import SectionHeader from '../../shared/SectionHeader';
import Pagination from '../../pagination/Pagination';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import Filters from './Filters';
import List from './List';

class LecturesPage extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.Lecture),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChanged: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  render() {
    const { items,
            wip,
            err,
            pageNo,
            total,
            pageSize,
            language,
            t,
            onPageChange,
            onFiltersChanged,
            onFiltersHydrated } = this.props;

    let content;

    if (err) {
      content = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    } else if (wip) {
      content = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else {
      content = (
        <div>
          <Container className="padded">
            <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
            <List items={items} />
          </Container>
          <Divider fitted />
          <Container className="padded" textAlign="center">
            <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={total}
              language={language}
              onChange={onPageChange}
            />
          </Container>
        </div>
      );
    }

    return (
      <div>
        <SectionHeader section="lectures" />
        <Divider fitted />
        <Filters onChange={onFiltersChanged} onHydrated={onFiltersHydrated} />
        {content}
      </div>
    );
  }

}

export default translate()(LecturesPage);
