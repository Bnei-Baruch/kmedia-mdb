import { SuggestionsHelper } from '../search';

const data = {
  'suggest': {
    'title_suggest': [{
      'text': 'הערבות',
      'offset': 0,
      'length': 6,
      'options': [{
        'text': 'הערבות',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'NSKA7XQBlwT3qaGzc7AQ',
        'score': 0,
        '_score': 210,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'sources',
          'mdb_uid': 'itcVAcFn',
          'typed_uids': null,
          'filter_values': null,
          'title': 'בעל הסולם \u003e מאמרים \u003e הערבות',
          'full_title': '',
          'title_suggest': { 'input': null, 'weight': 0 }
        }
      }, {
        'text': 'הערבות - קיצור',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'uSKA7XQBlwT3qaGzjc_i',
        'score': 0,
        '_score': 50,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'sources',
          'mdb_uid': '6zlJ4KJH',
          'typed_uids': null,
          'filter_values': null,
          'title': 'מיכאל לייטמן \u003e קיצורי מאמרים  \u003e בעל הסולם. הערבות - קיצור',
          'full_title': '',
          'title_suggest': { 'input': null, 'weight': 0 }
        }
      }, {
        'text': '"הערבות בקבוצה".',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'ECiH7XQBlwT3qaGzOTdd',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'units',
          'mdb_uid': 'a4UBumcg',
          'full_title': '',
          'title': '"העתיד הוא באחדות העולם". כנס העולמי במוסקבה, שיעור 5. נושא השיעור: "הערבות בקבוצה".'
        }
      }, {
        'text': '"הערבות"',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'ByaE7XQBlwT3qaGz1uvZ',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-38934',
          'full_title': '',
          'title': 'על מה מבוססת תנועת "הערבות"'
        }
      }, {
        'text': '"הערבות" בשפה הרוסית',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'tCaE7XQBlwT3qaGzy-PK',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-42456',
          'full_title': '',
          'title': 'עיתון "הערבות" בשפה הרוסית'
        }
      }, {
        'text': '"הערבות" של תנועת ה"ערבות"',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'VSeF7XQBlwT3qaGzLizM',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-56770',
          'full_title': '',
          'title': 'עיתון "הערבות" של תנועת ה"ערבות"'
        }
      }, {
        'text': '"הערבות" – תקציר',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'NSeF7XQBlwT3qaGzFReS',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': { 'result_type': 'posts', 'mdb_uid': '4-885', 'full_title': '', 'title': 'מאמר "הערבות" – תקציר' }
      }, {
        'text': '"הערבות", 23.04.10',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'OSaE7XQBlwT3qaGzksNx',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-7305',
          'full_title': '',
          'title': 'שיעור על פי מאמר "הערבות", 23.04.10'
        }
      }, {
        'text': '"הערבות", גיליון מס\' 3',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'eyaE7XQBlwT3qaGzwd1s',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-71052',
          'full_title': '',
          'title': 'עיתון "הערבות", גיליון מס\' 3'
        }
      }, {
        'text': '"הערבות", גיליון מס\' 4',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': '4yaE7XQBlwT3qaGzZqaa',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-76417',
          'full_title': '',
          'title': 'עיתון "הערבות", גיליון מס\' 4'
        }
      }, {
        'text': '"הערבות", גיליון מס\' 5',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'XSeF7XQBlwT3qaGzMC3T',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-87189',
          'full_title': '',
          'title': 'עיתון "הערבות", גיליון מס\' 5'
        }
      }, {
        'text': '-הערבות',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'ZCSC7XQBlwT3qaGzaLQS',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': { 'result_type': 'units', 'mdb_uid': 'qAQfTUk8', 'full_title': '', 'title': 'קבלה למתחיל -הערבות' }
      }, {
        'text': 'הערבות אינה כדאית לאגואיזם?',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': '6yeF7XQBlwT3qaGzLSvZ',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-12477',
          'full_title': '',
          'title': 'למה הערבות אינה כדאית לאגואיזם?'
        }
      }, {
        'text': 'הערבות אפשר להשיג הכול',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'hieF7XQBlwT3qaGzCA2z',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-38572',
          'full_title': '',
          'title': 'על ידי הערבות אפשר להשיג הכול'
        }
      }, {
        'text': 'הערבות בערבה, 18.11.2011, שיעורים',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'diaE7XQBlwT3qaGzt9f8',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-47355',
          'full_title': '',
          'title': 'כנס הערבות בערבה, 18.11.2011, שיעורים'
        }
      }, {
        'text': 'הערבות בערבה: "כאיש אחד בלב אחד", 18-19.11.2011',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'tSaE7XQBlwT3qaGzvNqR',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-47536',
          'full_title': '',
          'title': 'כנס הערבות בערבה: "כאיש אחד בלב אחד", 18-19.11.2011'
        }
      }, {
        'text': 'הערבות ההדדית',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'QSeF7XQBlwT3qaGzIh-l',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': { 'result_type': 'posts', 'mdb_uid': '4-42792', 'full_title': '', 'title': 'מדינת הערבות ההדדית' }
      }, {
        'text': 'הערבות ההדדית דרך החינוך האינטגרלי',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'piaE7XQBlwT3qaGz1-tx',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-75037',
          'full_title': '',
          'title': 'אל הערבות ההדדית דרך החינוך האינטגרלי'
        }
      }, {
        'text': 'הערבות ההדדית – לכל העולם',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'NyaE7XQBlwT3qaGz0ecJ',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-38931',
          'full_title': '',
          'title': 'הערבות ההדדית – לכל העולם'
        }
      }, {
        'text': 'הערבות ההדדית!',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'PyeF7XQBlwT3qaGzDA-Q',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-119479',
          'full_title': '',
          'title': 'כל האמצעים לפרסום של הערבות ההדדית!'
        }
      }, {
        'text': 'הערבות ההדדית", חלק א',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'VyeF7XQBlwT3qaGzS0tN',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'units',
          'mdb_uid': 'Y9IbvjuX',
          'full_title': '',
          'title': 'הכנה לכנס "העתיד מתחיל כאן" באירופה, שיעור 4 "חוק הערבות ההדדית", חלק א'
        }
      }, {
        'text': 'הערבות ההדדית", חלק ב',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'WCeF7XQBlwT3qaGzS0tN',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'units',
          'mdb_uid': '7AjZFqxV',
          'full_title': '',
          'title': 'הכנה לכנס "העתיד מתחיל כאן" באירופה, שיעור 4 "חוק הערבות ההדדית", חלק ב'
        }
      }, {
        'text': 'הערבות היא המפתח לעולם החדש',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'byeF7XQBlwT3qaGzExSM',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-36366',
          'full_title': '',
          'title': 'הערבות היא המפתח לעולם החדש'
        }
      }, {
        'text': 'הערבות היא התשובה לקריאת הטבע',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'MiaE7XQBlwT3qaGzp82Z',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-39006',
          'full_title': '',
          'title': 'הערבות היא התשובה לקריאת הטבע'
        }
      }, {
        'text': 'הערבות היא חוק ללא פרצות',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'zSeF7XQBlwT3qaGzDA4U',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': { 'result_type': 'posts', 'mdb_uid': '4-55688', 'full_title': '', 'title': 'הערבות היא חוק ללא פרצות' }
      }, {
        'text': 'הערבות היא מדד של הרמה הרוחנית',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': '-CaE7XQBlwT3qaGzbaq-',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'posts',
          'mdb_uid': '4-106218',
          'full_title': '',
          'title': 'הערבות היא מדד של הרמה הרוחנית'
        }
      }, {
        'text': 'הערבות היא עובדה קיימת',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'nSeF7XQBlwT3qaGzYlxs',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': { 'result_type': 'posts', 'mdb_uid': '4-45995', 'full_title': '', 'title': 'הערבות היא עובדה קיימת' }
      }, {
        'text': 'הערבות העולמי',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': 'ySKA7XQBlwT3qaGzgsjX',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'units',
          'mdb_uid': 'HKha9GTO',
          'full_title': '',
          'title': 'מוטי מור - ההופעה, כנס הערבות העולמי'
        }
      }, {
        'text': 'הערבות העולמי - הופעה - הארץ המובטחת',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': '4yKA7XQBlwT3qaGzgsjX',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'units',
          'mdb_uid': 'HCFlUenc',
          'full_title': '',
          'title': 'כנס הערבות העולמי - הופעה - הארץ המובטחת'
        }
      }, {
        'text': 'הערבות העולמי - הופעה של   הדור האחרון" ו סת\' בריי',
        '_index': 'prod_results_he_2020-10-03t04:06:33-04:00',
        '_type': 'result',
        '_id': '7SKA7XQBlwT3qaGzgsjX',
        'score': 0,
        '_score': 1,
        'highlighted': '',
        'collate_match': false,
        'freq': 0,
        '_source': {
          'result_type': 'units',
          'mdb_uid': 'zkoIBRwi',
          'full_title': '',
          'title': 'כנס הערבות העולמי - הופעה של   הדור האחרון" ו סת\' ברייטמן"'
        }
      }]
    }]
  }
};

describe('Bug: sources not on the top', () => {
  test('simple', () => {
    const sh = new SuggestionsHelper(data);
    expect(sh.getSuggestions()[0]).toEqual('בעל הסולם \u003e מאמרים \u003e הערבות');
    expect(sh.getSuggestions()[1]).toEqual('מיכאל לייטמן \u003e קיצורי מאמרים  \u003e בעל הסולם. הערבות - קיצור');
  });
});
