import { PLAYER_ACTIONS_BY_EVENT } from '../../redux/modules/player';
import { DEFAULT_LANGUAGE, MT_VIDEO, MT_AUDIO } from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { PLAYER_POSITION_STORAGE_KEY } from '../AVPlayer/constants';

export const DEFAULT_PLAYER_VOLUME     = 80;
export const PLAYER_VOLUME_STORAGE_KEY = 'jwplayer.volume';

const PLAYER_EVENTS = ['ready', 'remove', 'play', 'pause', 'playbackRateChanged'];

export const initPlayerEvents = (dispatch) => {
  const player = window.jwplayer();
  player.on('error', e => {
    console.error(e);
  });

  player.on('remove', () => player.off('all'));

  player.on('all', e => console.log('jwplayer all events', e));

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
  if (isEmpty(item) || isEmpty(info)) return {};
  const { mediaType, language, quality } = info;

  lang = lang || language;
  mt   = mt || mediaType;
  q    = q || quality;

  const { filesByLang, qualityByLang, mtByLang } = item;

  const byLang = filesByLang[lang];

  //can't find language - take default
  if (byLang.length === 0) {
    return findPlayedFile(item, info, DEFAULT_LANGUAGE);
  }

  //can't find media type - take other
  if (!mtByLang[lang].includes(mt)) {
    const newMT = (mt === MT_VIDEO) ? MT_AUDIO : MT_VIDEO;
    return findPlayedFile(item, info, lang, newMT);
  }

  //can't find quality - take first
  if (!qualityByLang[lang].includes(q)) {
    return findPlayedFile(item, info, lang, mt, qualityByLang[lang][0]);
  }

  return byLang.find(f => f.type === mt && (mt === MT_AUDIO || f.video_size === q));
};

export const getSavedTime = (cuId) => {
  const savedTime = localStorage.getItem(`${PLAYER_POSITION_STORAGE_KEY}_${cuId}`) || 0;
  return parseInt(savedTime, 10);
};
