import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List } from 'semantic-ui-react';

import { intersperse, tracePath } from '../../helpers/utils';
import * as shapes from '../shapes';

const LessonInfo = (props) => {
  const { lesson = {}, getSourceById, getTagById } = props;
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

LessonInfo.propTypes = {
  lesson: shapes.LessonPart,
  getSourceById: PropTypes.func.isRequired,
  getTagById: PropTypes.func.isRequired,
};

LessonInfo.defaultProps = {
  lesson: undefined,
};

export default LessonInfo;
