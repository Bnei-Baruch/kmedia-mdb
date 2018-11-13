import React, { Component } from 'react';

import { MT_VIDEO, MT_AUDIO, MT_IMAGE, MT_TEXT } from '../../../helpers/consts';
import FlatListFilter from './FlatListFilter';

const options = [MT_TEXT, MT_AUDIO, MT_VIDEO, MT_IMAGE].map(x => ({ text: x, value: x, }));

export default class MediaTypeFilter extends Component {
  render() {
    return <FlatListFilter name="publishers-filter" options={options} {...this.props} />;
  }
}
