import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { assetUrl } from '../../../helpers/Api';
import * as shapes from '../../shapes';
import CollectionLogo from '../../shared/Logo/CollectionLogo';
import Helmets from '../../shared/Helmets';
import { getRSSLinkByTopic } from '../../../helpers/utils';
import { useSelector } from 'react-redux';
import ShareForm from './ShareForm';
import SubscribeBtn from '../../shared/SubscribeBtn';
import { settingsGetContentLanguagesSelector } from '../../../redux/selectors';

const CollectionPageHeader = ({ collection = null }) => {
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);

  if (collection === null) {
    return <div className="collection-header" />;
  }

  return (
    <div className="collection-header">
      <Helmets.Basic title={collection.name} description={collection.description} />
      <Helmets.Image unitOrUrl={assetUrl(`logos/collections/${collection.id}.jpg`)} />

      <div className=" px-4 ">
        <div className="flex">
          <div className="w-2/12">
            <CollectionLogo collectionId={collection.id} />
          </div>
          <div className="w-1/2">
            <h1 className="text-2xl font-bold">
              <div>
                <span className="collection-header__title">
                  {collection.name}
                </span>
                <div className="section-header__subtitle">
                  <p className="section-header__description">{collection.description}</p>
                  <a
                    className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded hover:bg-orange-600"
                    href={getRSSLinkByTopic(collection.id, contentLanguages)}
                  >
                    <span className="material-symbols-outlined small">rss_feed</span>
                  </a>
                  <ShareForm collection={collection} />
                  <div className="margin-top-8 display-iblock">
                    <SubscribeBtn collection={collection} />
                  </div>
                </div>
              </div>
            </h1>

          </div>
        </div>
      </div>
    </div>
  );
};

CollectionPageHeader.propTypes = {
  collection: shapes.GenericCollection,
  namespace: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(CollectionPageHeader);
