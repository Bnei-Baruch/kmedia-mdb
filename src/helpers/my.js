import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from './consts';

export const getMyItemKey = (namespace, item) => {
  let key;
  switch (namespace) {
    case MY_NAMESPACE_HISTORY:
      key = item.content_unit_uid;
      break;
    case MY_NAMESPACE_REACTIONS:
      key = `${item.kind}_${item.subject_type}_${item.subject_uid}`;
      break;
    case MY_NAMESPACE_PLAYLISTS:
      key = item.id;
      break;
    case MY_NAMESPACE_SUBSCRIPTIONS:
      key = `${item.collection_uid}_${item.content_type}_${item.content_unit_uid}`;
      break;
    default:
      key = item.id;
  }
  return { key, item };
};
