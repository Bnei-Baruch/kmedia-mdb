import { play, seek } from '../../../../../pkg/jwpAdapter/adapter';

export const seekToChapter = chapter => {
  if (!chapter) return;
  seek(chapter.start);
  play();
};

export const seekToTime = time => {
  if (!Number.isFinite(time)) return;
  seek(time);
  play();
};
