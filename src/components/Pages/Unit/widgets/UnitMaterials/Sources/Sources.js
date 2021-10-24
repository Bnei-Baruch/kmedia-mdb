import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Divider, Dropdown, Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { selectors } from '../../../../../../redux/modules/sources';
import { selectors as assetsSelectors, actions as assetsActions } from '../../../../../../redux/modules/assets';
import { physicalFile, tracePath, isEmpty } from '../../../../../../helpers/utils';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import { MT_TEXT, CT_LIKUTIM } from '../../../../../../helpers/consts';
import { getSourceErrorSplash, wipLoadingSplash } from '../../../../../shared/WipErr/WipErr';
import PDF, { isTaas, startsFrom } from '../../../../../shared/PDF/PDF';
import ScrollToSearch from '../../../../../shared/ScrollToSearch';
import Download from '../../../../../shared/Download/Download';
import * as shapes from '../../../../../shapes';
import UnitBar from '../UnitBar';
import MenuLanguageSelector from '../../../../../Language/Selector/MenuLanguageSelector';

const isValidLikut = unit =>
  unit.content_type === CT_LIKUTIM
  && (unit.files || []).some(f => f.type === MT_TEXT);

const getLikutimUnits = unit =>
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

const Sources = ({ unit, t, activeTab = 'sources' }) => {
  const getSourceById   = useSelector(state => selectors.getSourceById(state.sources), shallowEqual);
  const indexById       = useSelector(state => assetsSelectors.getSourceIndexById(state.assets), shallowEqual);
  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));
  const dispatch        = useDispatch();

  const [fetched, setFetched]               = useState(null);
  const [isLikutim, setIsLikutim]           = useState(false);
  const [languages, setLanguages]           = useState([]);
  const [language, setLanguage]             = useState(contentLanguage);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [pdf, setPdf]                       = useState(null);
  const [file, setFile]                     = useState(null);
  const [setting, setSettings]              = useState({});

  // get files data for all sources
  useEffect(() => {
    (unit.sources || [])
      .filter(s => isEmpty(indexById[s]))
      .forEach(s => dispatch(assetsActions.sourceIndex(s)));
  }, [dispatch, indexById, unit.sources]);

  const sourcesDropDownOptions = useMemo(() => {
    const sourceOptions = (unit.sources || [])
      .map(getSourceById)
      .filter(x => !!x)
      .map(x => ({
        value: x.id,
        text: tracePath(x, getSourceById).map(y => y.name).join(' > '),
        disabled: indexById[x.id] && !indexById[x.id].data && !indexById[x.id].wip,
      }));

    const likutimOptions = getLikutimUnits(unit)
      .map(x => ({
        value: x.id,
        text: t(`constants.content-types.${x.content_type}`),
        type: x.content_type,
        disabled: false,
      })) || [];

    return [...sourceOptions, ...likutimOptions];
  }, [getSourceById, indexById, t, unit]);

  // when options are changed, change selected unit if was not selected explicitly
  useEffect(() => {
    const newSelectedUnitId = sourcesDropDownOptions.find(x => !x.disabled)?.value;
    setSelectedUnitId(unitId => unitId && (unit.sources || []).includes(unitId) ? unitId : newSelectedUnitId);
  }, [sourcesDropDownOptions, unit.sources]);

  useEffect(() => {
    const isLikutimVal = sourcesDropDownOptions.find(o => o.value === selectedUnitId && o.type === CT_LIKUTIM);
    setIsLikutim(!!isLikutimVal);
  }, [sourcesDropDownOptions, selectedUnitId]);

  useEffect(() => {
    const newLanguages = isLikutim
      ? getLikutimLanguages(unit)
      : getSourceLanguages(indexById[selectedUnitId]);

    setLanguages(newLanguages);
  }, [indexById, isLikutim, selectedUnitId, unit]);

  useEffect(() => {
    if (languages.length > 0) {
      const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

      // use existing state language if included in available languages
      setLanguage(lang => lang && languages.includes(lang) ? lang : newLanguage);
    }
  }, [contentLanguage, languages, uiLanguage]);

  useEffect(() => {
    let file;
    if (isLikutim) {
      file = getLikutimFiles(unit, selectedUnitId).find(x => x.language === language);
    } else {
      const langFiles = indexById[selectedUnitId]?.data?.[language];

      if (langFiles) {
        const { pdf, docx, doc } = langFiles;
        if (pdf && isTaas(selectedUnitId)) {
          // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
          setPdf(pdf);
          setFile(null);
          return;
        }

        file = docx || doc || {};
      }
    }

    setFile(file);
    setPdf(null);
  }, [indexById, isLikutim, language, selectedUnitId, unit]);

  useEffect(() => {
    if (!selectedUnitId || !language || !file || !file.id) {
      return;
    }

    const newFetch = `${selectedUnitId}#${language}#${file.id}`;
    if (newFetch === fetched) {
      // console.log('fetched already', newFetch);
      return;
    }

    dispatch(assetsActions.doc2html(file.id));
    setFetched(newFetch);
  }, [dispatch, fetched, file, language, selectedUnitId]);

  const noSourcesMsg          = <Segment basic>{t('materials.sources.no-sources')}</Segment>;
  const noSourcesAvailableMsg = <Segment basic>{t('materials.sources.no-source-available')}</Segment>;

  const getContents = () => {
    if (pdf) {
      return <PDF pdfFile={physicalFile(pdf)} pageNumber={1} startsFrom={startsFrom(selectedUnitId)} />;
    } else if (file?.id && doc2htmlById[file.id]) {
      return getFileContents();
    }

    return noSourcesAvailableMsg;
  };

  const getFileContents = () => {
    const { wip, err, data } = doc2htmlById[file.id];

    if (err) {
      return getSourceErrorSplash(err, t);
    } else if (wip) {
      return wipLoadingSplash(t);
    }

    const direction = getLanguageDirection(language);
    return (
      <div className="font_settings-wrapper">
        <div
          className="font_settings doc2html"
          style={{ direction }}
        >
          <ScrollToSearch
            data={data}
            language={language}
            pathname={`/${language}/${isLikutim ? 'likutim' : 'sources'}/${selectedUnitId}`}
          />
        </div>
      </div>
    );
  };

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const handleLanguageChanged = (e, lang) => setLanguage(lang);
  const handleSourceChanged   = (e, data) => setSelectedUnitId(data.value);

  if (sourcesDropDownOptions.length === 0) {
    return noSourcesMsg;
  }

  if (!selectedUnitId || (!pdf && !file)) {
    return noSourcesAvailableMsg;
  }

  const url = file && physicalFile(file, true);
  return (
    <div
      className={clsx({
        source: true,
        [`is-${setting.theme}`]: true,
        [`is-${setting.fontType}`]: true,
        [`size${setting.fontSize}`]: true,
      })}
    >
      <Menu
        stackable
        secondary
        compact
        fluid
        className={
          clsx({
            'no-margin-top': !isMobileDevice,
            'no_print': true,
            'justify_content_end': true
          })
        }
      >
        <Menu.Item>
          <Dropdown
            fluid={isMobileDevice}
            selection
            value={selectedUnitId}
            options={sourcesDropDownOptions}
            selectOnBlur={false}
            selectOnNavigation={false}
            onChange={handleSourceChanged}
          />
        </Menu.Item>
        <Menu.Item className="justify_content_end">
          {
            languages.length > 0 && (
              <div className="display-iblock margin-right-8 margin-left-8">
                <MenuLanguageSelector
                  languages={languages}
                  defaultValue={language}
                  onSelect={handleLanguageChanged}
                  fluid={false}
                />
              </div>
            )
          }
          {<Download path={url} mimeType={file.mimetype} downloadAllowed={true} filename={file.name} />}
          <UnitBar handleSettings={setSettings} fontSize={setting.fontSize} />
        </Menu.Item>
      </Menu>
      <Divider hidden fitted className="clear" />
      {getContents()}
    </div>
  );
};

Sources.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Sources);
