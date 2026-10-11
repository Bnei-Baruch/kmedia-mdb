import { call, select } from 'redux-saga/effects';

import Api from '../../helpers/Api';
import { SEARCH_TYPES } from '../../redux/modules/search';
import {
  searchGetReasoningResultSelector,
  searchGetReasoningStatusSelector,
  searchGetSearchTypeSelector
} from '../../redux/selectors';
import { finishReasoningSearchNow, recoverFollowupRequest } from '../search';

jest.mock('../../helpers/Api', () => ({
  __esModule: true,
  default: {
    reasoningSearchCache    : jest.fn(),
    reasoningSearchFinishNow: jest.fn()
  }
}));
jest.mock('../../redux/modules/mdb', () => ({ actions: {} }));
jest.mock('../../redux/selectors', () => ({
  searchGetQuerySelector          : jest.fn(),
  searchGetReasoningResultSelector: jest.fn(),
  searchGetReasoningStatusSelector: jest.fn(),
  searchGetSearchTypeSelector     : jest.fn()
}));

describe('reasoning search sagas', () => {
  test('recovers from the original cache mode and follows up in the selected mode', () => {
    const generator = recoverFollowupRequest(
      'initial query',
      'follow-up query',
      'en',
      false,
      true,
      false
    );

    expect(generator.next().value).toEqual(call(Api.reasoningSearchCache, {
      q          : 'initial query',
      ui_language: 'en',
      is_rapid   : true
    }));

    expect(generator.next({ data: { cache_hit: true, session_id: 'recovered-session' } })).toEqual({
      done : true,
      value: {
        keepResult: true,
        resultQuery: 'follow-up query',
        request: {
          q          : 'follow-up query',
          session_id : 'recovered-session',
          ui_language: 'en',
          deb        : false,
          is_rapid   : false
        }
      }
    });
  });

  test('uses the selected mode when cache recovery falls back to a new search', () => {
    const generator = recoverFollowupRequest(
      'initial query',
      'follow-up query',
      'en',
      false,
      false,
      true
    );

    generator.next();
    expect(generator.next({ data: { cache_hit: false } }).value).toMatchObject({
      keepResult: false,
      resultQuery: 'initial query; follow-up query',
      request: {
        q       : 'initial query; follow-up query',
        is_rapid: true
      }
    });
  });

  test('uses the active follow-up query when finishing early', () => {
    const generator = finishReasoningSearchNow();

    expect(generator.next().value).toEqual(select(searchGetSearchTypeSelector));
    expect(generator.next(SEARCH_TYPES.AGENTIC).value).toEqual(select(searchGetReasoningStatusSelector));
    expect(generator.next({ session_id: 'session', query: 'active follow-up' }).value)
      .toEqual(call(Api.reasoningSearchFinishNow, 'session'));
    expect(generator.next({ data: { result_ready: true }, status: 200 }).value)
      .toEqual(select(searchGetReasoningResultSelector));

    const fetchResultEffect = generator.next({ query: 'previous query' }).value;
    expect(fetchResultEffect.CALL.fn.name).toBe('fetchReasoningResult');
    expect(fetchResultEffect.CALL.args).toEqual(['session', 'active follow-up', SEARCH_TYPES.AGENTIC]);
  });
});
