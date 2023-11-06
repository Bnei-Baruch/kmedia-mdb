import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import { cmsUrl, Requests } from '../../../../src/helpers/Api';
import { publicFile } from '../../../../src/helpers/utils';
import Link from 'next/link';

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

const extLink = ({ to, children }) => <a href={to} target="_blank" rel="noopener noreferrer">{children}</a>;

const Promoted = ({ banner }) => {
  if (banner === null) {
    return <div className="thumbnail" />;
  }

  const { meta } = banner;
  if (!meta) {
    return <div className="thumbnail">&nbsp;</div>;
  }

  const { header, 'sub-header': subHeader, link, image } = banner.meta;

  const Lnk     = link.match(/:\/\//) === null ? Link : extLink;
  let imageFile = cmsUrl(image);
  if (!/^http/.exec(imageFile)) {
    imageFile = publicFile(imageFile);
  }

  const src = Requests.imaginary('resize', {
    url: imageFile,
    width: 512,
    height: 288,
    nocrop: false,
    stripmeta: true,
  });

  return (
    <div className="thumbnail">
      <Lnk href={link}>
        <Image fluid src={src} className="thumbnail__image" />
        {renderHeader(header, subHeader)}
      </Lnk>
    </div>
  );
};

export default Promoted;
