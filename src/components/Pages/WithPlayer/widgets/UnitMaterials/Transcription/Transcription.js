import React, { useContext, useEffect, useState } from 'react';
import { withTranslation } from 'next-i18next';
import { Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import { assetSlice, selectors, doc2Html } from '../../../../../../../lib/redux/slices/assetSlice';
import { selectors as settings } from '../../../../../../../lib/redux/slices/settingsSlice/settingsSlice';

import { CT_ARTICLE, CT_RESEARCH_MATERIAL, MT_TEXT, INSERT_TYPE_SUMMARY } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { DeviceInfoContext, SessionInfoContext } from '../../../../../../helpers/app-contexts';
import { physicalFile } from '../../../../../../helpers/utils';
import { getActivePartFromQuery } from '../../../../../../../lib/redux/slices/playlistSlice/helper';
import MediaHelper from '../../../../../../helpers/media';
import ScrollToSearch from '../../../../../../helpers/scrollToSearch/ScrollToSearch';
import Download from '../../../../../shared/Download/Download';
import WipErr from '../../../../../shared/WipErr/WipErr';
import * as shapes from '../../../../../shapes';
import MenuLanguageSelector from '../../../../../Language/Selector/MenuLanguageSelector';
import UnitBar from '../UnitBar';
import { useSearchParams } from 'next/navigation';

const getUnitDerivedArticle = (unit, type) => {
  // suitable for having either derived articles or research materials only
  const ct    = type === 'articles' ? CT_ARTICLE : CT_RESEARCH_MATERIAL;
  const units = Object.values(unit.derived_units || {})
    .filter(x => x.content_type === ct
      && (x.files || []).some(f => f.type === MT_TEXT));

  units.forEach(unit => {
    unit.files.forEach(file => file.title = unit.name);
  });

  return units.map(x => x.files)
    .reduce((acc, files) => [...acc, ...files], []);
};

const getTextFiles = (unit, type) => {
  if (!unit || !Array.isArray(unit.files)) {
    return [];
  }

  if (!type) {
    // filter text files, but not PDF
    return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsPDF(x) && x.insert_type !== INSERT_TYPE_SUMMARY);
  }

  return getUnitDerivedArticle(unit, type);
};

const selectFile = (textFiles, language) => {
  const selectedFiles = textFiles.filter(x => x.language === language);

  if (selectedFiles.length <= 1) {
    // use the only file found OR no files by language - use first text file
    return selectedFiles[0];
  }

  // many files by language - get the largest - it is probably the transcription
  return selectedFiles.reduce((acc, file) => (acc.size < file.size ? file : acc));
};

