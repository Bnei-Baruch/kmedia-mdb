import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';

import { assetUrl } from '../../../../../../helpers/Api';
import { CT_KITEI_MAKOR, MT_TEXT, RTL_LANGUAGES } from '../../../../../../helpers/consts';
import { formatError, tracePath } from '../../../../../../helpers/utils';
import * as shapes from '../../../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../../../shared/Splash/Splash';
import ButtonsLanguageSelector from '../../../../../Language/Selector/ButtonsLanguageSelector';
import PDF from '../../../../../shared/PDF/PDF';
import { selectSuitableLanguage } from '../../../../../../helpers/language';

class Sources extends Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    indexMap: PropTypes.objectOf(shapes.DataWipErr).isRequired,
    content: shapes.DataWipErr.isRequired,
    doc2htmlById: PropTypes.objectOf(shapes.DataWipErr).isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
    getSourceById: PropTypes.func.isRequired,
  };

  state = {
    options: [],
    languages: [],
    selected: null,
    isMakor: false,
    language: null,
  };

  componentDidMount() {
    this.myReplaceState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // unit has changed - replace all state
    if (nextProps.unit.id !== this.props.unit.id) {
      this.myReplaceState(nextProps);
      return;
    }

    const { selected } = this.state;

    // if no previous selection - replace all state
    if (!selected) {
      this.myReplaceState(nextProps);
      return;
    }

    if (!this.state.isMakor) {
      const idx  = this.props.indexMap[selected];
      const nIdx = nextProps.indexMap[selected];

      if (nIdx === idx) {
        return;
      }

      // if prev idx for current selection is missing and now we have it - use it
      if (nIdx && nIdx.data && !(idx && idx.data)) {
        const options                 = this.getSourceOptions(nextProps);
        const { languages, language } = this.getSourceLanguages(nIdx, nextProps.uiLanguage, nextProps.contentLanguage);
        this.setState({ options, languages, language });
        this.changeContent({ selected, language, props: nextProps });
      } else {
        // we keep previous selection. Source options must be updated anyway
        this.setState({ options: this.getSourceOptions(nextProps) });
      }
    }
  }

  getKiteiMakorUnits = unit =>
    Object.values(unit.derived_units || {})
      .filter(x =>
        x.content_type === CT_KITEI_MAKOR &&
        (x.files || []).some(f => f.type === MT_TEXT));

  getSourceOptions = (props) => {
    const { unit, indexMap, getSourceById, t } = props;

    const sourceOptions = (unit.sources || []).map(getSourceById).filter(x => !!x).map(x => ({
      value: x.id,
      text: tracePath(x, getSourceById).map(y => y.name).join(' > '),
      disabled: indexMap[x.id] && !indexMap[x.id].data && !indexMap[x.id].wip,
    }));

    const derivedOptions = this.getKiteiMakorUnits(unit)
      .map(x => ({
        value: x.id,
        text: t(`constants.content-types.${x.content_type}`),
        type: x.content_type,
        disabled: false,
      })) || [];

    return [...sourceOptions, ...derivedOptions];
  };

  getSourceLanguages = (idx, uiLanguage, contentLanguage) => {
    if (!idx || !idx.data) {
      return { languages: [], language: null };
    }
    const languages = Array.from(Object.keys(idx.data));
    const language  = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

    return { languages, language };
  };

  getMakorLanguages = (files, uiLanguage, contentLanguage) => {
    if (!files) {
      return { languages: [], language: null };
    }

    const languages = files.map(f => f.language);
    let language    = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    if (languages.length > 0) {
      language = languages.indexOf(language) === -1 ? languages[0] : language;
    }

    return { languages, language };
  };

  getKiteiMakorFiles = (unit, ktCUID) => {
    const ktCUs = this.getKiteiMakorUnits(unit);

    let cu;
    if (ktCUID) {
      cu = ktCUs.find(x => x.id === ktCUID);
    } else {
      cu = ktCUs.length > 0 ? ktCUs[0] : null;
    }

    return cu ? cu.files.filter(f => f.type === MT_TEXT) : null;
  };

  checkIsMakor = (options, selected) => {
    const val = options.find(o => o.value === selected);
    return val && val.type === CT_KITEI_MAKOR;
  };

  handleLanguageChanged = (e, language) => {
    this.changeContent({ language });
    this.setState({ language });
  };

  handleSourceChanged = (e, data) => {
    const selected = data.value;

    if (this.state.selected === selected) {
      e.preventDefault();
      return;
    }
    const { indexMap, contentLanguage, unit } = this.props;
    const { language: uiLanguage }            = this.state;
    const isMakor                             = this.checkIsMakor(this.state.options, selected);

    const { languages, language } = isMakor ?
      this.getMakorLanguages(this.getKiteiMakorFiles(unit), uiLanguage, contentLanguage) :
      this.getSourceLanguages(indexMap[selected], uiLanguage, contentLanguage);

    this.setState({ selected, languages, language, isMakor });
    this.changeContent({ selected, language, isMakor });
  };

  myReplaceState = (nextProps) => {
    const options                  = this.getSourceOptions(nextProps);
    const available                = options.filter(x => !x.disabled);
    const selected                 = (available.length > 0) ? available[0].value : null;
    const isMakor                  = this.checkIsMakor(options, selected);
    const ktFiles                  = this.getKiteiMakorFiles(nextProps.unit);
    const { contentLanguage }      = nextProps;
    const { language: uiLanguage } = this.state;

    const { languages, language } = isMakor ?
      this.getMakorLanguages(ktFiles, uiLanguage, contentLanguage) :
      this.getSourceLanguages(nextProps.indexMap[selected], uiLanguage, contentLanguage);

    this.setState({ options, languages, language, selected, isMakor, });
    this.changeContent({ selected, language, props: nextProps, isMakor, });
  };

  changeContent = (params) => {
    const
      {
        selected = this.state.selected,
        language = this.state.language,
        props    = this.props,
        isMakor  = this.state.isMakor
      } = params;

    if (!selected || !language) {
      return;
    }

    const { unit, indexMap, onContentChange } = props;

    if (isMakor) {
      const derived = this.getKiteiMakorFiles(unit, selected).find(x => x.language === language);
      onContentChange(null, null, derived.id);
    } else if (indexMap[selected] && indexMap[selected].data) {
      const data = indexMap[selected].data[language];
      if (data.pdf && PDF.isTaas(selected)) {
        // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
        return;
      }
      onContentChange(selected, data.html);
    }
  };

  render() {
    const { unit, content, doc2htmlById, t, indexMap, }                    = this.props;
    const { options, selected, isMakor, languages, language: uiLanguage, } = this.state;

    // console.log('render', { props: this.props, state: this.state });

    if (options.length === 0) {
      return <Segment basic>{t('materials.sources.no-sources')}</Segment>;
    }

    if (!selected) {
      return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
    }

    const isTaas     = PDF.isTaas(selected);
    const startsFrom = PDF.startsFrom(selected);
    let pdfFile;

    if (isTaas && indexMap[selected] && indexMap[selected].data) {
      pdfFile = indexMap[selected].data[uiLanguage].pdf;
    }

    let contentStatus = content;
    if (isMakor) {
      const actualFile = this.getKiteiMakorFiles(unit, selected).find(x => x.language === uiLanguage);
      contentStatus    = doc2htmlById[actualFile.id] || {};
    }
    const { wip: contentWip, err: contentErr, data: contentData } = contentStatus;

    let contents;
    if (contentErr) {
      if (contentErr.response && contentErr.response.status === 404) {
        contents = (
          <FrownSplash
            text={t('messages.source-content-not-found')}
          />
        );
      } else {
        contents = <ErrorSplash text={t('messages.server-error')} subtext={formatError(contentErr)} />;
      }
    } else if (contentWip) {
      contents = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (isTaas && pdfFile) {
      contents =
        <PDF pdfFile={assetUrl(`sources/${selected}/${pdfFile}`)} pageNumber={1} startsFrom={startsFrom} />;
    } else {
      const direction = RTL_LANGUAGES.includes(uiLanguage) ? 'rtl' : 'ltr';
      // eslint-disable-next-line react/no-danger
      contents        = <div className="doc2html" style={{ direction }} dangerouslySetInnerHTML={{ __html: contentData }} />;
    }

    return (
      <div>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16 - languages.length}>
              <Dropdown
                fluid
                selection
                value={selected}
                options={options}
                selectOnBlur={false}
                selectOnNavigation={false}
                onChange={this.handleSourceChanged}
              />
            </Grid.Column>
            {
              languages.length > 0 ?
                <Grid.Column width={languages.length} textAlign="right">
                  <ButtonsLanguageSelector
                    languages={languages}
                    defaultValue={uiLanguage}
                    t={t}
                    onSelect={this.handleLanguageChanged}
                  />
                </Grid.Column> :
                null
            }
          </Grid.Row>
        </Grid>
        <Divider hidden />
        {contents}
      </div>
    );
  }
}

export default Sources;
