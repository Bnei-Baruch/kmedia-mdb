import MediaHelper from '../../../../../../helpers/media';
import { INSERT_TYPE_SUMMARY } from '../../../../../../helpers/consts';

export const getSummaryLanguages = unit =>
  (unit && unit.files &&
    unit.files.filter(f =>
      MediaHelper.IsText(f) && !MediaHelper.IsPDF(f) && f.insert_type === INSERT_TYPE_SUMMARY)
      .map(f => f.language)) || [];

export const getFile = (unit, lang) => {
  if (!unit || !Array.isArray(unit.files)) {
    return null;
  }

  return unit.files?.filter(f => f.language === lang)
    .filter(f => MediaHelper.IsText(f) && !MediaHelper.IsPDF(f))
    .find(f => f.insert_type === INSERT_TYPE_SUMMARY);
};
