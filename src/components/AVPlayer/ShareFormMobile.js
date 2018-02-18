import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { translate } from 'react-i18next';
import { Grid, Input, Message } from 'semantic-ui-react';

import { toHumanReadableTime } from '../../helpers/time';
import { getQuery, stringify } from '../../helpers/url';

import ShareBar from './ShareBar';

class ShareFormMobile extends Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    playerDuration: PropTypes.number,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    playerDuration: 0,
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
    const { playerDuration } = this.props;

    let end = data && data.value !== undefined ?
      this.colonStrToSecond(data.value) :
      Math.round(this.props.currentTime);
    end     = end > playerDuration ? playerDuration : end;

    let start = this.state.start || 0;
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

  colonStrToSecond = (str) => {
    const s = str.replace(/[^\d:]+/g, '');
    return s.split(':')
      .map(t => (t ? parseInt(t, 10) : 0))
      .reverse()
      .reduce((result, t, i) => (result + (t * Math.pow(60, i))), 0); // eslint-disable-line no-restricted-properties
  };

  mlsToStrColon = (seconds) => {
    const duration = moment.duration({ seconds });
    const h        = duration.hours();
    const m        = duration.minutes();
    const s        = duration.seconds();
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  render() {
    const { t }               = this.props;
    const { start, end, url } = this.state;

    return (
      <div>
        <ShareBar url={url} t={t} buttonSize="medium" />
        <Message content={url} size="mini" style={{ 'user-select': 'all' }} />
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Input
                fluid
                value={this.mlsToStrColon(start)}
                onChange={this.setStart}
                action={{
                  content: t('player.buttons.start-position'),
                  onClick: this.setStart,
                  icon: 'hourglass start',
                  iconPosition: 'left'
                }}
                actionPosition="left"
                autoComplete="off"
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Input
                fluid
                value={end ? this.mlsToStrColon(end) : ''}
                onChange={this.setEnd}
                action={{
                  content: t('player.buttons.end-position'),
                  onClick: this.setEnd,
                  icon: 'hourglass end',
                  iconPosition: 'left'
                }}
                actionPosition="left"
                autoComplete="off"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default translate()(ShareFormMobile);
