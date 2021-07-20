import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';
import clsx from 'clsx';

import { selectors as assetsSelectors, actions as assetsActions } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { MT_TEXT, CT_LIKUTIM } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { physicalFile } from '../../../../../../helpers/utils';
import * as shapes from '../../../../../shapes';
import { getSourceErrorSplash, wipLoadingSplash } from '../../../../../shared/WipErr/WipErr';
import PDF, { isTaas, startsFrom } from '../../../../../shared/PDF/PDF';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import DropdownLanguageSelector from '../../../../../Language/Selector/DropdownLanguageSelector';


const isValidLikut = unit =>
  unit.content_type === CT_LIKUTIM
&& (unit.files || []).some(f => f.type === MT_TEXT)

export const getLikutimUnits = unit =>
  Object.values(unit.derived_units || {}).filter(x => isValidLikut(x));

const getLikutimFiles = (unit, cuId) => {
  const likUnits = getLikutimUnits(unit);

  const cu = cuId
    ? likUnits.find(x => x.id === cuId)
    : likUnits.length > 0 && likUnits[0];

  return cu?.files?.filter(f => f.type === MT_TEXT) || [];
};

const getLikutimLanguages = unit => {
  const files = getLikutimFiles(unit);
  return files.length > 0 ? files.map(f => f.language) : [];
};

const getSourceLanguages = idx => idx?.data ? [...Object.keys(idx.data)] : [];

const checkIsLikutim = (options, selected) => {
  const val = options.find(o => o.value === selected);
  return val && val.type === CT_LIKUTIM;
};


const Sources = ({ unit, indexMap, t, options }) => {
  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const dispatch = useDispatch();

  const [fetched, setFetched]     = useState(null);
  const [isLikutim, setIsLikutim] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage]   = useState(contentLanguage);
  const [selectedUnitId, setSelectedUnitId]   = useState(null);

  // when options are changed, must change selected
  useEffect(() => {
    const available = options.filter(x => !x.disabled);
    const newSelectedUnitId = available.length > 0 ? available[0].value : null;
    setSelectedUnitId(newSelectedUnitId);
  }, [options]);

  useEffect(() => {
    const isLikutim = checkIsLikutim(options, selectedUnitId);
    setIsLikutim(isLikutim);
  }, [options, selectedUnitId]);

  useEffect(() => {
    const newLanguages = isLikutim
      ? getLikutimLanguages(unit)
      : getSourceLanguages(indexMap[selectedUnitId]);

    setLanguages(newLanguages);
  }, [indexMap, isLikutim, selectedUnitId, unit]);

  useEffect(() => {
    if (languages.length > 0) {
      const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

      // use existing state language if included in available languages
      setLanguage(lang => lang && languages.includes(lang) ? lang : newLanguage);
    }
  }, [contentLanguage, languages, uiLanguage]);

  useEffect(() => {
    if (!selectedUnitId || !language) {
      return;
    }

    const newFetch = `${selectedUnitId}#${language}`;
    if (newFetch === fetched) {
      // console.log('fetched already', newFetch);
      return;
    }

    const doc2html = fileId => dispatch(assetsActions.doc2html(fileId));

    if (isLikutim) {
      const file = getLikutimFiles(unit, selectedUnitId).find(x => x.language === language);
      if (file?.id) {
        // console.log('file:', file);
        doc2html(file.id);
        setFetched(newFetch);
      }
    } else {
      const langFiles = indexMap[selectedUnitId]?.data?.[language];

      if (langFiles) {
        const { pdf, docx, doc } = langFiles;
        if (pdf && isTaas(selectedUnitId)) {
          // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
          return;
        }

        const { id } = docx || doc || {};
        doc2html(id);
        setFetched(newFetch);
      }
    }
  }, [dispatch, fetched, indexMap, isLikutim, language, selectedUnitId, unit]);

  const handleLanguageChanged = (e, lang) => setLanguage(lang);
  const handleSourceChanged   = (e, data) => setSelectedUnitId(data.value);

  const getContents = () => {
    let file;
    if (isLikutim) {
      file = getLikutimFiles(unit, selectedUnitId).find(x => x.language === language);
    } else {
      const langFiles = indexMap[selectedUnitId]?.data?.[language];
      if (!langFiles)
        return null;

      const { pdf, doc, docx } = langFiles;
      if (isTaas(selectedUnitId) && pdf) {
        return <PDF pdfFile={physicalFile(pdf)} pageNumber={1} startsFrom={startsFrom(selectedUnitId)} />;
      }

      file = docx || doc || {};
    }

    return getContentsDiv(file);
  };

  const getContentsDiv = file => {
    const { wip, err, data } = doc2htmlById[file?.id] || {};

    if (err) {
      return getSourceErrorSplash(err, t);
    } else if (wip) {
      return wipLoadingSplash(t);
    }

    const direction = getLanguageDirection(language);
    return <div className="doc2html" style={{ direction }} dangerouslySetInnerHTML={{ __html: data }} />;
  }

  const { isMobileDevice } = useContext(DeviceInfoContext);

  if (!selectedUnitId) {
    return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
  }

  return (
    <>
      <Grid container padded={isMobileDevice} columns={2} className={clsx({ 'no-margin-top': !isMobileDevice })}>
        <Grid.Column
          className={clsx({ 'is-fitted': isMobileDevice })}
          width={isMobileDevice ? 16 : 12}
        >
          <Dropdown
            fluid
            selection
            value={selectedUnitId}
            options={options}
            selectOnBlur={false}
            selectOnNavigation={false}
            onChange={handleSourceChanged}
          />
        </Grid.Column>
        {
          languages.length > 0 &&
            <Grid.Column
              textAlign="center"
              className={clsx({ 'padding_r_l_0': isMobileDevice, 'no-padding-bottom': isMobileDevice })}
              width={isMobileDevice ? 16 : 4}
            >
              <DropdownLanguageSelector
                languages={languages}
                defaultValue={language}
                onSelect={handleLanguageChanged}
                fluid={isMobileDevice}
              />
            </Grid.Column>
        }
      </Grid>
      <Divider hidden fitted />
      {getContents()}
    </>
  );
};

Sources.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  indexMap: PropTypes.objectOf(shapes.DataWipErr).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Sources);
