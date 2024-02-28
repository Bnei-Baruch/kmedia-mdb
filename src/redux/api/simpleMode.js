import { backendApi } from './backendApi';
import moment from 'moment/moment';
import { Requests } from '../../helpers/Api';

export const simpleModeApi = backendApi.injectEndpoints({
  endpoints: builder => ({
    simpleMode: builder.query({
      query: ({ date, uiLanguage, contentLanguage }) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');

        return `simple?${Requests.makeParams({
          start_date: formattedDate,
          end_date: formattedDate,
          ui_language: uiLanguage,
          content_languages: contentLanguage
        })}`;
      }
    })
  })
});

export const { useSimpleModeQuery } = simpleModeApi;
