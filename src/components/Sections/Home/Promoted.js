import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';

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

const ExtLink = ({ to, children }) => (
  <a href={to} target="_blank" rel="noopener noreferrer">{children}</a>
);

const Promoted = (props) => {
  const { banner: { wip, err, data } } = props;

  if (err || wip) {
    return <div className="thumbnail" />;
  }

  const { content } = data;
  if (!content) {
    return <div className="thumbnail" data-testid="empty-content">&nbsp;</div>;
  }

  const { header, 'sub-header': subHeader, link } = Object.assign({}, ...data.meta);
  const imgData                                   = content.match(/img src="(.+?)"/);
  let img                                         = imgData ? imgData[1] : null;
  let Lnk                                         = link[0].match(/:\/\//) === null ? Link : ExtLink;

  return (
    <div className="thumbnail">
      <Lnk to={link[0]}>
        <Image fluid src={img} className="thumbnail__image" />
        {renderHeader(header[0], subHeader[0])}
      </Lnk>
    </div>
  );
};

Promoted.propTypes = {};

export default Promoted;
