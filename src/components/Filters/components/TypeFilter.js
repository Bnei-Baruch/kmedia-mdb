import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MT_VIDEO, MT_AUDIO, MT_IMAGE, MT_TEXT } from '../../../helpers/consts';
import FlatListFilter from './FlatListFilter';

export default class TypeFilter extends Component {
  render() {

    const options = [MT_TEXT, MT_AUDIO, MT_VIDEO, MT_IMAGE].map(x => ({ text: x, value: x, }));

    return <FlatListFilter name="publishers-filter" options={options} {...this.props} />;
  }
};
