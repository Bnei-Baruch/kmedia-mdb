import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Header, Image } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';
import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';

class Promoted extends Component {
  static propTypes = {
    banner: shapes.Banner,
    t: PropTypes.func.isRequired,
  };

  static renderHeader(header, subHeader) {
    if (!header) {
      return null;
    }
    return (
      <Header as="h2" className="thumbnail__header">
        <Header.Content>
          <Header.Subheader>
            {subHeader}
          </Header.Subheader>
          {header}
        </Header.Content>
      </Header>
    );
  }

  render() {
    const { banner: { wip, err, data: { content, header, 'sub-header': subHeader, link } }, t } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash text={t('messages.source-content-not-found')} />;
      }
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }
    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }
    if (!content) {
      return null;
    }

    const img = content.match(/img src="(.+)"/);
    return (
      <div className="thumbnail">
        <Link to={link}>
          <Image fluid src={img} className="thumbnail__image" />
          {Promoted.renderHeader(header, subHeader)}
        </Link>
      </div>
    );
  }
}

export default withNamespaces()(Promoted);
