import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Card, Container, List } from 'semantic-ui-react';

import * as shapes from '../../shapes';

class SimpleModeDesktopList extends PureComponent {
  static propTypes = {
    items: shapes.SimpleMode,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: {},
  };

  render() {
    const { items, language, t, renderUnit } = this.props;
    const isMobile                           = false;

    return (
      <Container className="padded">
        {
          items.lessons ?
            <List size="large">
              {items.lessons.map(x => renderUnit(x, language, t, isMobile))}
            </List> :
            null
        }

        {
          items.others.length ?
            <Card fluid>
              <Card.Content>
                <List size="large">
                  {renderUnit(items.others, language, t, isMobile)}
                </List>
              </Card.Content>
            </Card> :
            null
        }
      </Container>
    );
  }
}

export default translate()(SimpleModeDesktopList);
