import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import { cmsUrl, imaginaryUrl, Requests } from '../../../helpers/Api';

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

  const { meta } = data;
  if (!meta) {
    return <div className="thumbnail">&nbsp;</div>;
  }

  const { header, 'sub-header': subHeader, link, image } = data.meta;

  const Lnk = link.match(/:\/\//) === null ? Link : ExtLink;

  const params = Requests.makeParams({
    url: cmsUrl(image),
    width: 512,
    height: 288,
    nocrop: false,
    stripmeta: true,
  });
  const src    = `${imaginaryUrl('resize')}?${params}`;

  return (
    <div className="thumbnail">
      <Lnk to={link}>
        <Image fluid src={src} className="thumbnail__image" />
        {renderHeader(header, subHeader)}
      </Lnk>
    </div>
  );
};

Promoted.propTypes = {};

export default Promoted;
