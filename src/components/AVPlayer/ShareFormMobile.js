import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { translate } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Input, Label } from 'semantic-ui-react';

import { toHumanReadableTime } from '../../helpers/time';
import { getQuery, stringify } from '../../helpers/url';

import AVShare from './AVShare';

class ShareFormMobile extends Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    playerDuration: PropTypes.number,
    t: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { start: 0, end: '', url: window.location.href };
  }

  setStart = (e, data) => {
    const playerDuration = (this.props.playerDuration - 5);
    let start            = data && data.value ?
      this.colonStrToSecond(data.value) :
      Math.round(this.props.currentTime);

    start   = start > playerDuration ? playerDuration : start;
    let end = this.state.end > start ?
      this.state.end :
      start + 5;

    const state = { start, end };
    if (!this.state.end) {
      delete state.end;
      end = null;
    }

    this.setState({ ...state, url: this.getUrl(start, end) });
  };

  setEnd = (e, data) => {
    const playerDuration = this.props.playerDuration;
    let end              = data && data.value !== undefined ?
      this.colonStrToSecond(data.value) :
      Math.round(this.props.currentTime);
    end                  = end > playerDuration ? playerDuration : end;
    let start            = this.state.start || 0;
    if (end) {
      start = this.state.start < end ? this.state.start : end - 5;
    }

    this.setState({ end, start, url: this.getUrl(start, end) });
  };

  getUrl = (start, end) => {
    const search = {
      ...getQuery(window.location),
      sstart: toHumanReadableTime(start)
    };

    if (end) {
      search.send = toHumanReadableTime(end);
    }

    return `${window.location.href.split('?')[0]}?${stringify(search)}`;
  };

  colonStrToSecond = str => {
    str = str.replace(/[^\d:]+/g, '');
    return str.split(':')
      .map((t) => t ? parseInt(t, 10) : 0)
      .reverse()
      .reduce((result, t, i) => (result + t * Math.pow(60, i)), 0); // eslint-disable-line no-restricted-properties
  };

  mlsToStrColon = sec => {
    const duration = moment.duration({ 'seconds': sec });
    return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
  };

  render() {
    const { t }               = this.props;
    const { start, end, url } = this.state;

    return (
      <div>
        <AVShare shareUrl={url} />
        <div>
          <Label>{url}</Label>
          <CopyToClipboard text={url}>
            <Button primary circular type="button" icon="chain" />
          </CopyToClipboard>
        </div>
        <div>
          <Button content={t('player.buttons.start-position')} onClick={this.setStart} />
          <Input value={this.mlsToStrColon(start)} onChange={this.setStart} />
        </div>
        <div>
          <Button content={t('player.buttons.end-position')} onClick={this.setEnd} />
          <Input value={end ? this.mlsToStrColon(end) : ''} onChange={this.setEnd} />
        </div>
      </div>
    );
  }
}

export default translate()(ShareFormMobile);
