import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Image, List } from 'semantic-ui-react';

import DailyLessonsIcon from '../../../images/icons/dailylessons.svg';
import * as shapes from '../../shapes';

class SimpleModeList extends PureComponent {
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

    return (
      <div>
        {
          items.lessons.length
            ? (
              <div>
                <h2>
                  <Image className="simple-mode-type-icon" src={DailyLessonsIcon} />
                  {t('simple-mode.today-lessons')}
                </h2>
                <List size="large">
                  {items.lessons.map(x => renderUnit(x, language, t))}
                </List>
              </div>)
            : null
        }

        {
          items.others.length
            ? (
              <List size="large">
                {renderUnit(items.others, language, t)}
              </List>)
            : null
        }
      </div>
    );
  }
}

export default withNamespaces()(SimpleModeList);
