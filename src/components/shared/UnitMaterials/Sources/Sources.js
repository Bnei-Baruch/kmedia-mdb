import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Dropdown, Grid, Segment } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../../helpers/consts';
import { formatError, tracePath } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../shared/Splash';
import LanguageSelector from '../../LanguageSelector';

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
    language: PropTypes.string.isRequired,
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
    this.myReplaceState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // unit has changed - replace all state
    if (nextProps.unit.sources !== this.props.unit.sources) {
      this.myReplaceState(nextProps);
      return;
    }

    // index data changed
    if (nextProps.indexMap !== this.props.indexMap) {
      const selected = this.state.selected;

      // if no previous selection - replace all state
      if (!selected) {
        this.myReplaceState(nextProps);
      } else {
        const idx  = this.props.indexMap[selected];
        const nIdx = nextProps.indexMap[selected];

        // if prev idx for current selection is missing and now we have it - use it
        if (nIdx && nIdx.data && !(idx && idx.data)) {
          const options                 = this.getSourceOptions(nextProps);
          const { languages, language } = this.getLanguages(nIdx, nextProps.language);
          this.setState({ options, languages, language });
          if (language) {
            this.changeContent(selected, language, nextProps.indexMap);
          }
        } else {
          // we keep previous selection. Source options must be updated anyway
          this.setState({ options: this.getSourceOptions(nextProps) });
        }
      }
    }
  }

  getSourceOptions = (props) => {
    const { unit, indexMap, getSourceById } = props;
    return (unit.sources || []).map(getSourceById).filter(x => !!x).map(x => ({
      value: x.id,
      text: tracePath(x, getSourceById).map(y => y.name).join(' > '),
      disabled: !indexMap[x.id] || !indexMap[x.id].data,
    }));
  };

  getLanguages = (idx, preferred) => {
    if (!idx || !idx.data) {
      return { languages: [], language: null };
    }

    let language    = null;
    const languages = Array.from(Object.keys(idx.data));
    if (languages.length > 0) {
      language = languages.indexOf(preferred) === -1 ? languages[0] : preferred;
    }

    return { languages, language };
  };

  changeContent = (selected, language, idxMap) => {
    this.props.onContentChange(selected, idxMap[selected].data[language].html);
  };

  myReplaceState = (nextProps) => {
    const options                 = this.getSourceOptions(nextProps);
    const available               = options.filter(x => !x.disabled);
    const selected                = (available.length > 0) ? available[0].value : null;
    const { languages, language } = this.getLanguages(nextProps.indexMap[selected], nextProps.language);

    this.setState({ options, languages, language, selected });

    if (selected && language) {
      this.changeContent(selected, language, nextProps.indexMap);
    }
  };

  handleSourceChanged = (e, data) => {
    const selected = data.value;

    if (this.state.selected === selected) {
      e.preventDefault();
      return;
    }

    const { languages, language } = this.getLanguages(this.props.indexMap[selected], this.props.language);
    this.setState({ selected, languages, language });
    if (selected && language) {
      this.changeContent(selected, language, this.props.indexMap);
    }
  };

  handleLanguageChanged = (e, language) => {
    this.changeContent(this.state.selected, language, this.props.indexMap);
    this.setState({ language });
  };

  render() {
    const { content, t }                             = this.props;
    const { options, selected, languages, language } = this.state;

    if (options.length === 0) {
      return <Segment basic>{t('materials.sources.no-sources')}</Segment>;
    }

    if (!selected) {
      return <Segment basic>{t('materials.sources.no-source-available')}</Segment>;
    }

    const { wip: contentWip, err: contentErr, data: contentData } = content;

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
      contents        = <div style={{ direction }} dangerouslySetInnerHTML={{ __html: contentData }} />;
    }

    return (
      <div>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
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
                <Grid.Column width={4}>
                  <LanguageSelector
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
