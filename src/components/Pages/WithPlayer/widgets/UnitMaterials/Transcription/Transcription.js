import React, { useContext, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import cloneDeep from 'lodash/cloneDeep';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions as assetsActions, selectors } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';

import { CT_ARTICLE, CT_RESEARCH_MATERIAL, MT_TEXT, INSERT_TYPE_SUMMARY } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import { physicalFile } from '../../../../../../helpers/utils';
import { getActivePartFromQuery } from '../../../../../../helpers/player';
import MediaHelper from '../../../../../../helpers/media';
import { getQuery } from '../../../../../../helpers/url';
import ScrollToSearch from '../../../../../shared/DocToolbar/ScrollToSearch';
import Download from '../../../../../shared/Download/Download';
import WipErr from '../../../../../shared/WipErr/WipErr';
import * as shapes from '../../../../../shapes';
import MenuLanguageSelector from '../../../../../Language/Selector/MenuLanguageSelector';
import UnitBar from '../UnitBar';

const getUnitDerivedArticle = (unit, type) => {
  // Suitable for having either derived articles or research materials only
  const ct    = type === 'articles' ? CT_ARTICLE : CT_RESEARCH_MATERIAL;
  const units = cloneDeep(Object.values(unit.derived_units || {})
    .filter(x => x.content_type === ct
      && (x.files || []).some(f => f.type === MT_TEXT)));

  units.forEach(unit => {
    unit.files.forEach(file => file.title = unit.name);
  });

  return units.map(x => x.files)
    .reduce((acc, files) => [...acc, ...files], []);
};

export const getTextFiles = (unit, type) => {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  if (!type) {
    // Keep text files, not PDF, nor summary.
    return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsPDF(x) && x.insert_type !== INSERT_TYPE_SUMMARY);
  }

  return getUnitDerivedArticle(unit, type);
};

export const selectFile = (textFiles, language) => {
  const selectedFiles = textFiles.filter(x => x.language === language);

  if (selectedFiles.length <= 1) {
    // Use the only file found OR no files by language - use first text file
    return selectedFiles[0];
  }

  // Many files by language - get the largest - it is probably the transcription
  return selectedFiles.reduce((acc, file) => (acc.size < file.size ? file : acc));
};

const Transcription = ({ unit, t, type, activeTab }) => {
  const location         = useLocation();
  const doc2htmlById     = useSelector(state => selectors.getDoc2htmlById(state.assets));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const textFiles                               = getTextFiles(unit, type);
  const transcriptLanguages                     = uniq(textFiles.map(x => x.language));
  const suitableLanguage                        = selectSuitableLanguage(contentLanguages, transcriptLanguages, unit.original_language, /*defaultReturnLanguage=*/ '');
  const finalLanguage                           = selectedLanguage || suitableLanguage;

  const [viewSettings, setViewSettings] = useState({});

  const { selectedFileId }                              = getQuery(location);
  const fileFromLocation                                = textFiles.find(f => f.id === selectedFileId);
  const [selectedFileOverride, setSelectedFileOverride] = useState(null);
  const selectedFile                                    = selectedFileOverride || fileFromLocation || selectFile(textFiles, finalLanguage) || {};

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedFile?.id) {
      return;
    }

    const { data } = doc2htmlById[selectedFile.id] || {};
    if (!data) {
      // Load from redux.
      dispatch(assetsActions.doc2html(selectedFile.id));
      dispatch(assetsActions.fetchTimeCode(unit.id, selectedFile.language));
    }
  }, [dispatch, doc2htmlById, selectedFile?.id, unit.id, selectedFile?.language]);

  const getSelectFiles = (file, textFiles) => {
    if (!textFiles)
      return null;
    const relevantTextFiles = textFiles.filter(t => t.title);
    if (relevantTextFiles.length === 0)
      return null;
    return <select
      className="doc2html-dropdown-container"
      value={file.id}
      onChange={e => setSelectedFileOverride(textFiles.find(t => t.id === e.currentTarget.value))}
    >
      {
        textFiles.map(x =>
          <option key={`opt-${x.id}`} value={x.id}>
            {x.title}
          </option>)
      }
    </select>;
  };

  const getFileCU = (id, unit) =>
    (id && Object.values(unit.derived_units || {}).concat([unit]).find(x => x.files?.some(f => f.id === id))) || null;

  const prepareContent = file => {
    if (!file || !file.id) {
      const text = type || 'transcription';
      return <Segment basic>{t(`materials.${text}.no-content`)}</Segment>;
    }

    const { id }             = file;
    const { data, wip, err } = doc2htmlById[id] || {};

    const fileCU = getFileCU(id, unit);

    const wipErr = WipErr({ wip, err, t });

    if (wipErr) {
      return wipErr;
    }

    if (!data) {
      return null;
    }

    const ap                = getActivePartFromQuery(location);
    const selectedFileProps = file ? `&selectedFileId=${file.id}` : '';
    const urlParams         = `activeTab=${activeTab}${selectedFileProps}${!ap ? '' : `&ap=${ap}`}`;
    const direction         = getLanguageDirection(finalLanguage);

    return fileCU && (
      <div className="font_settings-wrapper">
        {
          getSelectFiles(file, textFiles)
        }
        <div
          className="font_settings doc2html"
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        >
          <ScrollToSearch
            data={data}
            language={finalLanguage}
            urlParams={urlParams}
            source={{
              subject_uid : unit.id,
              subject_type: unit.content_type,
              properties  : { activeTab }
            }}
            label={activeTab !== 'research' ? { content_unit: fileCU && fileCU.id } : null}
          />
        </div>
      </div>
    );
  };

  const { id, name, mimetype } = selectedFile;
  const fileCU                 = getFileCU(id, unit);
  const content                = prepareContent(selectedFile);
  const url                    = (id && physicalFile(selectedFile, true)) || '';

  const { theme = 'light', fontType, fontSize = 0 } = viewSettings || {};

  const handleLanguageChanged = newLanguage => {
    if (newLanguage === finalLanguage) {
      return;
    }

    setSelectedLanguage(newLanguage);
  };

  return (
    <div
      className={clsx({
        source             : true,
        [`is-${theme}`]    : true,
        [`is-${fontType}`] : true,
        [`size${fontSize}`]: true
      })}
    >
      <Menu
        secondary
        compact
        fluid
        className={
          clsx({
            'no-margin-top'      : isMobileDevice,
            'no_print'           : true,
            'justify_content_end': true
          })
        }
      >
        <Menu.Item>
          <MenuLanguageSelector
            languages={transcriptLanguages}
            selected={finalLanguage}
            onLanguageChange={handleLanguageChanged}
            multiSelect={false}
          />
        </Menu.Item>
        <Menu.Item>
          <Download path={url} mimeType={mimetype} downloadAllowed={true} filename={name}/>
          <UnitBar
            disabled={!url}
            handleSettings={setViewSettings}
            fontSize={fontSize}
            source={{ subject_uid: unit.id, subject_type: unit.content_type, properties: { activeTab } }}
            label={activeTab !== 'research' ? { content_unit: fileCU } : null}
          />
        </Menu.Item>
      </Menu>
      {content}
    </div>
  );
};

Transcription.propTypes = {
  unit     : shapes.ContentUnit,
  t        : PropTypes.func.isRequired,
  type     : PropTypes.string,
  activeTab: PropTypes.string
};

export default withTranslation()(Transcription);
