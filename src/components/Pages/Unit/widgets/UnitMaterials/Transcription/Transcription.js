import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import { Container, Divider, Segment } from 'semantic-ui-react';

import { MEDIA_TYPES, RTL_LANGUAGES } from '../../../../../../helpers/consts';
import * as shapes from '../../../../../shapes';
import ButtonsLanguageSelector from '../../../../../Language/Selector/ButtonsLanguageSelector';
import WipErr from '../../../../../shared/WipErr/WipErr';

class Transcription extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    doc2htmlById: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.string,     // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    language: PropTypes.string.isRequired, // UI language
    t: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: null,
  };

  state = {
    selected: null,
    languages: [],
    language: null,
  };

  componentWillMount() {
    this.setCurrentItem(this.props);
  }

  componentDidMount() {
    const { selected, language } = this.state;
    if (selected && language) {
      const { doc2htmlById, onContentChange } = this.props;
      const { data }                          = doc2htmlById[selected.id] || {};
      if (!data) {
        onContentChange(selected.id);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.unit && !this.props.unit) ||
      (nextProps.unit.id !== this.props.unit.id) ||
      (nextProps.unit.files !== this.props.unit.files)
    ) {
      const { selected, language } = this.setCurrentItem(nextProps);
      if (selected && language) {
        this.props.onContentChange(selected.id);
      }
    }
  }

  getTextFiles = (props) => {
    const { unit } = props;
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    return unit.files.filter(x => x.type === 'text' && x.mimetype !== MEDIA_TYPES.html.mime_type);
  };

  setCurrentItem = (props) => {
    const textFiles = this.getTextFiles(props);
    const languages = uniq(textFiles.map(x => x.language));
    let selected    = null;
    if (languages.length > 0) {
      // try to stay on the same language we have in state if possible
      if (this.state.language) {
        selected = textFiles.find(x => x.language === this.state.language);
      }

      // if not then choose by UI language or first
      if (!selected) {
        selected = textFiles.find(x => x.language === props.language) || textFiles[0];
      }
    }

    const language = selected ? selected.language : null;

    const sUpdate = { selected, languages, language };
    this.setState(sUpdate);

    return sUpdate;
  };

  handleLanguageChanged = (e, language) => {
    if (language === this.state.language) {
      e.preventDefault();
      return;
    }

    const textFiles = this.getTextFiles(this.props);
    const selected  = textFiles.find(x => x.language === language);

    this.props.onContentChange(selected.id);
    this.setState({ selected, language });
  };

  render() {
    const { doc2htmlById, t }               = this.props;
    const { selected, languages, language } = this.state;

    if (!selected) {
      return <Segment basic>{t('materials.transcription.no-transcription')}</Segment>;
    }

    const { data, wip, err } = doc2htmlById[selected.id] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (data) {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

      // eslint-disable-next-line react/no-danger
      const content = (
        <div
          className="doc2html"
          style={{ direction }}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      );

      if (languages.length === 1) {
        return content;
      }

      return (
        <div>
          <Container fluid textAlign="center">
            <ButtonsLanguageSelector
              languages={languages}
              defaultValue={language}
              t={t}
              onSelect={this.handleLanguageChanged}
            />
          </Container>
          <Divider hidden />
          {content}
        </div>
      );
    }

    return null;
  }
}

export default Transcription;
