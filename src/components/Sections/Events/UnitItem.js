import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';
import { canonicalLink } from '../../../helpers/links';
import { isEmpty } from '../../../helpers/utils';
import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';

const UnitItem = ({ id, t }) => {
  const cu = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  if (!cu) return null;

  const link        = canonicalLink(cu);
  const collections = Object.values(cu.collections);
  return (
    <List.Item as={Link} to={link} key={id} className="media_item">
      <div className="media_item__content">
        <Header content={cu.name} />
        {
          !isEmpty(collections) && (
            <div className="separate_with_line">
              {
                collections.map(c => (
                  <Link to={canonicalLink(c)}>
                    {`${t(`constants.content-types.${c.content_type}`)}: ${c.name}`}
                  </Link>
                ))
              }
            </div>
          )
        }
        <div className="description">
          {t('values.date', { date: cu.film_date })}
        </div>
      </div>
    </List.Item>
  );
};

export default withNamespaces()(UnitItem);