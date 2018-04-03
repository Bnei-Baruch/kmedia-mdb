// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
//
// class Audio extends Component {
//   static propTypes = {
//     releaseDate: PropTypes.string,
//     duration: PropTypes.number,
//     type: PropTypes.oneOf(['movie', 'tv_show', 'episode', 'other']),
//     tvShowUrl: function(props, propName, componentName) {
//       if (props.type === 'episode') {
//         if (!props['tvShowUrl']) {
//           return new Error(`${propName} should be provided for episode.`);
//         }
//       }
//     },
//     tags: PropTypes.arrayOf(PropTypes.string),
//   };
//
//   static defaultProps = {
//     type: 'other',
//     tags: []
//   };
//
//   render() {
//     const { releaseDate, duration, type, tags, tvShowUrl } = this.props;
//
//     // tv_show - to be used in the main page of tv show.
//     // episode - to be used for a specific episode
//     // video:series - a url to the tv show
//     return (
//       <Helmet>
//         <meta property="og:type" content={`video.${type}`} />
//
//         <meta property="og:audio" content="http://example.com/sound.mp3" />
//         <meta property="og:audio:secure_url" content="https://secure.example.com/sound.mp3" />
//         <meta property="og:audio:type" content="audio/mpeg" />
//
//         {tvShowUrl ? <meta name="video:series" content={tvShowUrl} /> : null}
//
//         {/*TODO (orin): Should we use (direct link to the file, the og:url is the link to the page?*/}
//         {/*<meta property="og:video" content="http://example.com/movie.swf" />*/}
//         {/*<meta property="og:video:secure_url" content="https://secure.example.com/movie.swf" />*/}
//
//         {releaseDate ? <meta name="video:release_date" content={releaseDate} /> : null}
//         {duration ? <meta name="video:duration" content={duration} /> : null}
//         {tags.map((tag, index) => <meta name="video:tag" content={tag} key={index} />)}
//       </Helmet>
//     );
//   }
// }
//
// export default Video;
