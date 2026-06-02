import { useState } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../../../helpers/utils';

const AlphabetFilter = ({ letters, onLetterClick }) => {
  const { t }                             = useTranslation();
  const [clickedLetter, setClickedLetter] = useState(null);

  const labelOnClick = letter => {
    processClicked(letter === clickedLetter ? null : letter);
  };

  const processClicked = letter => {
    setClickedLetter(letter);
    onLetterClick(letter);
  };

  if (isEmpty(letters)) {
    return null;
  }

  return (
    <ul className="flex flex-wrap items-center gap-2 list-none p-0 m-0">
      <li key="all">
        <a
          className={clsx('cursor-pointer px-1', { 'font-bold text-blue-600': clickedLetter === null })}
          onClick={() => processClicked(null)}
        >
          {t('filters.all')}
        </a>
      </li>
      {
        letters.sort().map(lt =>
          <li
            key={lt}
            className="border-l border-gray-300 pl-2"
          >
            <a
              className={clsx('cursor-pointer px-1', { 'font-bold text-blue-600': clickedLetter && lt === clickedLetter })}
              onClick={() => labelOnClick(lt)}
            >
              {lt}
            </a>
          </li>
        )
      }
    </ul>
  );
};

AlphabetFilter.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLetterClick: PropTypes.func.isRequired
};

export default AlphabetFilter;
