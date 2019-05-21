import React from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';

const Topic = (props) => {
  const { title, img, href } = props;

  return (
    <Header size="tiny" as={Link} to={href}>
      <Image src={img} />
      <br />
      {title}
    </Header>
  );
};

Topic.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  href: PropTypes.string
};

Topic.defaultProps = {
  href: '',
};

export default Topic;
