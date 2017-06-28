import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Menu } from 'semantic-ui-react';
import { LessonPart } from '../../../shapes';

export default class PartsList extends Component {

  static propTypes = {
    parts: PropTypes.arrayOf(LessonPart),
  };

  static defaultProps = {
    parts: []
  };

  render() {
    const { parts } = this.props;

    return (
      parts.length ? (
        <Menu vertical fluid pointing color='blue'>
          {
            parts.map(part => (
              <Menu.Item key={part.id}>
                  {part.name_in_collection} -
                  {part.name} -
                  {moment.duration(part.duration, 'seconds').format('hh:mm:ss')}
              </Menu.Item>
            ))
          }
        </Menu>
      ) : <div />
    );
  }
}
