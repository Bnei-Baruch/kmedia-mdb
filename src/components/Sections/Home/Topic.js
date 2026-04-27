import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { SectionLogo } from '../../../helpers/images';
import Link from '../../Language/MultiLanguageLink';

const Topic = ({ title, src, href, width, height, fontSize }) => (
  <Link to={href} className={clsx('block text-center', fontSize === 'small' ? 'small' : 'large')}>
    <SectionLogo name={src} width={width} height={height} />
    <br />
    <div className="header">
      {title}
    </div>
  </Link>
);

Topic.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  href: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize: PropTypes.string,
};

Topic.defaultProps = {
  href: '',
};

export default Topic;
