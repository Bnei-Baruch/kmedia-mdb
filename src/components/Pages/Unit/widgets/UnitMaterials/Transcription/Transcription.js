import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { Menu, Segment } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import clsx from 'clsx';

import { CT_ARTICLE, CT_RESEARCH_MATERIAL, MT_TEXT } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import { physicalFile } from '../../../../../../helpers/utils';
import playerHelper from '../../../../../../helpers/player';
import MediaHelper from '../../../../../../helpers/media';
import { getQuery } from '../../../../../../helpers/url';
import ScrollToSearch from '../../../../../shared/ScrollToSearch';
import Download from '../../../../../shared/Download/Download';
import WipErr from '../../../../../shared/WipErr/WipErr';
import * as shapes from '../../../../../shapes';
import MenuLanguageSelector from '../../../../../Language/Selector/MenuLanguageSelector';
import UnitBar from '../UnitBar';

class Transcription extends Component {
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
    // const { unit, type } = props;
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    if (!type) {
      // filter text files, but not PDF
      return unit.files.filter(x => MediaHelper.IsText(x) && !MediaHelper.IsPDF(x));
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
    const { contentLanguage, uiLanguage, unit, type, location } = props;
    const { selectedFileId }                                    = getQuery(location);

    const textFiles = Transcription.getTextFiles(unit, type);
    const languages = uniq(textFiles.map(x => x.language));
    let newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
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
      return { selectedFile: state.selectedFile, languages, language: newLanguage, textFiles };
    }

    const fileFromLocation = textFiles.find(f => f.id === selectedFileId);
    const selectedFile     = fileFromLocation || Transcription.selectFile(textFiles, newLanguage);
    return { selectedFile, languages, language: newLanguage, textFiles, unit_id: unit.id };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { props, state } = this;
    return (nextProps.uiLanguage !== props.uiLanguage)
      || (nextProps.contentLanguage !== props.contentLanguage)
      || (nextProps.unit && !props.unit)
      || (nextProps.unit.id !== props.unit.id)
      || (nextProps.unit.files !== props.unit.files
        || !isEqual(nextProps.doc2htmlById, props.doc2htmlById)
        || (state.selectedFile && props.doc2htmlById && (props.doc2htmlById[state.selectedFile.id]?.wip !== nextProps.doc2htmlById[state.selectedFile.id]?.wip))
        || nextState.language !== state.language
        || nextState.selectedFile !== state.selectedFile
        || nextState.settings !== state.settings);
  }

  componentDidMount() {
    const { selectedFile } = this.state;

    this.loadFile(selectedFile);
    document.addEventListener('mouseup', this.handleOnMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleOnMouseUp);
  }

  componentDidUpdate(prevProp, prevState) {
    const { selectedFile, language } = this.state;

    if (selectedFile !== prevState.selectedFile || language !== prevState.language) {
      this.loadFile(selectedFile);
    }
  }

  loadFile = selectedFile => {
    if (selectedFile && selectedFile.id) {
      const { doc2htmlById, onContentChange } = this.props;
      const { data }                          = doc2htmlById[selectedFile.id] || {};

      if (!data) {
        // load from redux
        onContentChange(selectedFile.id);
      }
    }
  };

  handleLanguageChanged = (e, newLanguage) => {
    const { language, textFiles } = this.state;

    if (newLanguage === language) {
      e.preventDefault();
      return;
    }

    const selectedFile = Transcription.selectFile(textFiles, newLanguage);

    this.setState({ selectedFile, language: newLanguage });
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
    const { textFiles, selectedFile, language } = this.state;
    const { location, activeTab }               = this.props;

    const ap                = playerHelper.getActivePartFromQuery(location);
    const selectedFileProps = selectedFile ? `&selectedFileId=${selectedFile.id}` : '';
    const urlParams         = `activeTab=${activeTab}${selectedFileProps}${!ap ? '' : `&ap=${ap}`}`;
    const direction         = getLanguageDirection(language);

    return (
      <div className="font_settings-wrapper">
        {this.getSelectFiles(selectedFile, textFiles)}
        <div
          className="font_settings doc2html"
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        >
          <ScrollToSearch data={data} language={language} urlParams={urlParams} />
        </div>
      </div>
    );
  };

  handleSettings = settings => this.setState({ settings });

  render() {
    const { doc2htmlById, t, type }                       = this.props;
    const { selectedFile, languages, language, settings } = this.state;
    const { isMobileDevice }                              = this.context;

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

      const url                                         = physicalFile(selectedFile, true);
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
                'no-margin-top': !isMobileDevice,
                'no_print': true,
                'justify_content_end': true
              })
            }
          >
            {
              languages.length > 1 &&
              <Menu.Item>
                <MenuLanguageSelector
                  languages={languages}
                  defaultValue={language}
                  onSelect={this.handleLanguageChanged}
                  fluid={false}
                />
              </Menu.Item>
            }
            <Menu.Item>
              {<Download path={url} mimeType={mimetype} downloadAllowed={true} filename={name} />}
              <UnitBar handleSettings={this.handleSettings} fontSize={fontSize} />
            </Menu.Item>
          </Menu>
          {content}
        </div>
      );
    }

    return null;
  }
}

Transcription.propTypes = {
  unit: shapes.ContentUnit,
  doc2htmlById: PropTypes.objectOf(shapes.DataWipErr).isRequired,
  uiLanguage: PropTypes.string.isRequired,
  contentLanguage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  type: PropTypes.string,
  onContentChange: PropTypes.func.isRequired,
  location: shapes.HistoryLocation.isRequired,
};

Transcription.defaultProps = {
  unit: null,
  type: null,
};

export default withNamespaces()(Transcription);
