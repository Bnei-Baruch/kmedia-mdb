import React, { useState, useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';
import classNames from 'classnames';

import { selectors as assetsSelectors, actions as assetsActions } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { assetUrl } from '../../../../../../helpers/Api';
import { CT_KITEI_MAKOR, MT_TEXT } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { formatError } from '../../../../../../helpers/utils';
import * as shapes from '../../../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../../../shared/Splash/Splash';
import PDF, { isTaas, startsFrom } from '../../../../../shared/PDF/PDF';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import DropdownLanguageSelector from "../../../../../Language/Selector/DropdownLanguageSelector";

export const getKiteiMakorUnits = unit => (
  Object.values(unit.derived_units || {})
    .filter(x => (
      x.content_type === CT_KITEI_MAKOR
      && (x.files || []).some(f => f.type === MT_TEXT))
    )
);

const getKiteiMakorFiles = (unit, ktCUID) => {
  const ktCUs = getKiteiMakorUnits(unit);

  const cu = ktCUID
    ? ktCUs.find(x => x.id === ktCUID)
    : ktCUs.length > 0 && ktCUs[0];

  return cu?.files?.filter(f => f.type === MT_TEXT) || [];
};

const getSourceLanguages = idx => idx?.data ? [...Object.keys(idx.data)] : [];

const getKiteiMakorLanguages = unit => {
  const files = getKiteiMakorFiles(unit);
  return files.length > 0 ? files.map(f => f.language) : [];
};

const checkIsKiteiMakor = (options, selected) => {
  const val = options.find(o => o.value === selected);
  return val && val.type === CT_KITEI_MAKOR;
};


const Sources = ({ unit, indexMap, t, options }) => {
  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));
  const content         = useSelector(state => assetsSelectors.getAsset(state.assets));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const dispatch        = useDispatch();
  const fetchAsset      = useCallback(name => dispatch(assetsActions.fetchAsset(name)), [dispatch]);
  const doc2html        = useCallback(deriveId => dispatch(assetsActions.doc2html(deriveId)), [dispatch]);

  const [fetched, setFetched] = useState(null);
  const [isKiteiMakor, setIsKiteiMakor] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState(contentLanguage);
  const [selected, setSelected] = useState(null);

  // when options are changed, must change selected
  useEffect(() => {
    const available = options.filter(x => !x.disabled);
    const newSelected = available.length > 0 ? available[0].value : null;
    setSelected(newSelected);
  }, [options]);

  useEffect(() => {
    const isKiteiMakor = checkIsKiteiMakor(options, selected);
    setIsKiteiMakor(isKiteiMakor);
  }, [options, selected]);


  useEffect(() => {
    const newLanguages = isKiteiMakor
      ? getKiteiMakorLanguages(unit)
      : getSourceLanguages(indexMap[selected]);

    setLanguages(newLanguages);
  }, [indexMap, isKiteiMakor, selected, unit]);


  useEffect(() => {
    if (languages.length > 0) {
      const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

      // use existing state language if included in available languages
      setLanguage(lang => lang && languages.includes(lang) ? lang : newLanguage);
    }
  }, [contentLanguage, languages, uiLanguage]);

  useEffect(() => {
    if (!selected || !language) {
      return;
    }

    const newFetch = `${selected  }#${  language}`;
    if (newFetch === fetched) {
      // console.log('fetched already', newFetch);
      return;
    }

    if (isKiteiMakor) {
      const file = getKiteiMakorFiles(unit, selected).find(x => x.language === language);
      if (file?.id) {
        doc2html(file.id);
        setFetched(newFetch);
      }
    } else if (indexMap[selected]?.data) {
      const data = indexMap[selected].data[language];

      if (data) {
        const { pdf, html } = data;

        if (pdf && isTaas(selected)) {
        // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
          return;
        }

        fetchAsset(`sources/${selected}/${html}`);
        setFetched(newFetch);
      }
    }
  }, [doc2html, fetchAsset, fetched, indexMap, isKiteiMakor, language, selected, unit]);


  const handleLanguageChanged = (e, lang) => setLanguage(lang);
  const handleSourceChanged = (e, data) => setSelected(data.value);

  const getPdfFile = () => {
    let pdfFile;
    if (isTaas(selected) && indexMap[selected]?.data) {
      pdfFile = indexMap[selected].data[language]?.pdf;
    }

    return pdfFile;
  }

  const getContents = () => {
    const pdfFile = getPdfFile();

    let contentStatus = content;
    if (isKiteiMakor) {
      const actualFile = getKiteiMakorFiles(unit, selected).find(x => x.language === language);
      contentStatus = doc2htmlById[actualFile?.id] || {};
    }

    const { wip, err, data } = contentStatus;
    let contents;
    if (err) {
      if (err.response && err.response.status === 404) {
        contents = <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        contents = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
      }
    } else if (wip) {
      contents = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (pdfFile) {
      contents = <PDF pdfFile={assetUrl(`sources/${selected}/${pdfFile}`)} pageNumber={1} startsFrom={startsFrom(selected)} />;
    } else {
      const direction = getLanguageDirection(language);
      contents = <div className="doc2html" style={{ direction }} dangerouslySetInnerHTML={{ __html: data }} />;
    }
    return contents;
  }

  const { isMobileDevice } = useContext(DeviceInfoContext)

  if (!selected) {
    return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
  }

  const contents = getContents();

  return (
    <>
      <Grid container padded={isMobileDevice} columns={2} className={classNames({"no-margin-top": !isMobileDevice})}>
        <Grid.Column
          className={classNames({"is-fitted": isMobileDevice})}
          width={isMobileDevice ? 16 : 12}
        >
          <Dropdown
            fluid
            selection
            value={selected}
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
              className={classNames({"padding_r_l_0": isMobileDevice, "no-padding-bottom": isMobileDevice})}
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
      {contents}
    </>
  );
}

Sources.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  indexMap: PropTypes.objectOf(shapes.DataWipErr).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Sources);
