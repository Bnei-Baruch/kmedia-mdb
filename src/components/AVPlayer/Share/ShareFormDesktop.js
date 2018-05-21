import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';

import BaseShareForm from './BaseShareForm';
import ShareBar from './ShareBar';

class ShareFormDesktop extends BaseShareForm {
  static propTypes = {
    onExit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.setStart = this.setStart.bind(this);
    this.setEnd   = this.setEnd.bind(this);
  }

  render() {
    const { t, onExit }       = this.props;
    const { start, end, url } = this.state;

    return (
      <div className="mediaplayer__onscreen-share">
        <Button
          className="mediaplayer__onscreen-share-back"
          content={t('player.buttons.edit-back')}
          primary
          icon="chevron left"
          onClick={onExit}
        />
        <ShareBar url={url} t={t} buttonSize="medium" />
        <div className="mediaplayer__onscreen-share-form">
          <Message content={url} size="mini" />
          <Form size="mini">
            <Form.Group widths="equal">
              <Form.Input
                value={start ? this.mlsToStrColon(start) : ''}
                onClick={this.setStart}
                action={{
                  content: t('player.buttons.start-position'),
                  onClick: this.setStart,
                  icon: 'hourglass start',
                  color: 'blue',
                  size: 'mini',
                  compact: true,
                }}
                input={{ readOnly: true }}
                actionPosition="left"
                placeholder={t('player.buttons.click-to-set')}
              />
              <Form.Input
                value={end ? this.mlsToStrColon(end) : ''}
                onClick={this.setEnd}
                action={{
                  content: t('player.buttons.end-position'),
                  onClick: this.setEnd,
                  icon: 'hourglass end',
                  color: 'blue',
                  size: 'mini',
                  compact: true,
                }}
                input={{ readOnly: true }}
                actionPosition="left"
                placeholder={t('player.buttons.click-to-set')}
              />
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default ShareFormDesktop;
