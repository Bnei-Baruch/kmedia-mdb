import React from 'react';
import { Form, Message } from 'semantic-ui-react';

import BaseShareForm from './BaseShareForm';
import ShareBar from './ShareBar';

class ShareFormMobile extends BaseShareForm {
  constructor(props) {
    super(props);
    this.setStart = this.setStart.bind(this);
    this.setEnd   = this.setEnd.bind(this);
  }

  render() {
    const { t }               = this.props;
    const { start, end, url } = this.state;

    return (
      <div className="mediaplayer__onscreen-share">
        <ShareBar url={url} t={t} buttonSize="medium" />
        <div className="mediaplayer__onscreen-share-form">
          <Message content={url} size="mini" style={{ userSelect: 'text', textAlign: 'left' }} />
          <Form size="mini">
            <Form.Group widths="equal">
              <Form.Input
                value={start ? this.mlsToStrColon(start) : ''}
                onClick={this.setStart}
                action={{
                  content: t('player.buttons.start-position'),
                  onClick: this.setStart,
                  icon: 'hourglass start',
                  compact: true,
                  color: 'blue',
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
                  compact: true,
                  color: 'blue',
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

export default ShareFormMobile;
