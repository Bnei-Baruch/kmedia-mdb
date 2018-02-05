import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';

class Topic extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    href: PropTypes.string
  };

  render() {
    const { title, img, href } = this.props;

    return (
      <Header size="small" as={Link} to={href}>
        <Image src={img} />
        <br />{title}
      </Header>
    );
  }
}

export default Topic;
