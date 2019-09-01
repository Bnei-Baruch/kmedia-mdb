import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { isEmpty } from '../../../helpers/utils';

const Video = ({ url, releaseDate, duration, mimetype, width, height, /* tags, */ }) => {
  // tv_show - to be used in the main page of tv show.
  // episode - to be used for a specific episode
  // video:series - a url to the tv show
  return (
    <Helmet>
      {/* <meta property="og:type" content={`video.${category}`} /> */}
      <meta property="og:type" content="video.other" />
      <meta property="og:video" content={url} />
      <meta property="og:video:secure_url" content={url} />

      {/* <meta property="og:video:secure_url" content="https://secure.example.com/movie.swf" /> */}
      {!isEmpty(mimetype) ? <meta property="og:video:type" content={mimetype} /> : null}
      {width ? <meta property="og:video:width" content={width} /> : null}
      {height ? <meta property="og:video:height" content={height} /> : null}


      {/* {!isEmpty(tvShowUrl) ? <meta name="video:series" content={tvShowUrl} /> : null} */}


      {!isEmpty(releaseDate) ? <meta name="og:video:release_date" content={releaseDate} /> : null}
      {duration ? <meta name="og:video:duration" content={duration} /> : null}
      {/* {tags.map((tag, index) => <meta name="og:video:tag" content={tag} key={index} />)} */}
    </Helmet>
  );
};

Video.propTypes = {
  url: PropTypes.string.isRequired,
  releaseDate: PropTypes.string,
  duration: PropTypes.number,
  mimetype: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

Video.defaultProps = {
  releaseDate: undefined,
  duration: undefined,
  mimetype: undefined,
  width: undefined,
  height: undefined,
};

export default Video;
