import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Label } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import moment from 'moment';

import { toHumanReadableTime, fromHumanReadableTime } from '../../helpers/time';
import { getQuery, stringify } from '../../helpers/url';

import AVShare from './AVShare';

class ShareFormMobile extends Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { start: 0, end: '', url: window.location.href };
  }

  setStart = (e, data) => {
    const start = data && data.value ? this.colonStrToMls(data.value) : Math.round(this.props.currentTime, 10);
    const end   = (this.state.end > start) ? this.state.end : start + 5 * 100;
    let state   = { start, end };

    if (!end) {
      delete state.end;
    }
    this.setState({ ...state, url: this.getUrl(start, end) });
  };

  setEnd = (e, data) => {
    const end   = data && data.value ? this.colonStrToMls(data.value) : Math.round(this.props.currentTime, 10);
    const start = !this.state.start ? 0 : (this.state.start < end) ? this.state.start : end - 5 * 100;
    this.setState({ end, start, url: this.getUrl(start, end) });
  };

  getUrl = (start, end) => {
    let search = { ...getQuery(window.location), sstart: toHumanReadableTime(start) };
    if (end) {
      search.send = end;
    }
    return window.location.href.split('?')[0] + '?' + stringify(search);
  };

  colonStrToMls = (str) => {
    return str.splice(':').map(s => s.replace(/^\D+/g, '')).map(t => parseInt(t, 10)).reverse().reduce((t, i, result) => {
      result += t * Math.pow(60, i + 1) * 100;
      return result;
    }, 0);
  };

  mlsToStrColon = (mls) => {
    return moment.duration(mls, "mili").humanize('HH:mm:ss');
  };

  render() {
    const { start, end, url } = this.state;

    return (
      <div>
        <AVShare shareUrl={url} />
        <div>
          <Label>{url}</Label>
          <CopyToClipboard text={this.state.url}>
            <Button
              circular
              type="button"
              primary
              icon="chain" />
          </CopyToClipboard>
        </div>
        <div>
          <Button
            content={this.props.t('player.buttons.select-start-position')}
            onClick={this.setStart} />
          <Input
            value={this.mlsToStrColon(start)}
            onChange={this.setStart} />
        </div>
        <div>
          <Button
            content={this.props.t('player.buttons.select-end-position')}
            onClick={this.setEnd} />
          <Input
            value={end ? this.mlsToStrColon(end) : ''}
            onChange={this.setEnd} />
        </div>
      </div>
    );
  }
}

export default translate()(ShareFormMobile);
