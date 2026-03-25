import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { textPageGetFileSelector } from '../../../redux/selectors';

const WPM = 270 / 3.5; // ≈ 77 words per minute

const countWords = () => {
  const el = document.querySelector('.font_settings.text__content');
  if (!el) return 0;
  const text = el.innerText || '';
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const ReadingTimeEstimate = () => {
  const { t }           = useTranslation();
  const file            = useSelector(textPageGetFileSelector);
  const [mins, setMins] = useState(null);

  useEffect(() => {
    if (!file) return undefined;
    // Wait for content to render into the DOM
    const timer = setTimeout(() => {
      const words = countWords();
      if (words > 0) setMins(Math.ceil(words / WPM));
    }, 300);
    return () => clearTimeout(timer);
  }, [file]);

  if (!mins) return null;

  return (
    <div className="reading-time-estimate">
      {t('page-with-text.reading-time', { mins })}
    </div>
  );
};

export default ReadingTimeEstimate;
