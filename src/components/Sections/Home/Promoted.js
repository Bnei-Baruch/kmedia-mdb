import React from 'react';

import Link from '../../Language/MultiLanguageLink';
import { cmsUrl, Requests } from '../../../helpers/Api';
import { publicFile } from '../../../helpers/utils';

const renderHeader = (header, subHeader) => {
  if (!header) {
    return null;
  }

  return (
    <h2 className="thumbnail__header">
      <div className="content">
        <div className="sub">
          {subHeader}
        </div>
        {header}
      </div>
    </h2>
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
      <Lnk to={link}>
        <img src={src} className="thumbnail__image w-full h-auto" alt="" />
        {renderHeader(header, subHeader)}
      </Lnk>
    </div>
  );
};

Promoted.propTypes = {};

export default Promoted;
