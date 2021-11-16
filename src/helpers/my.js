import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from './consts';

export const getMyItemKey = (namespace, item) => {
  let key = null;
  if (!item) return { key, item };

  switch (namespace) {
    case MY_NAMESPACE_HISTORY:
      key = item.id;
      break;
    case MY_NAMESPACE_REACTIONS:
      const { kind, subject_type, subject_uid } = item;

      key = !!(kind || subject_type || subject_uid) ? `${kind}_${subject_type}_${subject_uid}` : null;
      break;
    case MY_NAMESPACE_PLAYLISTS:
      key = item.id;
      break;
    case MY_NAMESPACE_SUBSCRIPTIONS:
      const { collection_uid, content_type } = item;

      key = !!(collection_uid || content_type) ? `${collection_uid}_${content_type}` : null;
      break;
    default:
      key = item.id;
  }

  return { key, item };
};
