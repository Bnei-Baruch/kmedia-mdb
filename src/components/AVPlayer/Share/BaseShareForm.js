import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';

import { toHumanReadableTime } from '../../../helpers/time';
import { getQuery, stringify, splitPathByLanguage } from '../../../helpers/url';

class BaseShareForm extends React.Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    onSliceChange: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSliceChange: noop,
  };

  static getUrl(props, start, end, addUiLang) {
    const { protocol, hostname, port, pathname } = window.location;
    const { item, uiLanguage }                   = props;
    const path                                   = item.shareUrl || pathname;
    const { path: pathSuffix }                   = splitPathByLanguage(path);
    const uiLang                                 = addUiLang ? `/${uiLanguage}` : '';
    const shareUrl                               = `${protocol}//${hostname}${port ? `:${port}` : ''}${uiLang}${pathSuffix}`;

    const q  = getQuery(window.location);
    // Set start end points
    q.sstart = toHumanReadableTime(start);
    if (end) {
      q.send = toHumanReadableTime(end);
    }

    // Set media type
    if (item.mediaType) {
      q.mediaType = item.mediaType;
    }

    // Remove the currentTime param from the share url
    q.currentTime = null;

    return `${shareUrl}?${stringify(q)}`;
  }

  static colonStrToSecond(str) {
    const s = str.replace(/[^\d:]+/g, '');
    return s.split(':')
      .map(t => (t ? parseInt(t, 10) : 0))
      .reverse()
      .reduce((result, t, i) => (result + (t * Math.pow(60, i))), 0);
  }

  static mlsToStrColon(seconds) {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      start: undefined,
      end: undefined,
      url: BaseShareForm.getUrl(props),
      uiLangUrl: BaseShareForm.getUrl(props, undefined, undefined, true),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.item !== this.props.item) {
      const { start, end } = prevState;
      this.setState({
        start, 
        end,
        url: BaseShareForm.getUrl(this.props, start, end),
        uiLangUrl: BaseShareForm.getUrl(this.props, start, end, true),
      });
    }
  }

  setStart(e, data) {
    const { media, onSliceChange } = this.props;
    const duration                 = Math.max(media.duration, 0);

    let start = data && data.value
      ? BaseShareForm.colonStrToSecond(data.value)
      : Math.round(media.currentTime);
    start     = Math.min(start, duration);

    let end = this.state.end || 0;
    end     = end > start ? end : duration;

    const state = { start, end };
    if (!end) {
      delete state.end;
      end = null;
    }

    this.setState({
      ...state,
      url: BaseShareForm.getUrl(this.props, start, end),
      uiLangUrl: BaseShareForm.getUrl(this.props, start, end, true),
    });
    onSliceChange(start, end);
  }

  setEnd(e, data) {
    const { media, onSliceChange } = this.props;
    const duration                 = Math.max(media.duration, 0);

    let end = data && data.value
      ? BaseShareForm.colonStrToSecond(data.value)
      : Math.round(media.currentTime);
    end     = Math.min(end, duration);

    let start = this.state.start || 0;
    if (end) {
      start = this.state.start < end ? start : 0;
    }

    this.setState({
      end, start,
      url: BaseShareForm.getUrl(this.props, start, end),
      uiLangUrl: BaseShareForm.getUrl(this.props, start, end, true),
    });
    onSliceChange(start, end);
  }

  render() {
    return null;
  }
}

export default BaseShareForm;