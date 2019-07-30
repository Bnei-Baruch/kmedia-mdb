import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';
import { SectionLogo } from '../../../helpers/images';

const Topic = ({ title, src, href }) => (
  <Header size="tiny" as={Link} to={href}>
    <SectionLogo name={src} />
    <br />
    {title}
  </Header>
);

Topic.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  href: PropTypes.string
};

Topic.defaultProps = {
  href: '',
};

export default Topic;
