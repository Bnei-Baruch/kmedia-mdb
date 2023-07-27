import React, { useContext, useEffect, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Divider, Dropdown, Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { selectors } from '../../../../../../redux/modules/sources';
import { actions as assetsActions, selectors as assetsSelectors } from '../../../../../../redux/modules/assets';
import { isEmpty, physicalFile, tracePath } from '../../../../../../helpers/utils';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { getLanguageName, selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import { CT_LIKUTIM, CT_SOURCE, MT_TEXT, MT_AUDIO } from '../../../../../../helpers/consts';
import { getSourceErrorSplash, wipLoadingSplash } from '../../../../../shared/WipErr/WipErr';
import AudioPlayer from '../../../../../shared/AudioPlayer';
import PDF, { isTaas, startsFrom } from '../../../../../shared/PDF/PDF';
import ScrollToSearch from '../../../../../shared/DocToolbar/ScrollToSearch';
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

  return cu?.files || [];
};

const getLikutimLanguages = unit => {
  const files = getLikutimFiles(unit).filter(f => f.type === MT_TEXT);
  return files.length > 0 ? files.map(f => f.language) : [];
};

const getSourceLanguages = idx => idx?.data ? [...Object.keys(idx.data)] : [];

const getDownloadProps = (pdf, file) => {
  const d = pdf || file;
  if (!d) return {};

  const path = physicalFile(d, true);

  const { mimetype: mimeType, name: filename } = d;
  return { path, downloadAllowed: true, mimeType, filename };
};

const Sources = ({ unit, t }) => {
  const getSourceById    = useSelector(state => selectors.getSourceById(state.sources), shallowEqual);
  const indexById        = useSelector(state => assetsSelectors.getSourceIndexById(state.assets), shallowEqual);
  const uiLang           = useSelector(state => settings.getUILang(state.settings));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const doc2htmlById     = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));
  const dispatch         = useDispatch();

  const [fetched, setFetched]               = useState(null);
  const [isLikutim, setIsLikutim]           = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [pdf, setPdf]                       = useState(null);
  const [file, setFile]                     = useState(null);
  const [mp3, setMp3]                       = useState(null);
  const [setting, setSettings]              = useState({});
  const [sourceLanguages, setSourceLanguages] = useState([]);
  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('');

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

  // Following AsString variables are for useEffect to not evaluate infinitelly.
  const optionsAsString = sourcesDropDownOptions.map(o => o.value).sort().join(',');
  const sourcesAsString = (unit.sources || []).slice().sort().join(',');

  // When options are changed, change selected unit if was not selected explicitly
  useEffect(() => {
    const newSelectedUnitId = sourcesDropDownOptions.find(x => !x.disabled)?.value;
    setSelectedUnitId(unitId => unitId && (unit.sources || []).includes(unitId) ? unitId : newSelectedUnitId);
  }, [optionsAsString, sourcesAsString]);

  useEffect(() => {
    const isLikutimVal = sourcesDropDownOptions.find(o => o.value === selectedUnitId && o.type === CT_LIKUTIM);
    setIsLikutim(!!isLikutimVal);
  }, [optionsAsString, selectedUnitId]);

  useEffect(() => {
    const newLanguages = isLikutim
      ? getLikutimLanguages(unit)
      : getSourceLanguages(indexById[selectedUnitId]);

    if (newLanguages.some((lang, index) => sourceLanguages[index] !== lang)) {
      setSourceLanguages(newLanguages);
    }
  }, [indexById, isLikutim, selectedUnitId, unit, sourceLanguages]);

  useEffect(() => {
    if (sourceLanguages.length > 0) {
      // Init selected language based on available source languages, user predefined content languages and
      // unit original language..
      const newLanguage = selectSuitableLanguage(contentLanguages, sourceLanguages, unit.original_language);
      setSelectedSourceLanguage(newLanguage);
    }
  }, [contentLanguages, sourceLanguages, unit.original_language]);

  useEffect(() => {
    let file;
    if (isLikutim) {
      const files = getLikutimFiles(unit, selectedUnitId).filter(f => f.language === selectedSourceLanguage);
      file = files.find(f => f.type === MT_TEXT);
      const mp3 = files.find(f => f.type === MT_AUDIO);
      setMp3(mp3);
    } else {
      const langFiles = indexById[selectedUnitId]?.data?.[selectedSourceLanguage];

      if (langFiles) {
        const { pdf, docx, doc, mp3 } = langFiles;

        if (pdf && isTaas(selectedUnitId)) {
          // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
          setPdf(pdf);
          setFile(null);
          return;
        }

        setMp3(mp3);

        file = docx || doc || {};
      }
    }

    setFile(file);
    setPdf(null);
  }, [indexById, isLikutim, selectedSourceLanguage, selectedUnitId, unit]);

  useEffect(() => {
    if (!selectedUnitId || !selectedSourceLanguage || !file || !file.id) {
      return;
    }

    const newFetch = `${selectedUnitId}#${selectedSourceLanguage}#${file.id}`;
    if (newFetch === fetched) {
      return;
    }

    dispatch(assetsActions.doc2html(file.id));
    setFetched(newFetch);
  }, [dispatch, fetched, file, selectedSourceLanguage, selectedUnitId]);

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

    const direction = getLanguageDirection(selectedSourceLanguage);
    return (
      <div className="font_settings-wrapper">
        <div
          className="font_settings doc2html"
          style={{ direction }}
        >
          <ScrollToSearch
            data={data}
            language={selectedSourceLanguage}
            pathname={`/${selectedSourceLanguage}/${isLikutim ? 'likutim' : 'sources'}/${selectedUnitId}`}
            source={{
              subject_uid: selectedUnitId,
              subject_type: isLikutim ? CT_LIKUTIM : CT_SOURCE
            }}
            label={{ content_unit: selectedUnitId }}
          />
        </div>
      </div>
    );
  };

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const handleLanguageChanged = (lang) => setSelectedSourceLanguage(lang);
  const handleSourceChanged   = (e, data) => setSelectedUnitId(data.value);

  if (sourcesDropDownOptions.length === 0) {
    return noSourcesMsg;
  }

  if (!selectedUnitId || (!pdf && !file)) {
    return noSourcesAvailableMsg;
  }

  const downloadProps = getDownloadProps(pdf, file);

  const unitData = indexById[selectedUnitId] && indexById[selectedUnitId].data;
  const menuOptionText = (language) => getLanguageName(language) + (unitData && unitData[language] && unitData[language].mp3 ? ' \uD83D\uDD0A' : '')

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
        floated='right'
        className={
          clsx({
            'no-margin-top': isMobileDevice,
            'no_print': true,
            'justify_content_end': true,
          })
        }
      >
        {
          sourcesDropDownOptions.length > 1 &&
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
        }
        <Menu.Item fitted>
          {
            sourceLanguages.length > 0 && (
              <div className="display-iblock margin-right-8 margin-left-8">
                <MenuLanguageSelector
                  languages={sourceLanguages}
                  selected={selectedSourceLanguage}
                  onLanguageChange={handleLanguageChanged}
                  multiSelect={false}
                  optionText={menuOptionText}
                />
              </div>
            )
          }
          { <Download {...downloadProps} /> }
          <UnitBar
            handleSettings={setSettings}
            fontSize={setting.fontSize}
            source={{ subject_uid: selectedUnitId, subject_type: isLikutim ? CT_LIKUTIM : CT_SOURCE }}
            label={{ content_unit: selectedUnitId }}
          />
        </Menu.Item>
        {
          mp3 &&
          <Menu.Item fitted='horizontally'>
            <AudioPlayer file={mp3} />
          </Menu.Item>
        }
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

export default withTranslation()(Sources);
