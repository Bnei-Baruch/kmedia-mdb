import React from 'react';
import { withNamespaces } from 'react-i18next';
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
    return <div className="thumbnail">&nbsp;</div>;
  }

  const { header, 'sub-header': subHeader, link } = data.meta;
  const imgData                                   = content.match(/img src="(.+?)"/);
  let img                                         = imgData ? imgData[1] : null;
  let Lnk                                         = link.match(/:\/\//) === null ? Link : ExtLink;

  return (
    <div className="thumbnail">
      <Lnk to={link}>
        <Image fluid src={img} className="thumbnail__image" />
        {renderHeader(header, subHeader)}
      </Lnk>
    </div>
  );
}

Promoted.propTypes = {};

export default withNamespaces()(Promoted);
