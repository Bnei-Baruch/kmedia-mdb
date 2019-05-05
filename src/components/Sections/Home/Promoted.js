import React from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';
import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';

const renderHeader = (header, subHeader) => {
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
};

function Promoted(props) {
  const { banner: { wip, err, data }, t } = props;

  if (err) {
    if (err.response && err.response.status === 404) {
      return <FrownSplash text={t('messages.source-content-not-found')} />;
    }
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }
  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }
  const { content } = data;
  if (!content) {
    return <div className="thumbnail">>&nbsp;</div>;
  }

  const { header, 'sub-header': subHeader, link } = data.meta;
  const imgData                                   = content.match(/img src="(.+?)"/);
  let img                                         = imgData ? imgData[1] : null;

  return (
    <div className="thumbnail">
      <Link to={link}>
        <Image fluid src={img} className="thumbnail__image" />
        {renderHeader(header, subHeader)}
      </Link>
    </div>
  );
}

Promoted.propTypes = {
  banner: shapes.Banner.isRequired,
  t: PropTypes.func.isRequired,
};

export default Promoted;
