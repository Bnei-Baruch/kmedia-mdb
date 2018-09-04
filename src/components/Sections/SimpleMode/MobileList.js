import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container } from 'semantic-ui-react';

import * as shapes from '../../shapes';

class SimpleModeMobileList extends PureComponent {
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
    const isMobile                           = true;

    const content = (
      <div>
        <Container className="padded">
          {
            items.lessons ? items.lessons.map(x => renderUnit(x, language, t, isMobile)) : null
          }

          {
            items.others ? renderUnit(items.others, language, t, isMobile) : null
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

export default translate()(SimpleModeMobileList);
