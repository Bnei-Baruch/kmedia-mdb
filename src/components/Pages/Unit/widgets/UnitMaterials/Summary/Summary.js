import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Segment, Divider } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import MediaHelper from '../../../../../../helpers/media';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { selectors as assetsSelectors, actions as assetsActions } from '../../../../../../redux/modules/assets';
import { INSERT_TYPE_SUMMARY } from '../../../../../../helpers/consts';

const Summary = ({ unit, t }) => {

  const language     = useSelector(state => settings.getLanguage(state.settings));
  const doc2htmlById = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));
  const dispatch     = useDispatch();

  const description = unit.description
    ? (<div dangerouslySetInnerHTML={{ __html: unit.description }} />)
    : t('materials.summary.no-summary');

  const getFile = () => {
    if (!unit || !Array.isArray(unit.files)) {
      return null;
    }

    return unit.files?.filter(f => f.language === language)
      .filter(f => MediaHelper.IsText(f) && !MediaHelper.IsPDF(f))
      .find(f => f.insert_type === INSERT_TYPE_SUMMARY);
  };

  const file = getFile();

  useEffect(() => {
    if (file) {
      dispatch(assetsActions.doc2html(file.id));
    }
  }, [dispatch, file]);

  const { data } = doc2htmlById[file?.id] || false;
  return (
    <Segment basic>
      {description}
      {
        data ? (
          <>
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: data }}></div>
          </>
        ) : null

      }
    </Segment>
  );
};

Summary.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Summary);
