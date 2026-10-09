import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { textPageGetFileSelector } from '../../../redux/selectors';
import { DEFAULT_WPM } from './hooks/useAutoScroll';

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
    setMins(null);
    let attempts  = 0;
    let lastCount = 0;
    let timer;

    const check = () => {
      const words = countWords();
      if (words > 0 && words === lastCount) {
        // count stable — content fully rendered
        setMins(Math.ceil(words / DEFAULT_WPM));
        return;
      }
      lastCount = words;
      attempts += 1;
      if (attempts < 20) {
        timer = setTimeout(check, 300);
      } else if (words > 0) {
        setMins(Math.ceil(words / DEFAULT_WPM));
      }
    };

    timer = setTimeout(check, 300);
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
