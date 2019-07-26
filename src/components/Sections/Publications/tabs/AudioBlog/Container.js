import React, { PureComponent } from 'react';
import { Table } from 'semantic-ui-react';

import { CT_BLOG_POST, NO_NAME } from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { ellipsize } from '../../../../../helpers/strings';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';


const renderUnit = (unit, t) => {
  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: unit.film_date });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top" className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        <span className="index__date">{filmDate}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(unit)}>
          {unit.name || NO_NAME}
        </Link>
        {
          unit.description
            ? (
              <div className="index__description mobile-hidden">
                {ellipsize(unit.description)}
              </div>
            )
            : null
        }
      </Table.Cell>
    </Table.Row>
  );
};


class AudioBlogList extends PureComponent {
  
  extraFetchParams = () => ({ content_type: [CT_BLOG_POST] });

  render() {
    return (
      <div>
        <UnitList
          namespace="publications-audio-blog"
          extraFetchParams={this.extraFetchParams}
          renderUnit={renderUnit}
        />
      </div>
    );
  }
}

export default AudioBlogList;