const Transcription = ({ unit, t, type, activeTab }) => {
  const query            = useSearchParams();
  const doc2htmlById     = useSelector(state => selectors.getDoc2htmlById(state.assets));
  const uiLang           = useSelector(state => settings.getUILang(state.settings));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [viewSettings, setViewSettings]         = useState({});

  const textFiles           = getTextFiles(unit, type);
  const transcriptLanguages = uniq(textFiles.map(x => x.language));
  const { selectedFileId }  = query;
  const fileFromLocation    = textFiles.find(f => f.id === selectedFileId);
  const selectedFile        = fileFromLocation || selectFile(textFiles, selectedLanguage);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  //const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedFile?.id) {
      return;
    }

    // Why is that needed?!

    const { data } = doc2htmlById[selectedFile.id] || {};
    if (!data) {
      // Load from redux.
      dispatch(doc2Html(selectedFile.id));
    }
    //}, [selectedFile]);
  }, [selectedFile?.id]);

  useEffect(() => {
    let newLanguage = selectSuitableLanguage(contentLanguages, transcriptLanguages, unit.original_language);
    if (textFiles.length === 0) {
      newLanguage = undefined;
    }

    if (newLanguage !== undefined && selectedLanguage && selectedLanguage !== newLanguage) {
      newLanguage = selectedLanguage;
    }
    setSelectedLanguage(newLanguage);
    // }, [unit, type, contentLanguages]);
  }, []);

  const { id, name, mimetype } = selectedFile || false;
  const { data, wip, err }     = doc2htmlById[id] || {};

  const fileCU = unit.files?.some(f => f.id === id);

  const wipErr = WipErr({ wip, err, t });

  if (wipErr) {
    return wipErr;
  }
  if (!selectedFile) {
    const text = type || 'transcription';
    return <Segment basic>{t(`materials.${text}.no-content`)}</Segment>;
  }

  if (!data) {
    return null;
  }

  const getSelectFiles = (selectedFile, textFiles) => {
    if (!textFiles)
      return null;
    const relevantTextFiles = textFiles.filter(t => t.title);
    if (relevantTextFiles.length === 0)
      return null;
    return <select
      className="doc2html-dropdown-container"
      value={selectedFile.id}
      onChange={null/*e => this.setState({ selectedFile: textFiles.find(t => t.id === e.currentTarget.value) })*/}
    >
      {
        textFiles.map(x =>
          <option key={`opt-${x.id}`} value={x.id}>
            {x.title}
          </option>)
      }
    </select>;
  };

  const prepareContent = data => {
    const ap                = getActivePartFromQuery(query);
    const selectedFileProps = selectedFile ? `&selectedFileId=${selectedFile.id}` : '';
    const urlParams         = `activeTab=${activeTab}${selectedFileProps}${!ap ? '' : `&ap=${ap}`}`;
    const direction         = getLanguageDirection(selectedLanguage);

    return fileCU && (
      <div className="font_settings-wrapper">
        {
          getSelectFiles(selectedFile, textFiles)
        }
        <div
          className="font_settings doc2html"
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        >
          <ScrollToSearch
            data={data}
            language={selectedLanguage}
            urlParams={urlParams}
            source={{
              subject_uid: unit.id,
              subject_type: unit.content_type,
              properties: { activeTab }
            }}
            label={activeTab !== 'research' ? { content_unit: fileCU } : null}
          />
        </div>
      </div>
    );
  };

  const content = prepareContent(data);
  const url     = physicalFile(selectedFile, true);

  const { theme = 'light', fontType, fontSize = 0 } = viewSettings || {};

  const handleLanguageChanged = (newLanguage) => {
    if (newLanguage === selectedLanguage) {
      return;
    }
    setSelectedLanguage(newLanguage);
  };

  return (
    <div
      className={clsx({
        source: true,
        [`is-${theme}`]: true,
        [`is-${fontType}`]: true,
        [`size${fontSize}`]: true,
      })}
    >
      <Menu
        secondary
        compact
        fluid
        className={
          clsx({
            'no-margin-top': isMobileDevice,
            'no_print': true,
            'justify_content_end': true
          })
        }
      >
        {
          transcriptLanguages.length > 1 &&
          <Menu.Item>
            <MenuLanguageSelector
              languages={transcriptLanguages}
              selected={selectedLanguage}
              onLanguageChange={handleLanguageChanged}
              multiSelect={false}
            />
          </Menu.Item>
        }
        <Menu.Item>
          {<Download path={url} mimeType={mimetype} downloadAllowed={true} filename={name} />}
          <UnitBar
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
/*

class OldTranscription extends Component {
  static contextType = DeviceInfoContext;

  state = {};

  static selectFile = (textFiles, language) => {
    const selectedFiles = textFiles.filter(x => x.language === language);

    if (selectedFiles.length <= 1) {
      // use the only file found OR no files by language - use first text file
      return selectedFiles[0];
    }

    // many files by language - get the largest - it is probably the transcription
    return selectedFiles.reduce((acc, file) => (acc.size < file.size ? file : acc));
  };

  static getTextFiles = (unit, type) => {
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    if (!type) {
      // filter text files, but not PDF
      return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsPDF(x) && x.insert_type !== INSERT_TYPE_SUMMARY);
    }

    return Transcription.getUnitDerivedArticle(unit, type);
  };

  static getUnitDerivedArticle(unit, type) {
    // suitable for having either derived articles or research materials only
    const ct    = type === 'articles' ? CT_ARTICLE : CT_RESEARCH_MATERIAL;
    const units = Object.values(unit.derived_units || {})
      .filter(x => x.content_type === ct
        && (x.files || []).some(f => f.type === MT_TEXT));

    units.forEach(unit => {
      unit.files.forEach(file => file.title = unit.name);
    });

    return units.map(x => x.files)
      .reduce((acc, files) => [...acc, ...files], []);
  }

  static getDerivedStateFromProps(props, state) {
    const { contentLanguages, uiLang, unit, type, location } = props;
    const { selectedFileId }                                 = getQuery(location);

    const textFiles = Transcription.getTextFiles(unit, type);
    const transcriptLanguages = uniq(textFiles.map(x => x.language));
    let newLanguage = selectSuitableLanguage(contentLanguages, transcriptLanguages , unit.original_language);
    if (!newLanguage) {
      return false;
    }

    if (textFiles.length === 0) {
      newLanguage = undefined;
    }

    if (newLanguage !== undefined && state.language && state.language !== newLanguage) {
      newLanguage = state.language;
    }

    if (state.selectedFile && unit.id === state.unit_id) {
      return { transcriptLanguages, selectedLanguage: newLanguage, textFiles };
    }

    const fileFromLocation = textFiles.find(f => f.id === selectedFileId);
    const selectedFile     = fileFromLocation || Transcription.selectFile(textFiles, newLanguage);
    return { selectedFile, transcriptLanguages, selectedLanguage: newLanguage, textFiles, unit_id: unit.id };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    return (nextProps.uiLang !== props.uiLang)
      || (nextProps.contentLanguage !== props.contentLanguage)
      || (nextProps.unit && !props.unit)
      || (nextProps.unit.id !== props.unit.id)
      || nextProps.unit.files !== props.unit.files
      || (
        nextState.settings !== state.settings
        || nextState.selectedLanguage !== state.selectedLanguage
        || nextState.fileCU !== state.fileCU
        || nextState.selectedFile !== state.selectedFile
        || !isEqual(nextProps.doc2htmlById, props.doc2htmlById)
        || (!!state.selectedFile && props.doc2htmlById
          && (props.doc2htmlById[state.selectedFile.id]?.wip !== nextProps.doc2htmlById[state.selectedFile.id]?.wip))
      );
  }

  componentDidMount() {
    const { selectedFile } = this.state;

    this.loadFile(selectedFile);
  }

  componentDidUpdate(prevProp, prevState) {
    const { selectedFile, selectedLanguage } = this.state;

    if (selectedFile !== prevState.selectedFile || selectedLanguage !== prevState.selectedLanguage) {
      this.loadFile(selectedFile);
    }
  }

  loadFile = selectedFile => {
    if (!selectedFile?.id)
      return;

    this.loadFileCU(selectedFile.id);
    const { doc2htmlById, onContentChange } = this.props;
    const { data }                          = doc2htmlById[selectedFile.id] || {};

    if (!data) {
      // load from redux
      onContentChange(selectedFile.id, selectedFile.language);
    }
  };

  loadFileCU = fid => {
    const cu = this.findCUByFile(fid);
    if (!cu) return;

    this.setState({ fileCU: cu.id });

  };

  findCUByFile = fid => {
    const { type, unit } = this.props;
    if (!type)
      return unit;

    return Object.values(unit.derived_units || {})
      .find(x => x.files?.some(f => f.id === fid));

  };

  handleLanguageChanged = (newLanguage) => {
    const { selectedLanguage, textFiles } = this.state;

    if (newLanguage === selectedLanguage) {
      return;
    }

    const selectedFile = Transcription.selectFile(textFiles, newLanguage);

    this.setState({ selectedFile, selectedLanguage: newLanguage });
  };

  getSelectFiles(selectedFile, textFiles) {
    if (!textFiles)
      return null;
    const relevantTextFiles = textFiles.filter(t => t.title);
    if (relevantTextFiles.length === 0)
      return null;
    return <select
      className="doc2html-dropdown-container"
      value={selectedFile.id}
      onChange={e => this.setState({ selectedFile: textFiles.find(t => t.id === e.currentTarget.value) })}
    >
      {
        textFiles.map(x =>
          <option key={`opt-${x.id}`} value={x.id}>
            {x.title}
          </option>)
      }
    </select>;
  }

  prepareContent = data => {
    const { textFiles, selectedFile, selectedLanguage, fileCU } = this.state;
    const { location, activeTab, unit }                 = this.props;

    const ap                = getActivePartFromQuery(location);
    const selectedFileProps = selectedFile ? `&selectedFileId=${selectedFile.id}` : '';
    const urlParams         = `activeTab=${activeTab}${selectedFileProps}${!ap ? '' : `&ap=${ap}`}`;
    const direction         = getLanguageDirection(selectedLanguage);

    return fileCU && (
      <div className="font_settings-wrapper">
        {
          this.getSelectFiles(selectedFile, textFiles)
        }
        <div
          className="font_settings doc2html"
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        >
          <ScrollToSearch
            data={data}
            language={selectedLanguage}
            urlParams={urlParams}
            source={{
              subject_uid: unit.id,
              subject_type: unit.content_type,
              properties: { activeTab }
            }}
            label={activeTab !== 'research' ? { content_unit: fileCU } : null}
          />
        </div>
      </div>
    );
  };

  handleSettings = settings => this.setState({ settings });

  render() {
    const { doc2htmlById, t, type, unit, activeTab }              = this.props;
    const { selectedFile, transcriptLanguages, selectedLanguage, settings, fileCU } = this.state;
    const { isMobileDevice }                                      = this.context;

    if (!selectedFile) {
      const text = type || 'transcription';
      return <Segment basic>{t(`materials.${text}.no-content`)}</Segment>;
    }

    const { id, name, mimetype } = selectedFile;
    const { data, wip, err }     = doc2htmlById[id] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (data) {
      const content = this.prepareContent(data);
      const url     = physicalFile(selectedFile, true);

      const { theme = 'light', fontType, fontSize = 0 } = settings || {};

      return (
        <div
          className={clsx({
            source: true,
            [`is-${theme}`]: true,
            [`is-${fontType}`]: true,
            [`size${fontSize}`]: true,
          })}
        >
          <Menu
            secondary
            compact
            fluid
            className={
              clsx({
                'no-margin-top': isMobileDevice,
                'no_print': true,
                'justify_content_end': true
              })
            }
          >
            {
              transcriptLanguages.length > 1 &&
              <Menu.Item>
                <MenuLanguageSelector
                  languages={transcriptLanguages}
                  selected={selectedLanguage}
                  onLanguageChange={this.handleLanguageChanged}
                  multiSelect={false}
                />
              </Menu.Item>
            }
            <Menu.Item>
              {<Download path={url} mimeType={mimetype} downloadAllowed={true} filename={name} />}
              <UnitBar
                handleSettings={this.handleSettings}
                fontSize={fontSize}
                source={{ subject_uid: unit.id, subject_type: unit.content_type, properties: { activeTab } }}
                label={activeTab !== 'research' ? { content_unit: fileCU } : null}
              />
            </Menu.Item>
          </Menu>
          {content}
        </div>
      );
    }

    return null;
  }
}
*/

Transcription.propTypes = {
  unit: shapes.ContentUnit,
  t: PropTypes.func.isRequired,
  type: PropTypes.string,
  activeTab: PropTypes.string,
};

export default withTranslation()(Transcription);
