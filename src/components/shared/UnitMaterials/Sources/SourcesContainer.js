import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/sources';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import * as shapes from '../../../shapes';
import { isEmpty } from '../../../../helpers/utils';
import Api from '../../../../helpers/Api';
import Sources from './Sources';

class SourcesContainer extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
    err: shapes.Error,
    fetchContent: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    sources: PropTypes.object,
  };

  static defaultProps = {
    unit: null,
    sources: {},
    wip: false,
    err: null,
  };

  state = {
    wip: {},
    html: {}
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { unit, err, sources, fetchContent } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    if (
      unit &&
      Array.isArray(unit.sources) &&
      !err
    ) {
      const wip  = { ...this.state.wip };
      const html = { ...this.state.html };

      unit.sources.forEach((id) => {
        const content = sources[id];
        if (isEmpty(content)) {
          // Fetch index
          fetchContent(id);
        } else {
          // We have index, so we can fetch html, but first let's decide which language to show
          const source    = sources[id];
          const languages = Object.keys(source);
          let language    = languages[0];
          if (languages.includes(this.props.language)) {
            language = this.props.language;
          } else if (languages.includes('he')) {
            language = 'he';
          } else if (languages.includes('en')) {
            language = 'en';
          } else if (languages.includes('ru')) {
            language = 'ru';
          } else if (languages.includes('es')) {
            language = 'es';
          }
          const name = source[language].html;

          if (!isEmpty(name) && !wip[name] && isEmpty(html[name])) {
            wip[name] = true;
            Api.sourceContent({ id, name }).then((data) => {
              html[name] = data;
              this.setState({ html });
            });
          }
        }
      });
      this.setState({ wip });
    }
  };

  render() {
    const { t, language, err } = this.props;

    return (<Sources
      sources={err ? null : this.state.html}
      language={language}
      err={err}
      t={t}
    />);
  }
}

export default connect(
  (state, ownProps) => {
    const id = ownProps.unit.id;
    return {
      unit: mdb.getDenormContentUnit(state.mdb, id),
      sources: selectors.getContentByID(state.sources, id),
      err: selectors.getError(state.sources),
      language: settings.getLanguage(state.settings),
    };
  },
  dispatch => bindActionCreators({
    fetchContent: actions.fetchContent,
  }, dispatch)
)(SourcesContainer);
