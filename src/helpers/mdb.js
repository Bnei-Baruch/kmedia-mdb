import {
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_FRIENDS_GATHERINGS,
  CT_HOLIDAY,
  CT_LECTURE_SERIES,
  CT_MEALS,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM,
} from './consts';

export class CollectionsBreakdown {
  constructor(collections) {
    this.byType = (collections || []).reduce((acc, val) => {
      const vals = acc[val.content_type];
      if (Array.isArray(vals)) {
        vals.push(val);
      } else {
        acc[val.content_type] = [val];
      }
      return acc;
    }, {});
  }

  getDailyLessons = () =>
    this.collectTypes(CT_DAILY_LESSON, CT_SPECIAL_LESSON);

  getEvents = () =>
    this.collectTypes(CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY);

  getPrograms = () =>
    this.collectTypes(CT_VIDEO_PROGRAM);

  getAllButDailyLessons = () =>
    this.collectTypes(
      CT_FRIENDS_GATHERINGS,
      CT_VIDEO_PROGRAM,
      CT_LECTURE_SERIES,
      CT_MEALS,
      CT_CONGRESS,
      CT_HOLIDAY,
      CT_PICNIC,
      CT_UNITY_DAY);

  getAllButPrograms = () =>
    this.collectTypes(
      CT_DAILY_LESSON, CT_SPECIAL_LESSON,
      CT_FRIENDS_GATHERINGS,
      CT_LECTURE_SERIES,
      CT_MEALS,
      CT_CONGRESS,
      CT_HOLIDAY,
      CT_PICNIC,
      CT_UNITY_DAY);

  collectTypes = (...types) =>
    types.reduce((acc, val) =>
      acc.concat(this.byType[val] || []), []);
}
