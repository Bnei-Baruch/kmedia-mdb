import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { ErrorSplash, LoadingSplash } from '../shared/Splash';
import { formatError } from '../../helpers/utils';
import Filters from './Filters';

class Library extends Component {
  static propTypes = {
    source: PropTypes.arrayOf(PropTypes.string),
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    onFiltersChanged: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
    fetchIndex: PropTypes.func.isRequired,
  };

  static defaultProps = {
    source: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.fetchIndices(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.source !== this.props.source) {
      this.fetchIndices(nextProps);
    }
  }

  fetchIndices = (props) => {
    const source = props.source;
    if (source) {
      const [realSource] = props.source.slice(-1);
      props.fetchIndex(realSource);
    }
  };

  render() {
    const { source, wip, err, t, onFiltersChanged, onFiltersHydrated } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    } else if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (!source) {
      return (<div>
        <Filters onChange={onFiltersChanged} onHydrated={onFiltersHydrated} />
        <Segment>Please select Source from filters above</Segment>
      </div>);
    }

    const [realSource] = source.slice(-1);
    return (
      <div>
        {/* <Filters onChange={onFiltersChanged} onHydrated={onFiltersHydrated} /> */}
        <Segment>{realSource}</Segment>
      </div>);
  }
}

export default translate()(Library);
