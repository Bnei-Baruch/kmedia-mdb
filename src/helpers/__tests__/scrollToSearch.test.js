import { selectWholeWorlds, prepareScrollToSearch } from '../utils';

describe('Scroll to search, selectWholeWorlds:', () => {
  const p       = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const pResult = 'Lorem <em class="highlight">ipsum dolor sit amet,</em> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  test('all whole', () => {
    const search = 'ipsum dolor sit amet';
    const result = selectWholeWorlds(p, search, 7);
    expect(result).toEqual(pResult);
  });

  test('test not whole start', () => {
    const search = 'sum dolor sit amet';
    const result = selectWholeWorlds(p, search, 9);
    expect(result).toEqual(pResult);
  });

  test('test not whole end', () => {
    const search = 'ipsum dolor sit am';
    const result = selectWholeWorlds(p, search, 7);
    expect(result).toEqual(pResult);
  });

  test('test not whole start and end', () => {
    const search = 'sum dolor sit am';
    const result = selectWholeWorlds(p, search, 7);
    expect(result).toEqual(pResult);
  });
});
