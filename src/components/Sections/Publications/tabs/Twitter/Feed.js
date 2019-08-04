import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Divider, Feed, Image } from 'semantic-ui-react';

import { isEmpty } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';
import twitterAvatar from '../../../../../images/ml_twitter_avatar.jpeg';

const screenNames = {
  Michael_Laitman: 'Михаэль Лайтман',
  laitman_co_il: 'מיכאל לייטמן',
  laitman: 'Michael Laitman',
  laitman_es: 'Michael Laitman',
};

class TwitterFeed extends Component {
  static propTypes = {
    twitter: shapes.Tweet,
    snippetVersion: PropTypes.bool,
    withDivider: PropTypes.bool,
  };

  static defaultProps = {
    twitter: null,
    snippetVersion: false,
    withDivider: true,
  };

  getBestVideoVariant = (x) => {
    const { video_info: { variants } } = x;
    if (isEmpty(variants)) {
      return null;
    }

    const playable = variants.filter(y => y.content_type.startsWith('video'));
    if (isEmpty(playable)) {
      return null;
    }

    let best = playable[0];
    for (let i = 1; i < playable.length; i++) {
      if (best.bitrate < playable[i].bitrate) {
        best = playable[i];
      }
    }

    return best;
  };

  prepare = (raw, highlight) => {
    const { full_text: fullText, entities, extended_entities: exEntities } = raw;

    const replacements = [
      ...(entities.hashtags || []).map(x => ({ ...x, entityType: 'hashtag' })),
      ...(entities.urls || []).map(x => ({ ...x, entityType: 'url' })),
      ...(entities.user_mentions || []).map(x => ({ ...x, entityType: 'user_mention' })),
      ...(exEntities.media || []).map(x => ({ ...x, entityType: 'media' })),
    ];

    if (replacements.length === 0) {
      return highlight ? highlight: fullText;
    }

    replacements.sort((a, b) => {
      const { indices: [x] } = a;
      const { indices: [y] } = b;
      return x - y;
    });

    let html   = '';
    let offset = 0;
    replacements.forEach((x) => {
      const { indices: [s, e], entityType } = x;

      html += fullText.slice(offset, s);

      switch (entityType) {
      case 'hashtag':
        html += `<a href="https://twitter.com/hashtag/${x.text}" target="_blank" rel="noopener noreferrer">#${x.text}</a>`;
        break;
      case 'url':
        html += `<a href="${x.expanded_url}" target="_blank" rel="noopener noreferrer">${x.display_url}</a>`;
        break;
      case 'user_mention':
        html += `<a href="https://twitter.com/${x.screen_name}" target="_blank" title="${x.name}" rel="noopener noreferrer">@${x.screen_name}</a>`;
        break;
      case 'media':
        switch (x.type) {
        case 'photo':
          html += `<img class="tweet--media" src="${x.media_url_https}" alt="${x.ext_alt_text}" />`;
          break;
        case 'video': {
          const variant = this.getBestVideoVariant(x);
          if (variant) {
            html += `<video controls playsinline preload="none" poster="${x.media_url_https}" class="tweet--media" src="${variant.url}" />`;
          } else {
            html += fullText.slice(s, e);
          }
          break;
        }
        default:
          html += fullText.slice(s, e);
          break;
        }
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

  render() {
    const { snippetVersion, withDivider, twitter, highlight } = this.props;
    if (!twitter) {
      return null;
    }
    const { username, twitter_id: tID, created_at: ts, raw } = twitter;
    const mts                                                = moment(ts);
    const screenName                                         = screenNames[username];

    const url = snippetVersion
      ? `https://twitter.com/${username}/status/${tID}`
      : `https://twitter.com/${username}`;

    return (
      <Fragment key={tID}>
        <Feed.Event key={tID} className="tweet">
          <Feed.Content>
            <Feed.Summary className="tweet-title-wrapper">
              {
                snippetVersion
                  ? <Image className="twitter-avatar" src={twitterAvatar} />
                  : null
              }
              <a href={url} target="_blank" rel="noopener noreferrer" className="tweet-title">
                {screenName}
                <span className="tweet--username">
                  @
                  {username}
                </span>
              </a>
              {
                !snippetVersion
                  ? (
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
                  )
                  : null
              }
            </Feed.Summary>
            <Feed.Extra text>
              <div dangerouslySetInnerHTML={{ __html: this.prepare(raw, highlight) }} />
              {
                snippetVersion
                  ? <div className="tweet-friendly-date">{mts.fromNow()}</div>
                  : null
              }
            </Feed.Extra>
          </Feed.Content>
        </Feed.Event>
        {
          snippetVersion && withDivider
            ? <Divider fitted />
            : null
        }
      </Fragment>
    );
  };
}

export default TwitterFeed;
