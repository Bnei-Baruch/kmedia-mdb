import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { isEmpty } from '../../helpers/utils';
import { actions as sourceActions, selectors as sourceSelectors } from '../../redux/modules/sources';
import * as shapes from '../shapes';
import Library from './Library';

class LibraryContentContainer extends Component {
  static propTypes = {
    source: PropTypes.string,
    index: PropTypes.shape({
      data: PropTypes.object, // content index
      wip: shapes.WIP,
      err: shapes.Error,
    }),
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }).isRequired,
    languageUI: PropTypes.string,
    t: PropTypes.func.isRequired,
    fetchContent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    source: null,
    index: {},
    languageUI: null,
  };

  state = {
    source: null,
    languages: [],
    language: null,
  };

  componentDidMount() {
    this.myReplaceState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!Object.is(nextProps.index, this.props.index)) {
      this.myReplaceState(nextProps);
    }
  }

  getLanguages = (data, preferred) => {
    if (!data) {
      return { languages: [], language: null };
    }

    let language    = null;
    const languages = Array.from(Object.keys(data));
    if (languages.length > 0) {
      language = languages.indexOf(preferred) === -1 ? languages[0] : preferred;
    }

    return { languages, language };
  };

  myReplaceState = (nextProps) => {
    const data                    = nextProps.index && nextProps.index.data;
    const { languages, language } = this.getLanguages(data, nextProps.languageUI);

    this.setState({ languages, language });

    if (language) {
      const { source } = nextProps;

      if (!isEmpty(source)) {
        const name = data[language].html;
        this.props.fetchContent(source, name);
      }
    }
  };

  handleLanguageChanged = (e, language) => {
    const { index: { data }, source, fetchContent } = this.props;
    this.setState({ language });
    const name = data[language].html;
    fetchContent(source, name);
  };

  render() {
    const { content, index, t }   = this.props;
    const { languages, language } = this.state;

    return (
      <Library
        content={index && index.data ? content : {}}
        language={language}
        languages={languages}
        t={t}
        handleLanguageChanged={this.handleLanguageChanged}
      />
    );
  }
}

export default connect(
  state => ({
    content: sourceSelectors.getContent(state.sources),
  }),
  dispatch => bindActionCreators({
    fetchContent: sourceActions.fetchContent,
  }, dispatch)
)(translate()(LibraryContentContainer));
