import PropTypes from 'prop-types';

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
        <div className="flex py-2 gap-4">
          <div className="w-2/12">
            <CollectionLogo collectionId={collection.id} />
          </div>
          <div className="w-1/2 flex flex-col gap-2 justify-between">
            <h1 className="collection-header__title text-2xl font-bold">{collection.name}</h1>
            <p className="section-header__description text-gray-600">{collection.description}</p>
            <div className="flex gap-3 items-stretch">
              <a
                className="inline-flex items-center px-2 py-1 text-md font-bold bg-orange-500 rounded hover:bg-orange-600"
                href={getRSSLinkByTopic(collection.id, contentLanguages)}
              >
                <span className="material-symbols-outlined  text-white">rss_feed</span>
              </a>
              <ShareForm collection={collection} />
              <div className="display-iblock">
                <SubscribeBtn collection={collection} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CollectionPageHeader.propTypes = {
  collection: shapes.GenericCollection,
  namespace: PropTypes.string.isRequired,
};

export default CollectionPageHeader;
