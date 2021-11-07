export const buildAppendData = (autoPlay, item, currentTime, duration, muted) => {
  let file_uid = undefined;
  let file_language = undefined;
  if (item && item.unit && item.unit.files && Array.isArray(item.unit.files)) {
    const file = item.unit.files.find(file => file.language === item.language && file.type === item.mediaType);
    if (file) {
      file_uid = file.id;
      file_language = file.language;
    }
  }

  return {
    unit_uid: (item && item.unit && item.unit.id) || undefined,
    file_src: (item && item.src) || undefined,
    file_uid,
    file_language,
    current_time: currentTime,
    duration,
    auto_play: autoPlay,
    // media.isMuted/media.muted is actually the state before the action, so we call it was_muted.
    // This is specifically relevant for the mute-unmute action.
    was_muted: muted,
  };
};
