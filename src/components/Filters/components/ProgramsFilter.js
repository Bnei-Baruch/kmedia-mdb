import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { strCmp } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/programs';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import HierarchicalFilter from './HierarchicalFilter';

const cmpFn = (a, b) => {
  const x = a[0];
  const y = b[0];

  if (x === 'other') {
    return 1;
  }

  if (y === 'other') {
    return -1;
  }

  return strCmp(x, y);
};

class ProgramsFilter extends Component {
  static propTypes = {
    programs: PropTypes.arrayOf(shapes.ProgramCollection).isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.programs !== nextProps.programs) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { programs, t } = props;

    let byGenre = programs.reduce((acc, val) => {
      (val.genres || ['other']).forEach((genre) => {
        const v = acc[genre];
        if (v) {
          v.push(val);
        } else {
          acc[genre] = [val];
        }
      });

      return acc;
    }, {});

    byGenre = Object.entries(byGenre);
    byGenre.sort(cmpFn);
    byGenre.forEach(x => x[1].sort((a, b) => strCmp(a.name, b.name)));

    return [
      {
        value: 'root',
        text: t('filters.programs-filter.all'),
        children: byGenre.map(([genre, items]) => ({
          ...this.buildNode(genre, t(`programs.genres.${genre}`)),
          children: items.map(x => this.buildNode(x.id, x.name || 'NO NAME'))
        }))
      }
    ];
  };

  buildNode = (value, text) => ({ value, text });

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="programs-filter" tree={tree} {...this.props} />;
  }
}

export default connect(
  (state) => {
    const cIDs = selectors.getPrograms(state.programs);
    return {
      programs: (cIDs || []).map(x => mdb.getDenormCollection(state.mdb, x)),
    };
  },
)(ProgramsFilter);
