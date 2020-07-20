<<<<<<< HEAD
import { prepareScrollToSearch, selectWholeWorlds } from '../utils';

describe('Scroll to search, selectWholeWorlds:', () => {
  const p         = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const p_withTag = 'Lorem <div dir="ltr">ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</div> tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const pResult   = 'Lorem <em class="highlight">ipsum dolor sit amet,</em> consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  test('all whole', () => {
    const search = 'ipsum dolor sit amet';
    const result = selectWholeWorlds(p, search, 7);
    expect(result).toEqual(pResult);
  });

  test('test not whole start', () => {
    const search = 'sum dolor sit amet';
    const result = selectWholeWorlds(p, search);
    expect(result).toEqual(pResult);
  });

  test('test not whole end', () => {
    const search = 'ipsum dolor sit am';
    const result = selectWholeWorlds(p, search);
    expect(result).toEqual(pResult);
  });
=======
import { prepareScrollToSearch } from '../utils';
import {
  data,
  expected,
  data_withTagInEnd,
  expected_withTagInEnd,
  data_withTagInMiddle,
  expected_withTagInMiddle,
  data_withP,
  expected_withP
} from './scrollToSearchData';

describe('Scroll to search, prepareScrollToSearch:', () => {
  const defSearchStart = 'Before I clarify';
  const defSearchEnd   = 'readers seem to consider';
>>>>>>> add functionality - search with regexp

  test('simple test', () => {
    const result = prepareScrollToSearch(data, defSearchStart, defSearchEnd);
    expect(result).toEqual(expected);
  });

  test('test data with html in the end', () => {
    const result = prepareScrollToSearch(data_withTagInEnd, defSearchStart, defSearchEnd);
    expect(result).toEqual(expected_withTagInEnd);
  });
<<<<<<< HEAD
});

describe('Scroll to search, prepareScrollToSearch:', () => {

  const data = (`<div><p>
  <strong>Body and Soul</strong>
</p>
<p>
  <strong>Before I clarify this exalted matter, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
  <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`);

  const dataResult = (`<div><p>
  <strong>Body and Soul</strong>
</p>
<p class="scroll-to-search"  id="__scrollSearchToHere__" > <em class="highlight"><strong>Before I clarify this exalted matter, it is important for</em> me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p><p>
  <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`);

  test('test all whole', () => {
    const search = 'Before I clarify this exalted matter, it is important';
    const result = prepareScrollToSearch(data, search);
    expect(result).toEqual(dataResult);
=======

  test('test data with html in the middle', () => {
    const result = prepareScrollToSearch(data_withTagInMiddle, defSearchStart, defSearchEnd);
    expect(result).toEqual(expected_withTagInMiddle);
>>>>>>> add functionality - search with regexp
  });

  test('test data separated to p', () => {
    const searchStart = 'Body and Soul';
    const result      = prepareScrollToSearch(data, searchStart, defSearchEnd);
    expect(result).toEqual(expected_withP);
  });
<<<<<<< HEAD
});

describe('Scroll to search, dataWithSup:', () => {
  const dataWithSup = (`<div><p>
  <strong>Body and Soul</strong>
</p>
<p>
  <strong>Before I clarify this exalted matter<sup>1</sup>, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
  <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`);
  const dataResult = (`<div><p>
  <strong>Body and Soul</strong>
</p>
<p class="scroll-to-search"  id="__scrollSearchToHere__" > <em class="highlight"><strong>Before I clarify this exalted matter, it is important for</em> me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p><p>
  <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`);

  /* eslint-disable jest/no-disabled-tests */
  test.skip('test data with <sup>', () => {
    const search = 'Before I clarify this exalted matter, it is important';
    const result = prepareScrollToSearch(dataWithSup, search);
    expect(result).toEqual(dataResult);
  });
=======
>>>>>>> add functionality - search with regexp
});
