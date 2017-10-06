import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';

export default class AVShare extends Component {
  render() {
    return (
      <Button
        type="button"
        primary
        size="big"
        circular
        icon={'share alternate'}
      />
    );
  }
}
