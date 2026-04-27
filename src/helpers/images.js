import React from 'react';

import DailyLessonsIcon from '../images/icons/Dailylessons';
import DownloadIcon from '../images/icons/Download';
import EventsIcon from '../images/icons/Events';
import InfoIcon from '../images/icons/Info';
import LabelIcon from '../images/icons/LabelIcon';
import LecturesIcon from '../images/icons/Lectures';
import LikutimIcon from '../images/icons/Likutim';
import ProgramsIcon from '../images/icons/Programs';
import PublicationsIcon from '../images/icons/Publications';
import SimpleModeIcon from '../images/icons/SimpleMode';
import SourcesIcon from '../images/icons/Sources';
import TopicsIcon from '../images/icons/Topics';

import DailyLessonsFallbackIcon from '../images/fallbacks/DailylessonsFallback';
import EventsFallbackIcon from '../images/fallbacks/EventsFallback';
import LecturesFallbackIcon from '../images/fallbacks/LecturesFallback';
import ProgramsFallbackIcon from '../images/fallbacks/ProgramsFallback';
import SourcesFallbackIcon from '../images/fallbacks/SourcesFallback';

import PublicationsFallbackIcon from '../images/fallbacks/PublicationsFallback';
import ImagePlaceholder from '../images/Image';

const sectionLogo = {
  lessons: DailyLessonsIcon,
  programs: ProgramsIcon,
  lectures: LecturesIcon,
  sources: SourcesIcon,
  events: EventsIcon,
  publications: PublicationsIcon,
  downloads: DownloadIcon,
  info: InfoIcon,
  'simple-mode': SimpleModeIcon,
  likutim: LikutimIcon,
  topics: TopicsIcon,
  label: LabelIcon
};

export const SectionLogo = ({ name, ...props }) => {
  const Logo = sectionLogo[name];
  if (!Logo) {
    return null;
  }

  return <Logo {...props} />;
};

export const NoneFallbackImage = 'none';

const sectionThumbnailFallback = {
  lessons: DailyLessonsFallbackIcon,
  programs: ProgramsFallbackIcon,
  lectures: LecturesFallbackIcon,
  sources: SourcesFallbackIcon,
  events: EventsFallbackIcon,
  publications: PublicationsFallbackIcon,
  default: ImagePlaceholder,
  [NoneFallbackImage]: null,
};

export const knownFallbackImages = ['lessons', 'programs', 'lectures', 'sources', 'events', 'publications', 'default', NoneFallbackImage];

export const SectionThumbnailFallback = ({ name, circular, ...props }) => {
  const Fallback = sectionThumbnailFallback[name];
  return <Fallback {...props} width="100%" height="100%" />;
};
