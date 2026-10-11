import { getPositionInHtml, prepareScrollToSearch, wrapSeekingPlace } from '../helper';
import { RenderBase } from '../RenderBase';
import { data, tagPositions, cleanTagPositions, dataCleanHtml, source } from '../__fixtures__/base_data';

describe('Base tests search', () => {
  const start          = 'Before I clarify';
  const end            = 'important for me to note';
  const render         = new RenderBase(data, start, end);
  const expectedBefore = '<div>  <p>  <strong>Kabbalah and dedicated myself to it</strong>  </p>  <div class="scroll-to-search" id="__scrollSearchToHere__"><p>  <strong>';
  const expectedAfter  = ' that although all the readers seem</strong>  </p></div> </div';
  const from           = 45;
  const to             = 113;

  test('RenderBase_clearHtmlFromTags', () => {
    render.clearHtmlFromTags();
    expect(render.dataCleanHtml).toEqual(dataCleanHtml);
    expect(render.tagPositions).toEqual(cleanTagPositions);
  });

  test('test_getPositionInHtml', () => {
    const expected       = source.indexOf(start);
    const positionInHtml = getPositionInHtml(from, tagPositions);
    expect(positionInHtml).toEqual(expected);
  });
  test('test_wrapSeekingPlace', () => {
    const { after, before } = wrapSeekingPlace(source, tagPositions, from, to);
    expect(after).toEqual(expectedAfter);
    expect(before).toEqual(expectedBefore);
  });

  test('full_test', () => {
    const expected = '<div> <p> <strong>Kabbalah and dedicated myself to it</strong> </p> <div class="scroll-to-search" id="__scrollSearchToHere__"><p> <strong><em class="_h _b">Before</em> <em class="_h _b">I</em> <em class="_h _b">clarify</em> <em class="_h _b">this</em> <em class="_h _b">exalted</em> <em class="_h _b">matter,</em> <em class="_h _b">it</em> <em class="_h _b">is</em> <em class="_h _b">important</em> <em class="_h _b">for</em> <em class="_h _b">me</em> <em class="_h _b">to</em> <em class="_h _b">note</em> that although all the readers seem</strong> </p></div> </div';
    const result   = prepareScrollToSearch(data, { srchstart: start, srchend: end }, true);
    expect(result).toEqual(expected);
  });

});
