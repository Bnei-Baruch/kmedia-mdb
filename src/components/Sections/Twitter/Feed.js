import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Feed, Card, Divider } from 'semantic-ui-react';

class TwitterFeed extends Component {
  static propTypes = {
    total: PropTypes.number,
    tweets: PropTypes.array,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    total: 0,
    tweets: [],
  };

  prepare = (raw) => {
    const { full_text: fullText, entities, extended_entities: exEntities } = raw;

    const replacements = [
      ...(entities.hashtags || []).map(x => ({ ...x, type: 'hashtag' })),
      ...(entities.urls || []).map(x => ({ ...x, type: 'url' })),
      ...(entities.user_mentions || []).map(x => ({ ...x, type: 'user_mention' })),
    ];

    if (replacements.length === 0) {
      return fullText;
    }

    replacements.sort((a, b) => {
      const { indices: [x] } = a;
      const { indices: [y] } = b;
      return x - y;
    });

    let html   = '';
    let offset = 0;
    replacements.forEach((x) => {
      const { indices: [s, e], type } = x;

      html += fullText.slice(offset, s);

      switch (type) {
      case 'hashtag':
        html += `<a href="https://twitter.com/hashtag/${x.text}" target="_blank" rel="noopener noreferrer">#${x.text}</a>`;
        break;
      case 'url':
        html += `<a href="${x.expanded_url}" target="_blank" rel="noopener noreferrer">${x.display_url}</a>`;
        break;
      case 'user_mention':
        html += `<a href="https://twitter.com/${x.screen_name}" target="_blank" title="${x.name}" rel="noopener noreferrer">@${x.screen_name}</a>`;
        break;
      default:
        html += fullText.slice(s, e);
        break;
      }

      offset = e;
    });

    if (offset < fullText.length) {
      html += fullText.slice(offset);
    }

    html = html.replace(/\n/, '<br/>');

    return html;
  };

  renderTweet = (tweet) => {
    const { t } = this.props;
    const {
            username, twitter_id: tID, created_at: ts, raw
          }     = tweet;
    const mts   = moment(ts);

    return (
      <Feed.Event key={tID}>
        <Feed.Content>
          <Feed.Summary>
            <a href={`https://twitter.com/${username}`} target="_blank" rel="noopener noreferrer">
              {username}
            </a>
            &nbsp;&nbsp;{t('twitter.twitted')}
            <Feed.Date>
              <a
                href={`https://twitter.com/${username}/status/${tID}`}
                title={mts.format('lll')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {mts.format('lll')}
              </a>
            </Feed.Date>
          </Feed.Summary>
          <Feed.Extra text>
            <div dangerouslySetInnerHTML={{ __html: this.prepare(raw) }} />
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    );
  };

  render() {
    const { tweets } = this.props;

    return (
      <Feed>
        {tweets.map(this.renderTweet)}
      </Feed>
    );
  }
}

export default TwitterFeed;
