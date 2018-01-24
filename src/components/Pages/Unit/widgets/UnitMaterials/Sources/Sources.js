import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';

import { CT_KITEI_MAKOR, RTL_LANGUAGES, MT_TEXT } from '../../../../../../helpers/consts';
import { formatError, tracePath } from '../../../../../../helpers/utils';
import * as shapes from '../../../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../../../shared/Splash/Splash';
import ButtonsLanguageSelector from '../../../../../Language/Selector/ButtonsLanguageSelector';

class Sources extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    indexMap: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.object, // content index
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }).isRequired,
    defaultLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
    getSourceById: PropTypes.func.isRequired,
  };

  state = {
    options: [],
    languages: [],
    selected: null,
    language: null,
  };

  componentDidMount() {
    let nState = this.stateByProps(this.props);
    if (this.props.unit.derived_units) {
      const derivedFiles = this.getDerived(this.props.unit.derived_units);
      if (derivedFiles && derivedFiles.length > 0) {
        const id = (derivedFiles.find(f => f.language === nState.language) || {}).id;
        if (id) {
          this.props.onContentChange(null, null, id);
        }
      }
    }
    this.setState(nState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexMap === this.props.indexMap) {
      return;
    }

    if (nextProps.unit.sources !== this.props.unit.sources) {
      const { options, language, selected } = this.stateByProps(nextProps);
      this.changeContent(options, selected, language);
      return;
    }

    const { languages, language, options, selected } = this.stateByProps(nextProps);

    if (!selected) {
      return;
    }

    if (this.isMakor(options, selected)) {
      const nDerive = nextProps.deriveContentById ? nextProps.deriveContentById[Object.keys(nextProps.deriveContentById)[0]] : null;
      const derive  = this.props.deriveContentById ? this.props.deriveContentById[Object.keys(this.props.deriveContentById)[0]] : null;
      if (nDerive && nDerive.data && !derive) {
        this.changeContent(options, selected, language, nextProps);
      }
    } else {
      const idx  = this.props.indexMap[selected];
      const nIdx = nextProps.indexMap[selected];
      if (nIdx && nIdx.data && !(idx && idx.data)) {
        this.changeContent(options, selected, language, nextProps);
      }
    }
    this.setState({ languages, language, options, selected });
  }

  getLanguages = (props, selected, isDerived) => {
    const { indexMap, unit } = props;
    const preferred          = this.state.language ? this.state.language : props.defaultLanguage;

    let language       = null;
    const derivedFiles = isDerived ? this.getDerived(unit.derived_units, selected) : null;

    if ((isDerived && !derivedFiles) || !isDerived && (!indexMap[selected] || !indexMap[selected].data)) {
      return { languages: [], language: null };
    }

    const languages = isDerived ? derivedFiles.map(f => f.language) : Array.from(Object.keys(indexMap[selected].data));
    if (languages.length > 0) {
      language = languages.indexOf(preferred) === -1 ? languages[0] : preferred;
    }

    return { languages, language };
  };

  changeContent = (options, selected, language, props) => {
    if (!options || !selected || !language) return;

    const { unit, indexMap, onContentChange } = props || this.props;

    const selectedOption = options.find(o => o.value === selected);
    if (this.isMakor(options, selected)) {
      const derived = this.getDerived(unit.derived_units, selected).find(x => x.language === language);
      onContentChange(null, null, derived.id);
    } else if (indexMap[selected].data) {
      onContentChange(selectedOption.value, indexMap[selected].data[language].html);
    }
  };

  stateByProps = (nextProps) => {
    const options                 = this.getSourceOptions(nextProps);
    const available               = options.filter(x => !x.disabled);
    const selected                = (available.length > 0) ? available[0].value : null;
    const { languages, language } = this.getLanguages(nextProps, selected, this.isMakor(options, selected));
    return { options, languages, language, selected };
  };

  getSourceOptions = (props) => {
    const { unit, indexMap, getSourceById } = props;

    const sourceOptions = (unit.sources || []).map(getSourceById).filter(x => !!x).map(x => ({
      value: x.id,
      text: tracePath(x, getSourceById).map(y => y.name).join(' > '),
      disabled: !indexMap[x.id] || !indexMap[x.id].data,
    }));

    const derivedOptions = Object.keys(unit.derived_units)
      .filter(k => unit.derived_units[k].files.some(f => f.type === MT_TEXT))
      .map(x => ({
        value: unit.derived_units[x].id,
        text: unit.derived_units[x].content_type,
        type: unit.derived_units[x].content_type,
        disabled: false,
      })) || [];
    return [...sourceOptions, ...derivedOptions];

  };

  handleSourceChanged = (e, data) => {
    const nSelected             = data.value;
    const { selected, options } = this.state;

    this.setState({ language: 'es', test: '111' }, () => console.log(this.state.language));

    if (selected === nSelected) {
      e.preventDefault();
      return;
    }

    const { languages, language } = this.getLanguages(this.props, nSelected, this.isMakor(options, nSelected));
    this.setState({ selected: nSelected, languages, language });
    if (nSelected && language) {
      this.changeContent(options, nSelected, language);
    }
  };

  handleLanguageChanged = (e, language) => {
    const { options, selected } = this.state;
    this.setState({ language }, () => this.changeContent(options, selected, language));
  };

  isMakor = (options, selected) => {
    const val = options.find(o => o.value === selected);
    return val && val.type === CT_KITEI_MAKOR;
  };

  getDerived = (derived_units, dId) => {
    const key = dId ? Object.keys(derived_units).find(k => derived_units[k].id === dId) : Object.keys(derived_units)[0];
    return !key ? null : derived_units[key].files.filter(f => f.type === MT_TEXT);
  };

  render() {
    const { content, deriveContentById, t }          = this.props;
    const { options, selected, languages, language } = this.state;

    if (options.length === 0) {
      return <Segment basic>{t('materials.sources.no-sources')}</Segment>;
    }

    if (!selected) {
      return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
    }

    const { wip: contentWip, err: contentErr, data: contentData } = (this.isMakor(options, selected)) ? deriveContentById[Object.keys(deriveContentById)[0]] || {} : content;

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
    } else {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

      // eslint-disable-next-line react/no-danger
      contents = <div className="doc2html" style={{ direction }} dangerouslySetInnerHTML={{ __html: contentData }} />;
    }

    return (
      <div>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={12}>
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
                <Grid.Column width={4} textAlign="right">
                  <ButtonsLanguageSelector
                    languages={languages}
                    defaultValue={language}
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
