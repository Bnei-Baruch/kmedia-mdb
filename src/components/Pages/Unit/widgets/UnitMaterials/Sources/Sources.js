import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';

import { assetUrl } from '../../../../../../helpers/Api';
import { CT_KITEI_MAKOR, MT_TEXT } from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { getLanguageDirection } from '../../../../../../helpers/i18n-utils';
import { formatError, tracePath } from '../../../../../../helpers/utils';
import * as shapes from '../../../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../../../shared/Splash/Splash';
import ButtonsLanguageSelector from '../../../../../Language/Selector/ButtonsLanguageSelector';
import PDF, { isTaas, startsFrom } from '../../../../../shared/PDF/PDF';

const getSourceLanguages = (idx, uiLanguage, contentLanguage) => {
  if (!idx || !idx.data) {
    return { languages: [], language: null };
  }
  const languages = [...Object.keys(idx.data)];
  const language  = selectSuitableLanguage(contentLanguage, uiLanguage, languages);

  return { languages, language };
};

const changeContent = ({ selected, language, unit, indexMap, onContentChange, isMakor }) => {
  if (!selected || !language) {
    return;
  }

  if (isMakor) {
    const derived = getKiteiMakorFiles(unit, selected).find(x => x.language === language);
    onContentChange(null, null, derived.id);
  } else if (indexMap[selected] && indexMap[selected].data) {
    const data = indexMap[selected].data[language];
    if (data.pdf && isTaas(selected)) {
      // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
      return;
    }
    onContentChange(selected, data.html);
  }
};

const getMakorLanguages = (files, uiLanguage, contentLanguage) => {
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

const getKiteiMakorUnits = unit => (
  Object.values(unit.derived_units || {})
    .filter(x => (
      x.content_type === CT_KITEI_MAKOR
      && (x.files || []).some(f => f.type === MT_TEXT))
    )
);

const checkIsMakor = (options, selected) => {
  const val = options.find(o => o.value === selected);
  return val && val.type === CT_KITEI_MAKOR;
};

const getSourceOptions = (props) => {
  const { unit, indexMap, getSourceById, t } = props;

  const sourceOptions = (unit.sources || []).map(getSourceById).filter(x => !!x).map(x => ({
    value: x.id,
    text: tracePath(x, getSourceById).map(y => y.name).join(' > '),
    disabled: indexMap[x.id] && !indexMap[x.id].data && !indexMap[x.id].wip,
  }));

  const derivedOptions = getKiteiMakorUnits(unit)
    .map(x => ({
      value: x.id,
      text: t(`constants.content-types.${x.content_type}`),
      type: x.content_type,
      disabled: false,
    })) || [];

  return [...sourceOptions, ...derivedOptions];
};

const getKiteiMakorFiles = (unit, ktCUID) => {
  const ktCUs = getKiteiMakorUnits(unit);

  let cu;
  if (ktCUID) {
    cu = ktCUs.find(x => x.id === ktCUID);
  } else {
    cu = ktCUs.length > 0 ? ktCUs[0] : null;
  }

  return cu ? cu.files.filter(f => f.type === MT_TEXT) : null;
};

const myReplaceState = (nextProps, uiLanguage) => {
  const options   = getSourceOptions(nextProps);
  const available = options.filter(x => !x.disabled);
  const selected  = (available.length > 0) ? available[0].value : null;
  const isMakor   = checkIsMakor(options, selected);
  const ktFiles   = getKiteiMakorFiles(nextProps.unit);

  const { unit, indexMap, contentLanguage, onContentChange } = nextProps;

  const { languages, language } = isMakor
    ? getMakorLanguages(ktFiles, uiLanguage, contentLanguage)
    : getSourceLanguages(indexMap[selected], uiLanguage, contentLanguage);

  changeContent({ selected, language, unit, indexMap, onContentChange, isMakor });
  return { options, languages, language, selected, isMakor };
};

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
    unitId: null,
  };

  componentDidMount() {
    const { language } = this.state;

    this.setState(myReplaceState(this.props, language));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selected, isMakor, language: uiLanguage } = this.state;

    // unit has changed - replace all state
    // or no previous selection - replace all state
    if (nextProps.unit.id !== this.props.unit.id || !selected) {
      this.setState(myReplaceState(nextProps, uiLanguage));
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
        const options                 = getSourceOptions(nextProps);
        const { languages, language } = getSourceLanguages(nIdx, nextProps.uiLanguage, nextProps.contentLanguage);
        this.setState({ options, languages, language });
        const { unit, indexMap, onContentChange } = nextProps;
        changeContent({ selected, language: language || this.state.language, unit, indexMap, onContentChange, isMakor });
      } else {
        // we keep previous selection. Source options must be updated anyway
        this.setState({ options: getSourceOptions(nextProps) });
      }
    }
  }

  handleLanguageChanged = (e, language) => {
    const { selected, isMakor }               = this.state;
    const { unit, indexMap, onContentChange } = this.props;

    changeContent({ selected, language, unit, indexMap, onContentChange, isMakor });
    this.setState({ language });
  };

  handleSourceChanged = (e, data) => {
    const selected = data.value;

    if (this.state.selected === selected) {
      e.preventDefault();
      return;
    }
    const { indexMap, contentLanguage, unit, onContentChange } = this.props;
    const { language: uiLanguage, options }                    = this.state;
    const isMakor                                              = checkIsMakor(options, selected);

    const { languages, language } = isMakor
      ? getMakorLanguages(getKiteiMakorFiles(unit), uiLanguage, contentLanguage)
      : getSourceLanguages(indexMap[selected], uiLanguage, contentLanguage);

    this.setState({ selected, languages, language, isMakor });

    changeContent({ selected, language, unit, indexMap, onContentChange, isMakor });
  };

  render() {
    const { unit, content, doc2htmlById, t, indexMap, }                    = this.props;
    const { options, selected, isMakor, languages, language: uiLanguage, } = this.state;

    if (options.length === 0) {
      return <Segment basic>{t('materials.sources.no-sources')}</Segment>;
    }

    if (!selected) {
      return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
    }

    const taas   = isTaas(selected);
    const starts = startsFrom(selected);
    let pdfFile;

    if (taas && indexMap[selected] && indexMap[selected].data) {
      pdfFile = indexMap[selected].data[uiLanguage].pdf;
    }

    let contentStatus = content;
    if (isMakor) {
      const actualFile = getKiteiMakorFiles(unit, selected).find(x => x.language === uiLanguage);
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
    } else if (taas && pdfFile) {
      contents = <PDF pdfFile={assetUrl(`sources/${selected}/${pdfFile}`)} pageNumber={1} startsFrom={starts} />;
    } else {
      const direction = getLanguageDirection(uiLanguage);
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
              languages.length > 0
                ? (
                  <Grid.Column width={languages.length} textAlign="right">
                    <ButtonsLanguageSelector
                      languages={languages}
                      defaultValue={uiLanguage}
                      onSelect={this.handleLanguageChanged}
                    />
                  </Grid.Column>
                )
                : null
            }
          </Grid.Row>
        </Grid>
        <Divider hidden />
        {contents}
      </div>
    );
  }
}

export default withNamespaces()(Sources);
