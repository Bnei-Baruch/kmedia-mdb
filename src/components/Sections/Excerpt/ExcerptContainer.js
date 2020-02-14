import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import Countdown, { zeroPad } from 'react-countdown';
import { Container, Header } from 'semantic-ui-react';

import { selectors as settings } from '../../../redux/modules/settings';
import excerpts from './excerpts';
import { DEFAULT_LANGUAGE } from '../../../helpers/consts';

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist/>;
  } else {
    // Render a countdown
    return <span style={{ direction: 'ltr', 'font-size': '3em' }}>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
      ;
  }
};

class ExcerptContainer extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    excerpt: '',
  };


  chooseExcerpt() {
    const { language } = this.props;
    let items = excerpts[language];
    if (!items) {
      items = excerpts[DEFAULT_LANGUAGE];
    }
    let excerpt = items[Math.floor(Math.random() * items.length)];
    this.setState({ excerpt });
  }

  componentDidMount() {
    this.chooseExcerpt();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.chooseExcerpt();
    }
  }

  render() {
    const { excerpt } = this.state;

    return (
      <div style={{'padding': '20px', 'text-align': 'justify'}}>
        <br/>
        <Header as="h1" textAlign="center" color="green" size="huge">
          <Countdown date={Date.now() + 5 * 60 * 1000} renderer={renderer}/>
        </Header>
        <Container text>
          {excerpt}
        </Container>
        <br/>
        <br/>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    language: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
  })
)(withNamespaces()(ExcerptContainer));
