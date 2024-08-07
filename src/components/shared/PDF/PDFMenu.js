import React, { useState, useEffect } from 'react';
import { BS_TAAS_LAST_PAGE } from '../../../helpers/consts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../../redux/selectors';
import { goOtherTassPart } from './helper';

const PDFMenu = ({ pageNumber, startsFrom, numPages, setPage, isTaas }) => {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const uiDir = useSelector(settingsGetUIDirSelector);

  const [inputValue, setInputValue] = useState('');

  const lastPage = isTaas ? BS_TAAS_LAST_PAGE : numPages;

  useEffect(() => {
    setInputValue('');
  }, [pageNumber]);

  const onKeyDown = e => {
    // Enter
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const { validated, parsed } = validateValue(inputValue);
    if (!validated) return;

    handleSetPage(parsed);
  };

  const handleSetPage = page => {
    if (isTaas && (page > startsFrom + numPages - 1 || page < startsFrom)) {
      goOtherTassPart(page, page < startsFrom, navigate);
      return;
    }

    setPage(page);
  };

  const handleChange = ({ currentTarget: { value } }) => setInputValue(value);

  const prevPage = () => handleSetPage(pageNumber - 1);

  const nextPage = () => handleSetPage(pageNumber + 1);

  const validateValue = value => {
    const bad = { validated: false, parsed: 0 };

    if (value === '') {
      return bad;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return bad;
    }

    if (parsed < 1 || parsed > lastPage) {
      return bad;
    }

    return { validated: true, parsed };
  };

  const isLtr = uiDir === 'ltr';
  return (
    <div className="pdf_pagination">
      <Button onClick={prevPage} disabled={pageNumber < 2 || !numPages}>
        <span className="material-symbols-outlined">{`chevron_${isLtr ? 'left' : 'right'}`}</span>
        <span>{t('simple-mode.prev')}</span>
      </Button>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className="input_wrapper"
        placeholder={`${pageNumber}/${lastPage}`}
      >
        <input />
        <span onClick={handleSubmit} className="material-symbols-outlined">search</span>
      </Input>

      <Button
        onClick={nextPage}
        disabled={pageNumber >= lastPage || !numPages}
      >
        <span>{t('simple-mode.next')}</span>
        <span className="material-symbols-outlined">{`chevron_${isLtr ? 'right' : 'left'}`}</span>
      </Button>
    </div>
  );
};

export default PDFMenu;
