import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Image, List } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import * as shapes from '../../shapes';

const SimpleModeList = ({ items = {}, language, t, renderUnit }) => (
  <div>
    {
      items.lessons.length
        ? (
          <div>
            <h2>
              <Image className="simple-mode-type-icon">
                <SectionLogo name='lessons' />
              </Image>
              {t('simple-mode.today-lessons')}
            </h2>
            <List size="large">
              {items.lessons.map(x => renderUnit(x, language, t))}
            </List>
          </div>
        )
        : null
    }

    {
      items.others.length
        ? (
          <List size="large">
            {renderUnit(items.others, language, t)}
          </List>
        )
        : null
    }
  </div>
);

SimpleModeList.propTypes = {
  items: shapes.SimpleMode,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  renderUnit: PropTypes.func.isRequired,
};

export default withNamespaces()(SimpleModeList);
