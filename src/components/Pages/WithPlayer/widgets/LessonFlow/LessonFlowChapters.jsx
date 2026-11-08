import ChapterList from './ChapterList';
import useCurrentChapter from './useCurrentChapter';
import useChapterTexts from './useChapterTexts';
import { useTranscriptLink } from './transcriptLink';

// Chapter list bound to the player time, each chapter's text expandable (the playing one expanded)
const LessonFlowChapters = ({ markup, className }) => {
  const { idx, time } = useCurrentChapter(markup.chapters);
  const paragraphs    = useChapterTexts(markup);
  const link          = useTranscriptLink(markup);
  return (
    <ChapterList
      chapters={markup.chapters}
      currentIdx={idx}
      time={time}
      paragraphs={paragraphs}
      link={link}
      className={className}
    />
  );
};

export default LessonFlowChapters;
