import { CT_SOURCE } from '../../../helpers/consts';
import { isTaas } from '../../shared/PDF/PDF';
import { physicalFile } from '../../../helpers/utils';

export const getFullPath = (sourceId, getPathByID) => {
  // Go to the root of this sourceId
  if (!getPathByID) {
    return [{ id: '0' }, { id: sourceId }];
  }

  const path = getPathByID(sourceId);

  if (!path || path.length < 2 || !path[1]) {
    return [{ id: '0' }, { id: sourceId }];
  }

  return path;
};

export const checkRabashGroupArticles = source => {
  if (/^gr-/.test(source)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(source);
    return { uid: result[1], isGr: true };
  }

  return { uid: source, isGr: false };
};

export const buildBookmarkSource = source => {
  const { uid, isGr } = checkRabashGroupArticles(source);
  const s             = {
    subject_uid: uid,
    subject_type: CT_SOURCE
  };
  if (isGr) {
    s.properties = { uid_prefix: 'gr-' };
  }

  return s;
};

export const buildLabelData        = source => {
  const { uid, isGr } = checkRabashGroupArticles(source);
  const s             = { content_unit: uid };
  if (isGr) {
    s.properties = { uid_prefix: 'gr-' };
  }

  return s;
};
export const getLibraryContentFile = (data = {}, sourceId) => {
  const { pdf, docx, doc } = data;
  if (pdf && isTaas(sourceId))
    return { url: physicalFile(pdf), isPDF: true, name: pdf.name };

  const file = docx || doc;
  if (!file)
    return {};

  return { url: physicalFile(file, true), name: file.name, id: file.id };
};

export const parentIdByPath = path => (path[1].id);
