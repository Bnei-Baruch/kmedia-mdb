import { PLAYER_ACTIONS_BY_EVENT } from '../../redux/modules/player';
import { MT_VIDEO, MT_AUDIO } from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { PLAYER_POSITION_STORAGE_KEY } from './constants';
import { actions as playlistActions } from '../../redux/modules/playlist';
import moment from 'moment';

export const DEFAULT_PLAYER_VOLUME     = 80;
export const PLAYER_VOLUME_STORAGE_KEY = 'jwplayer.volume';

const PLAYER_EVENTS = ['ready', 'remove', 'play', 'pause', 'playbackRateChanged', 'resize', 'mute'];

export const initPlayerEvents = (dispatch) => {
  const player = window.jwplayer();

  //for debug, catch all jwplayer events
  //player.on('all', (name, e) => console.log('jwplayer all events', name, e));

  player.on('error', e => console.error(e));

  player.on('remove', () => player.off('all'));

  player.on('complete', () => dispatch(playlistActions.next()));

  PLAYER_EVENTS.forEach(name => {
    const action = PLAYER_ACTIONS_BY_EVENT[name];
    if (!action) {
      console.log(`no redux for action: ${name}`);
      return;
    }

    player.on(name, e => {
      dispatch(action(e));
    });
  });
};

export const findPlayedFile = (item, info, lang, mt, q) => {
  if (isEmpty(item) || !info.isReady) return {};
  const { mediaType, language, quality } = info;

  lang = lang || language;
  mt   = mt || mediaType;
  q    = q || quality;

  const { filesByLang, qualityByLang, mtByLang, languages } = item;

  const byLang = filesByLang[lang];

  //can't find language - take default
  if (!byLang) {
    return findPlayedFile(item, info, languages[0]);
  }

  //can't find media type - take other
  if (!mtByLang[lang].includes(mt)) {
    const newMT = (mt === MT_VIDEO) ? MT_AUDIO : MT_VIDEO;
    return findPlayedFile(item, info, lang, newMT);
  }

  //can't find quality - take first
  if (mt !== MT_AUDIO && !qualityByLang[lang].includes(q)) {
    return findPlayedFile(item, info, lang, mt, qualityByLang[lang][0]);
  }

  const f     = byLang.find(f => {
    return f.type === mt && (mt === MT_AUDIO || !f.video_size || f.video_size === q);
  });
  const image = f.type === MT_VIDEO ? item.preImageUrl : null;
  return { ...f, image };
};

export const getSavedTime = (cuId, ht) => {
  const json = localStorage.getItem(`${PLAYER_POSITION_STORAGE_KEY}_${cuId}`);
  let lt;
  try {
    lt = JSON.parse(json);
  } catch (e) {
    console.error('broken json', json);
  }

  const time = lt && (!ht || moment(lt.timestamp).isAfter(ht.timestamp)) ? lt.current_time : ht?.data?.current_time || 0;
  return parseInt(time, 10);
};