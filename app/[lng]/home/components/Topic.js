import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '/lib/SUI';
import { SectionLogo } from '../../../../src/helpers/images';
import Link from 'next/link';

const Topic = ({ title, src, href = '', width, height, fontSize }) => (
  <Header size={fontSize} as={Link} href={href}>
    <SectionLogo name={src} width={width} height={height} />
    <br />
    {title}
  </Header>
);

Topic.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  href: PropTypes.string
};

export default Topic;
