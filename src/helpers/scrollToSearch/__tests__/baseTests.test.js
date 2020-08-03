import { getPositionInHtml, prepareScrollToSearch, wrapSeekingPlace } from '../helper';
import { RenderBase } from '../RenderBase';
import { data, tagPositions, dataCleanHtml, source } from './base_data.test';

describe('Base tests:', () => {
  const start          = 'Before I clarify';
  const end            = 'important for me to note';
  const render         = new RenderBase(data, start, end);
  const expectedBefore = '<div>  <p>  <strong>Kabbalah and dedicated myself to it</strong>  </p>  <div class="scroll-to-search" id="__scrollSearchToHere__"><p>  <strong>';
  const expectedAfter  = ' that although all the readers seem</strong>  </p></div> </div>';
  const from           = 45;
  const to             = 113;

  test('test RenderBase.clearHtmlFromTags', () => {
    render.clearHtmlFromTags();
    expect(render.dataCleanHtml).toEqual(dataCleanHtml);
    expect(render.tagPositions).toEqual(tagPositions);
  });

  test('test getPositionInHtml', () => {
    const expected       = source.indexOf(start);
    const positionInHtml = getPositionInHtml(from, tagPositions);
    expect(positionInHtml).toEqual(expected);
  });
  test('test wrapSeekingPlace', () => {
    const { after, before } = wrapSeekingPlace(source, tagPositions, from, to);
    expect(after).toEqual(expectedAfter);
    expect(before).toEqual(expectedBefore);
  });

  test('full test', () => {
    const expected = '<div>  <p>  <strong>Kabbalah and dedicated myself to it</strong>  </p>  <div class="scroll-to-search" id="__scrollSearchToHere__"><p>  <strong><em class="_h">Before</em> <em class="_h">I</em> <em class="_h">clarify</em> <em class="_h">this</em> <em class="_h">exalted</em> <em class="_h">matter,</em> <em class="_h">it</em> <em class="_h">is</em> <em class="_h">important</em> <em class="_h">for</em> <em class="_h">me</em> <em class="_h">to</em> <em class="_h">note</em> that although all the readers seem</strong>  </p></div> </div>';
    const result   = prepareScrollToSearch(data, { srchstart: start, srchend: end }, true);
    expect(result).toEqual(expected);
  });

});
