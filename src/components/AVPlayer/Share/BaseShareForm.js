import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';

import { toHumanReadableTime } from '../../../helpers/time';
import { getQuery, stringify } from '../../../helpers/url';

class BaseShareForm extends React.Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    onSliceChange: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSliceChange: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      start: undefined,
      end: undefined,
      url: this.getUrl(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      const { start, end } = this.state;
      this.setState({ ...this.state, url: this.getUrl(nextProps, start, end) });
    }
  }

  setStart(e, data) {
    const { media, onSliceChange } = this.props;
    const duration                 = Math.max(media.duration, 0);

    let start = data && data.value ?
      this.colonStrToSecond(data.value) :
      Math.round(media.currentTime);
    start     = Math.min(start, duration);

    let end = this.state.end || 0;
    end     = end > start ? end : duration;

    const state = { start, end };
    if (!end) {
      delete state.end;
      end = null;
    }

    this.setState({ ...state, url: this.getUrl(this.props, start, end) });
    onSliceChange(start, end);
  }

  setEnd(e, data) {
    const { media, onSliceChange } = this.props;
    const duration                 = Math.max(media.duration, 0);

    let end = data && data.value !== undefined ?
      this.colonStrToSecond(data.value) :
      Math.round(media.currentTime);
    end     = Math.min(end, duration);

    let start = this.state.start || 0;
    if (end) {
      start = this.state.start < end ? start : 0;
    }

    this.setState({ end, start, url: this.getUrl(this.props, start, end) });
    onSliceChange(start, end);
  }

  // eslint-disable-next-line class-methods-use-this
  getUrl(props, start, end) {
    const { protocol, hostname, port, pathname } = window.location;

    const { item } = props;
    const shareUrl = `${protocol}://${hostname}${port ? `:${port}` : ''}${item.shareUrl || pathname}`;

    const q = getQuery(window.location);

    // Set start end points
    q.sstart = toHumanReadableTime(start);
    if (end) {
      q.send = toHumanReadableTime(end);
    }

    // Set media type
    if (item.mediaType) {
      q.mediaType = item.mediaType;
    }

    return `${shareUrl}?${stringify(q)}`;
  }

  // eslint-disable-next-line class-methods-use-this
  colonStrToSecond(str) {
    const s = str.replace(/[^\d:]+/g, '');
    return s.split(':')
      .map(t => (t ? parseInt(t, 10) : 0))
      .reverse()
      .reduce((result, t, i) => (result + (t * Math.pow(60, i))), 0); // eslint-disable-line no-restricted-properties
  }

  // eslint-disable-next-line class-methods-use-this
  mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  render() {
    return null;
  }
}

export default BaseShareForm;
