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

      <div className="p-[14px]">
        <div className="flex gap-[28px]">
          {/* Semantic grid: 3/16 column minus gutters */}
          <div className="w-[calc(18.75%-24px)] shrink-0">
            <CollectionLogo collectionId={collection.id} />
          </div>
          <div className="flex-1 md:flex-none md:w-1/2 flex flex-col">
            <h1 className="collection-header__title -mt-1.5 font-lato! text-[42px] leading-[1.28571429em] font-normal">{collection.name}</h1>
            <p className="section-header__description font-lato text-[14px] min-[1200px]:text-[16px] leading-[1.4285em] text-black/60 mt-[3.2px] mb-[1em]">{collection.description}</p>
            <div className="flex gap-[3px] items-center mt-2 mb-[7px]">
              <a
                className="inline-flex items-center justify-center w-[26px] h-[24px] bg-[#f2711c] rounded-[4px] hover:bg-[#f26202]"
                href={getRSSLinkByTopic(collection.id, contentLanguages)}
              >
                <span className="material-symbols-outlined text-white text-[14px]!">rss_feed</span>
              </a>
              <ShareForm collection={collection} />
              <div className="display-iblock">
                <SubscribeBtn collection={collection} large />
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
