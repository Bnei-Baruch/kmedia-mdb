import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, List } from 'semantic-ui-react';

import { intersperse, tracePath } from '../../../helpers/utils';
import { stringify as urlSearchStringify } from '../../../helpers/url';
import { selectors as sourcesSelectors } from '../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../redux/modules/tags';
import { filtersTransformer } from '../../../filters';
import * as shapes from '../../shapes';

class Info extends Component {

  static propTypes = {
    lesson: shapes.LessonPart,
    getSourceById: PropTypes.func.isRequired,
    getTagById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lesson: undefined,
  };

  render() {
    const { lesson = {}, getSourceById, getTagById, t } = this.props;
    const { name, film_date: filmDate, sources, tags }  = lesson;

    const tagLinks = Array.from(intersperse(
      (tags || []).map((x) => {
        const tag = getTagById(x);
        if (!tag) {
          return '';
        }

        const path    = tracePath(tag, getTagById);
        const display = path.map(y => y.label).join(' - ');
        const query   = filtersTransformer.toQueryParams(
          [{ name: 'topics-filter', values: [x] }]);

        return <Link key={x} to={{ pathname: '/lessons', search: urlSearchStringify(query) }}>{display}</Link>;
      }), ', '));

    const sourcesLinks = Array.from(intersperse(
      (sources || []).map((x) => {
        const source = getSourceById(x);
        if (!source) {
          return '';
        }

        const path    = tracePath(source, getSourceById);
        const display = path.map(y => y.name).join('. ');
        const query   = filtersTransformer.toQueryParams(
          [{ name: 'sources-filter', values: [path.map(y => y.id)] }]);

        return <Link key={x} to={{ pathname: '/lessons', search: urlSearchStringify(query) }}>{display}</Link>;
      }), ', '));

    return (
      <div>
        <Header as="h3">
          <span className="text grey">{t('values.date', { date: new Date(filmDate) })}</span><br />
          {name}
        </Header>
        <List>
          {
            tagLinks.length === 0 ?
              null :
              <List.Item>
                <strong>{t('lessons.part.info.tags')}:</strong>
                &nbsp;{tagLinks}
              </List.Item>
          }
          {
            sourcesLinks.length === 0 ?
              null :
              <List.Item>
                <strong>{t('lessons.part.info.sources')}:</strong>
                &nbsp;{sourcesLinks}
              </List.Item>
          }

          <List.Item>
            <strong>{t('lessons.part.info.related-event')}:</strong>
            &nbsp;<a href="">World Israel Congress 2016</a>
          </List.Item>
        </List>
      </div>
    );
  }
}

export default connect(
  state => ({
    // NOTE (yaniv -> ido): using selectors this way will always make the component rerender
    // since sources.getSourcesById(state) !== sources.getSourcesById(state) for every state
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
  })
)(Info);
