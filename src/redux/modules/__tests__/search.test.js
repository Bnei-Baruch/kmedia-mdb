import reducer, { actions, SEARCH_TYPES } from '../search';

const reasoningState = state => state.reasoningByType[SEARCH_TYPES.AGENTIC];

const completeReasoningSearch = (state, searchType, query, results = []) => reducer(
  state,
  actions.reasoningSearchSuccess({
    searchType,
    query,
    searchResults: {
      session_id: 'reasoning-session',
      query,
      followups_remaining: 2,
      results
    }
  })
);

describe('search reasoning conversation', () => {
  test('keeps rapid and non-rapid follow-ups in one conversation', () => {
    let state = reducer(undefined, { type: 'test/init' });
    state = reducer(state, actions.setSearchType(SEARCH_TYPES.AGENTIC_RAPID));
    state = reducer(state, actions.reasoningSearchStart({
      searchType: SEARCH_TYPES.AGENTIC_RAPID,
      requestKind: 'initial',
      query: 'initial query'
    }));
    state = completeReasoningSearch(state, SEARCH_TYPES.AGENTIC_RAPID, 'initial query', [{ mdb_uid: 'initial-result' }]);

    state = reducer(state, actions.setSearchType(SEARCH_TYPES.AGENTIC));
    state = reducer(state, actions.reasoningSearchStart({
      keepResult : true,
      searchType : SEARCH_TYPES.AGENTIC,
      requestKind: 'followup',
      query      : 'follow-up query'
    }));
    state = completeReasoningSearch(state, SEARCH_TYPES.AGENTIC, 'follow-up query', [{ mdb_uid: 'followup-result' }]);

    expect(reasoningState(state).previousSearches).toHaveLength(1);
    expect(reasoningState(state).previousSearches[0]).toMatchObject({
      query        : 'initial query',
      display_query: 'initial query',
      is_rapid     : true
    });
    expect(reasoningState(state).result).toMatchObject({
      query        : 'follow-up query',
      display_query: 'follow-up query',
      is_rapid     : false
    });
    expect(reasoningState(state).requestKind).toBeNull();
  });

  test('retains follow-up request context after failure or cancellation', () => {
    let state = reducer(undefined, { type: 'test/init' });
    state = reducer(state, actions.setSearchType(SEARCH_TYPES.AGENTIC_RAPID));
    state = reducer(state, actions.reasoningSearchStart({
      keepResult : true,
      searchType : SEARCH_TYPES.AGENTIC_RAPID,
      requestKind: 'followup',
      query      : 'retry this follow-up'
    }));
    state = reducer(state, actions.searchFailure({
      error     : new Error('failed'),
      searchType: SEARCH_TYPES.AGENTIC_RAPID
    }));

    expect(reasoningState(state).requestKind).toBe('followup');
    expect(reasoningState(state).wip).toBe(false);

    state = reducer(state, actions.reasoningCancel());
    expect(reasoningState(state).requestKind).toBe('followup');
    expect(reasoningState(state).status).toMatchObject({ state: 'canceled', phase: 'canceled' });
  });

  test('regular search success does not clear the reasoning conversation', () => {
    let state = reducer(undefined, { type: 'test/init' });
    state = reducer(state, actions.reasoningSearchStart({
      searchType: SEARCH_TYPES.AGENTIC_RAPID,
      requestKind: 'initial',
      query: 'agentic query'
    }));
    state = completeReasoningSearch(state, SEARCH_TYPES.AGENTIC_RAPID, 'agentic query');
    state = reducer(state, actions.setSearchType(SEARCH_TYPES.REGULAR));
    state = reducer(state, actions.searchSuccess({
      searchResults: { search_result: { hits: { hits: [], total: 0 } } },
      searchRequest: { q: 'regular query' },
      filterParams : '',
      query        : 'regular query',
      pageNo       : 1
    }));

    expect(state.queryResult.search_result).toBeDefined();
    expect(state.prevQuery).toBe('regular query');
    expect(reasoningState(state).result.query).toBe('agentic query');
  });
});
