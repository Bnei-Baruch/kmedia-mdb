import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

import { selectors as settings } from '../../../redux/modules/settings';
import excerpts from './excerpts';
import { DEFAULT_LANGUAGE } from '../../../helpers/consts';

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return <span>You are good to go!</span>;
  } else {
    minutes = minutes > 10 ? minutes : `0${minutes}`;
    seconds = seconds > 10 ? seconds : `0${seconds}`;
    return <span style={{ direction: 'ltr', 'font-size': '3em' }}>{minutes}:{seconds}</span>;
  }
};

const chooseExcerpt = (language) => {
  const items = excerpts[language] || excerpts[DEFAULT_LANGUAGE];
  return items[Math.floor(Math.random() * items.length)];
};

const calculateTimeLeft = (finalDate) => {
  const difference = (finalDate - +new Date()) / 1000;

  return {
    days: Math.floor(difference / (60 * 60 * 24)),
    hours: Math.floor((difference / (60 * 60)) % 24),
    minutes: Math.floor((difference / 60) % 60),
    seconds: Math.floor(difference % 60),
    completed: difference <= 0,
  };
};

const nowPlus5min = () => +Date.now() + 5 * 60 * 1000;

const Countdown = ({ finalDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(finalDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const t = calculateTimeLeft(finalDate);
      if (t.completed) {
        clearInterval(timer);
      } else {
        setTimeLeft(t);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [finalDate]);

  return renderer(timeLeft);
};

const ExcerptContainer = () => {
  const language                  = useSelector(state => settings.getLanguage(state.settings));
  const [excerpt, setExcerpt]     = useState(chooseExcerpt(language));
  const [finalDate, setFinalDate] = useState(nowPlus5min());

  useEffect(() => {
    setExcerpt(chooseExcerpt(language));
    setFinalDate(nowPlus5min());
  }, [language]);

  return (
    <div style={{ 'padding': '20px', 'text-align': 'justify' }}>
      <br />
      <Header as="h1" textAlign="center" color="green" size="huge">
        <Countdown finalDate={finalDate} />
      </Header>
      <Container text>
        {excerpt}
      </Container>
      <br />
      <br />
    </div>
  );
};

export default ExcerptContainer;
