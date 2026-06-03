import React from 'react';

import {
  AudioBlog as AudioBlogIcon,
  Dailylessons as DailyLessonsIcon,
  Download as DownloadIcon,
  Events as EventsIcon,
  Info as InfoIcon,
  LabelIcon,
  Lectures as LecturesIcon,
  Likutim as LikutimIcon,
  Programs as ProgramsIcon,
  Publications as PublicationsIcon,
  SimpleMode as SimpleModeIcon,
  Sources as SourcesIcon,
  Topics as TopicsIcon,
} from '../images/icons';

import {
  DailylessonsFallback as DailyLessonsFallbackIcon,
  EventsFallback as EventsFallbackIcon,
  LecturesFallback as LecturesFallbackIcon,
  ProgramsFallback as ProgramsFallbackIcon,
  PublicationsFallback as PublicationsFallbackIcon,
  SourcesFallback as SourcesFallbackIcon,
} from '../images/fallbacks';
import ImagePlaceholder from '../images/image.svg?react';

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
  audio: AudioBlogIcon,
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

export const SectionThumbnailFallback = ({ name, ...props }) => {
  const Fallback = sectionThumbnailFallback[name];
  return <Fallback {...props} width="100%" height="100%" />;
};
