import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header, List } from 'semantic-ui-react';

import { intersperse, tracePath } from '../../../helpers/utils';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tags } from '../../../redux/modules/tags';
import * as shapes from '../../shapes';

class Info extends Component {

  static propTypes = {
    lesson: shapes.LessonPart,
    getSourceById: PropTypes.func.isRequired,
    getTagById: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lesson: undefined,
  };

  render() {
    const { lesson = {}, getSourceById, getTagById } = this.props;
    const { name, film_date, sources, tags }         = lesson;

    const tagLinks = Array.from(intersperse(
      (tags || []).map((x) => {
        const tag = getTagById(x);
        if (!tag) {
          return '';
        }

        const path    = tracePath(tag, getTagById);
        const display = path.map(y => y.label).join(' - ');
        return <Link key={x} to={`/tags/${x}`}>{display}</Link>;
      }), ', '));

    const sourcesLinks = Array.from(intersperse(
      (sources || []).map((x) => {
        const source = getSourceById(x);
        if (!source) {
          return '';
        }
        const path    = tracePath(source, getSourceById);
        const display = path.map(y => y.name).join('. ');
        return <Link key={x} to={`/sources/${x}`}>{display}</Link>;
      }), ', '));

    return (
      <div>
        <Header as="h3">
          <span className="text grey">{film_date}</span><br />
          {name}
        </Header>
        <List>
          {
            tagLinks.length === 0 ?
              null :
              <List.Item>
                <strong>Tags:</strong> {tagLinks}
              </List.Item>
          }
          {
            sourcesLinks.length === 0 ?
              null :
              <List.Item>
                <strong>Sources:</strong> {sourcesLinks}
              </List.Item>
          }

          <List.Item><strong>Related to Event:</strong> <a href="">World Israel Congress 2016</a></List.Item>
        </List>
      </div>
    );
  };
}

export default connect(
  (state, ownProps) => ({
    // NOTE (yaniv -> ido): using selectors this way will always make the component rerender
    // since sources.getSourcesById(state) !== sources.getSourcesById(state) for every state
    getSourceById: sources.getSourceById(state.sources),
    getTagById: tags.getTagById(state.tags),
  })
)(Info);
