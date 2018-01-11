import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Segment } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../helpers/consts';
import { formatError, isEmpty, shallowCompare } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import ButtonsLanguageSelector from '../../Language/Selector/ButtonsLanguageSelector';

class Library extends Component {
  static propTypes = {
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }),
    language: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    t: PropTypes.func.isRequired,
    handleLanguageChanged: PropTypes.func.isRequired,
  };

  static defaultProps = {
    language: null,
    languages: [],
    content: {
      data: null,
      wip: false,
      err: null,
    },
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { content, language, languages, t, } = this.props;

    if (isEmpty(content)) {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
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
    } else if (!contentData) {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
    } else {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

      // eslint-disable-next-line react/no-danger
      contents = <div
        style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        dangerouslySetInnerHTML={{ __html: contentData }}
      />;
    }

    let languageBar = null;
    if (languages.length > 0) {
      languageBar = (
        <Container fluid textAlign="center">
          <ButtonsLanguageSelector
            languages={languages}
            defaultValue={language}
            t={t}
            onSelect={this.props.handleLanguageChanged}
          />
        </Container>
      );
    }

    return (
      <div>
        <Divider hidden />
        {languageBar}
        <Divider hidden />
        {contents}
      </div>
    );
  }
}

export default Library;
