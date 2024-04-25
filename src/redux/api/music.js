import { backendApi } from './backendApi';
import { Requests } from '../../helpers/Api';
import { CT_SONGS } from '../../helpers/consts';

export const wholeMusic = 'Music';

export const musicApi = backendApi.injectEndpoints({
  tagTypes : [wholeMusic],
  endpoints: builder => ({
    music: builder.query({
      providesTags: [wholeMusic],

      query: ({ uiLanguage, contentLanguages }) =>
        `collections?${Requests.makeParams({
          content_type     : CT_SONGS,
          ui_language      : uiLanguage,
          content_languages: contentLanguages,
          pageNo           : 1,
          pageSize         : 1000, // NOTE: we need to get all data, and the endpoint lets us fetch only with pagination,
          with_units       : false
        })}`
    })
  })
});

export const { useMusicQuery } = musicApi;
