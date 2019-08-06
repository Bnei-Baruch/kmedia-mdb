import {
  CT_ARTICLES,
  CT_CLIPS,
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
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSONS,
  CT_BLOG_POST,
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

  getDailyLessons = () => this.collectTypes(CT_DAILY_LESSON, CT_SPECIAL_LESSON);

  getEvents = () => this.collectTypes(CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY);

  getPrograms = () => this.collectTypes(CT_VIDEO_PROGRAM);

  getLectures = () => this.collectTypes(CT_LECTURE_SERIES, CT_WOMEN_LESSONS, CT_VIRTUAL_LESSONS);

  getArticles = () => this.collectTypes(CT_ARTICLES);

  getClips = () => this.collectTypes(CT_CLIPS);

  getAudioBlogs = () => this.collectTypes(CT_BLOG_POST);

  getAllButClips = () => (
    this.collectTypes(
      CT_DAILY_LESSON,
      CT_SPECIAL_LESSON,
      CT_LECTURE_SERIES,
      CT_WOMEN_LESSONS,
      CT_VIRTUAL_LESSONS,
      CT_FRIENDS_GATHERINGS,
      CT_VIDEO_PROGRAM,
      CT_MEALS,
      CT_CONGRESS,
      CT_HOLIDAY,
      CT_PICNIC,
      CT_UNITY_DAY,
      CT_ARTICLES)
  );

  getAllButDailyLessons = () => (
    this.collectTypes(
      CT_LECTURE_SERIES,
      CT_WOMEN_LESSONS,
      CT_VIRTUAL_LESSONS,
      CT_FRIENDS_GATHERINGS,
      CT_VIDEO_PROGRAM,
      CT_MEALS,
      CT_CONGRESS,
      CT_HOLIDAY,
      CT_PICNIC,
      CT_UNITY_DAY,
      CT_CLIPS,
      CT_ARTICLES)
  );

  getAllButPrograms = () => (
    this.collectTypes(
      CT_DAILY_LESSON,
      CT_SPECIAL_LESSON,
      CT_FRIENDS_GATHERINGS,
      CT_LECTURE_SERIES,
      CT_WOMEN_LESSONS,
      CT_VIRTUAL_LESSONS,
      CT_MEALS,
      CT_CONGRESS,
      CT_HOLIDAY,
      CT_PICNIC,
      CT_UNITY_DAY,
      CT_CLIPS,
      CT_ARTICLES)
  );

  collectTypes = (...types) => (
    types.reduce((acc, val) => (
      acc.concat(this.byType[val] || [])
    ), [])
  );
}
