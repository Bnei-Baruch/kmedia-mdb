import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import { intersperse, tracePath } from '../../../helpers/utils';
import { selectors as sourcesSelectors } from '../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../redux/modules/tags';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

class Info extends Component {

  static propTypes = {
    unit: shapes.ProgramChapter,
    getSourceById: PropTypes.func.isRequired,
    getTagById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const { unit = {}, getSourceById, getTagById, t } = this.props;
    const { name, film_date: filmDate, sources, tags }   = unit;

    const tagLinks = Array.from(intersperse(
      (tags || []).map((x) => {
        const tag = getTagById(x);
        if (!tag) {
          return '';
        }

        const path    = tracePath(tag, getTagById);
        const display = path.map(y => y.label).join(' > ');
        return <Link key={x} to={`/tags/${x}`}>{display}</Link>;
      }), ', '));

    const sourcesLinks = Array.from(intersperse(
      (sources || []).map((x) => {
        const source = getSourceById(x);
        if (!source) {
          return '';
        }
        const path    = tracePath(source, getSourceById);
        const display = path.map(y => y.name).join(' > ');
        return <Link key={x} to={`/sources/${x}`}>{display}</Link>;
      }), ', '));

    return (
      <div>
        <Header as="h1">
          <small className="text grey">{t('values.date', { date: new Date(filmDate) })}</small><br />
          {name}
        </Header>
        <List>
          {
            tagLinks.length === 0 ?
              null :
              <List.Item>
                <strong>{t('programs.part.info.tags')}:</strong>
                &nbsp;{tagLinks}
              </List.Item>
          }
          {
            sourcesLinks.length === 0 ?
              null :
              <List.Item>
                <strong>{t('programs.part.info.sources')}:</strong>
                &nbsp;{sourcesLinks}
              </List.Item>
          }
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
