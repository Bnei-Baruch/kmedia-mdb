import React, { useState, useEffect } from 'react';
import { BS_TAAS_LAST_PAGE, BS_TAAS_PARTS } from '../../../helpers/consts';
import { useNavigate } from 'react-router-dom';
import { stringify } from '../../../helpers/url';
import { useTranslation } from 'react-i18next';
import { Input, Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const PDFMenu = ({ pageNumber, startsFrom, numPages, setPage, isTaas }) => {
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const uiDir    = useSelector(settingsGetUIDirSelector);

  const [inputValue, setInputValue] = useState(pageNumber);

  const lastPage = isTaas ? BS_TAAS_LAST_PAGE : numPages;

  useEffect(() => {
    setInputValue(pageNumber);
  }, [pageNumber]);

  const onKeyDown = e => {
    // Enter
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleSubmit  = () => {
    const { validated, parsed } = validateValue(inputValue);
    if (!validated) return;

    handleSetPage(parsed);
  };

  const handleSetPage = page => {
    if (isTaas && (page > startsFrom + numPages - 1 || page < startsFrom)) {
      goOtherTassPart(page);
      return;
    }

    setPage(page);
  };

  const handleChange = ({ currentTarget: { value } }) => setInputValue(value);

  const goOtherTassPart = page => {
    const [uid] = Object
      .entries(BS_TAAS_PARTS)
      .reverse()
      .find(x => x[1] <= page);
    navigate({
      pathname: `../sources/${uid}`,
      search: stringify({ page }),
    });
  };

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

  return (
    <div className="pdf_pagination" dir={uiDir}>
      <Button onClick={prevPage} disabled={pageNumber < 2 || !numPages}>
        <span className="material-symbols-outlined">chevron_right</span>
        <span>{t('simple-mode.prev')}</span>
      </Button>
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className="input_wrapper"
        dir="ltr"
      >
        <span onClick={handleSubmit} className="material-symbols-outlined">search</span>
        <input />
        <span> / {lastPage}</span>
      </Input>

      <Button
        onClick={nextPage}
        disabled={pageNumber >= lastPage || !numPages}
      >
        <span>{t('simple-mode.next')}</span>
        <span className="material-symbols-outlined">chevron_left</span>
      </Button>
    </div>
  );
};

export default PDFMenu;
