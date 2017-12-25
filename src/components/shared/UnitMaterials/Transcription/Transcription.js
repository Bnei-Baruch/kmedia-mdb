import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../shared/Splash';

class Transcription extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { content, t } = this.props;

    if (content === null || content.length === 0) {
      return <Segment basic>{t('materials.sources.no-sources')}</Segment>;
    }

    const { wip, err, data, language } = content;

    let contents;
    if (err) {
      if (err.response && err.response.status === 404) {
        contents = (
          <FrownSplash
            text={t('messages.source-content-not-found')}
          />
        );
      } else {
        contents = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
      }
    } else if (wip) {
      contents = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
      // eslint-disable-next-line react/no-danger
      contents        = <div className="transcription" style={{ direction }} dangerouslySetInnerHTML={{ __html: data }} />;
    }

    return (
      <div>
        {contents}
      </div>
    );
  }
}

export default Transcription;
