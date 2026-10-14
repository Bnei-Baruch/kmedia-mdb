import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { iconByContentTypeMap } from '../../../helpers/consts';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';

// Semantic `.ui.items` row: section icon, title and date (Likutim, AudioBlog lists)
const SimpleListTemplate = ({ cuID, icon }) => {
  const { t } = useTranslation();
  const cu = useSelector(state => mdbGetDenormContentUnitSelector(state, cuID));

  if (!cu) return null;

  const { content_type, film_date, name } = cu;

  return (
    <div className="text_item">
      <div className="image">
        <SectionLogo name={icon || iconByContentTypeMap.get(content_type)} height="60" width="60"/>
      </div>
      <div className="text_item__content">
        <Link to={canonicalLink(cu)} className="text_item__header">{name}</Link>
        <div className="description is_single">
          <span>{t('values.date', { date: film_date })}</span>
        </div>
      </div>
    </div>
  );
};

SimpleListTemplate.propTypes = {
  cuID: PropTypes.string,
  icon: PropTypes.string
};

export default SimpleListTemplate;
