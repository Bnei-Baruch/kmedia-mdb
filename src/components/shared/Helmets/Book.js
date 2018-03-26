import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

class Book extends Component {
  static propTypes = {
    releaseDate: PropTypes.string,
    isbn: PropTypes.string,
    authorUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    releaseDate: null,
    isbn: null,
    authorUrl: null,
    tags: []
  };

  render() {
    const { releaseDate, isbn, authorUrl, tags } = this.props;

    return (
      <Helmet>
        <meta property="og:type" content="book" />

        {releaseDate ? <meta name="book:release_date" content={releaseDate} /> : null}
        {isbn ? <meta name="book:isbn" content={isbn} /> : null}
        {authorUrl ? <meta name="book:author" content={authorUrl} /> : null}
        {tags.map((tag, index) => <meta name="book:tag" content={tag} key={index} />)}
      </Helmet>
    );
  }
}

export default Book;
