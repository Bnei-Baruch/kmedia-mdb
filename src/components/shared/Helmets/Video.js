import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { isEmpty } from '../../../helpers/utils';

class Video extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    releaseDate: PropTypes.string,
    duration: PropTypes.number,
    type: PropTypes.oneOf(['movie', 'tv_show', 'episode', 'other']),
    tvShowUrl: function(props, propName, componentName) {
      if (props.type === 'episode') {
        if (!props['tvShowUrl']) {
          return new Error(`${propName} should be provided for episode.`);
        }
      }
    },
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    type: 'other',
    tags: []
  };

  render() {
    const { releaseDate, duration, type, tags, tvShowUrl } = this.props;

    // tv_show - to be used in the main page of tv show.
    // episode - to be used for a specific episode
    // video:series - a url to the tv show
    return (
      <Helmet>
        <meta property="og:type" content={`video.${type}`} />

        {!isEmpty(tvShowUrl) ? <meta name="video:series" content={tvShowUrl} /> : null}

        {/*<meta property="og:video" content="http://example.com/movie.swf" />*/}
        {/*<meta property="og:video:secure_url" content="https://secure.example.com/movie.swf" />*/}

        {!isEmpty(releaseDate) ? <meta name="video:release_date" content={releaseDate} /> : null}
        {!isEmpty(duration) ? <meta name="video:duration" content={duration} /> : null}
        {tags.map((tag, index) => <meta name="video:tag" content={tag} key={index} />)}
      </Helmet>
    );
  }
}

export default Video;
