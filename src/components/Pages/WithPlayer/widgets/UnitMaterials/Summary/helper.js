import MediaHelper from '../../../../../../helpers/media';
import {
  INSERT_TYPE_SUMMARY,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_LESSONS,
  CT_VIRTUAL_LESSON,
  CT_CLIP
} from '../../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../../helpers/language';

export const showSummaryTab = (unit, contentLanguages) => {
  const summaryLanguages = getSummaryLanguages(unit);
  const summaryLanguage  = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language,
    /*defaultReturnLanguage=*/ '');

  // We should show Summary tab for specific list of content types, and if description exist or summary file.
  return [...CT_LESSONS, CT_VIDEO_PROGRAM_CHAPTER, CT_VIRTUAL_LESSON, CT_CLIP].includes(unit.content_type) &&
    (!!unit.description || !!summaryLanguage);
};

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
