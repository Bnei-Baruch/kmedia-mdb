import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Table, List } from 'semantic-ui-react';

import * as shapes from '../../shapes';

class SimpleModeList extends PureComponent {
  static propTypes = {
    items: PropTypes.objectOf(shapes.SimpleMode),
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  render() {
    const { items, language, t, renderUnit } = this.props;

    const content = (
      <div>
        <Container className="padded">
          {
            items.lessons ?
              <Table unstackable basic="very" className="index" sortable>
                <Table.Body>
                  {items.lessons.map(x => renderUnit(x, language, t))}
                </Table.Body>
              </Table> :
              null
          }

          {
            items.others ?
              <List size="large">
                {renderUnit(items.others, language, t)}
              </List> :
              null
          }
        </Container>
      </div>
    );

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default translate()(SimpleModeList);
