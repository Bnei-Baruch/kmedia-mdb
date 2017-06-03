import onAdPlay from './on-ad-play';
import onBeforePlay from './on-before-play';
import onFullScreen from './on-full-screen';
import onMute from './on-mute';
import onMeta from './on-meta';
import onPlay from './on-play';
import onTime from './on-time';
import onVideoLoad from './on-video-load';

function createEventHandlers(component) {
  return {
    onAdPlay: onAdPlay.bind(component),
    onBeforePlay: onBeforePlay.bind(component),
    onFullScreen: onFullScreen.bind(component),
    onMute: onMute.bind(component),
    onMeta: onMeta.bind(component),
    onPlay: onPlay.bind(component),
    onTime: onTime.bind(component),
    onVideoLoad: onVideoLoad.bind(component),
  };
}

export default createEventHandlers;
