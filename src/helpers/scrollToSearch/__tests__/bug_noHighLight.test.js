import { prepareScrollToSearch } from '../helper';

describe('no highlight any text', () => {

  const srchend   = ('rock like our God.”');
  const srchstart = ('This is why it');

  test('test', () => {
    const result = prepareScrollToSearch(data, { srchstart, srchend }, true);
    expect(result).not.toBeNull();
    expect(result).not.toEqual(data);
    expect(result).toEqual(expected);
  });
});

const data = (`<div><h1 class="Chapter" id="none-as-holy-as-the-lord">
  845. None as Holy as the Lord
</h1>
<p>
  “There is none who is as holy as the Lord.” But is there one who is worse than the Creator but holy? “There is no rock like our God.” Does that mean that there is another rock, which is a little worse than the Creator? Rather, there are holy ones and angels and souls, and all receive <em>Kedusha</em> [holiness] from the Creator. This is not so “because there is none besides You.” Rather, You will give them <em>Kedusha</em> [holiness] (<em>The Zohar</em>, <em>Tazria</em>, Item 37).
</p>
<p>
  We should ask what this tells us in the work. One must believe how all the overcoming in the work, and did he labor in order to be rewarded with the Holy one, as it is written, “You will be holy, for I am holy.” At that time, one must know that all of man’s work does not help him whatsoever. Rather, it is all from the Creator.
</p>
<p>
  In other words, all the <em>Kedusha</em> [holiness] that one feels he has comes to him from the Creator. This is what it means that there is no <em>Kedusha</em>, meaning no <em>Kedusha</em> in the world that one can obtain by himself. Rather, everything comes from the Creator. This is why it is written, “There is none as holy as the Lord,” and “There is no rock like our God.”
</p>
<p>
  It is known that <em>Kelim</em> [vessels] are called by the name <em>Elokim</em> [God], and lights are called by the name of <em>HaVaYaH</em>. It is written, “there is no rock,” which is when one sees that he has vessels of bestowal. This is regarded that a new thing was created for him, which is called a “rock,” meaning that in a place where he had vessels of reception, vessels of bestowal have been depicted in him. One should not think that he helped the Creator in any way and by this obtained vessels of bestowal. Rather, everything came from above.
</p>
<p>
  Baal HaSulam said that prior to working, one must say, “If I am not for me, who is for me?” After the work, he should believe in private Providence, meaning that the Creator does everything. This is the meaning of what is written there: “The Creator draws a picture within a picture.” We should interpret that within the form of the <em>Kelim</em>, which is reception, He draws there the form of bestowal.
</p>
</div>`);

const expected = (`<div><h1 class="Chapter" id="none-as-holy-as-the-lord">  845. None as Holy as the Lord </h1> <p>  “There is none who is as holy as the Lord.” But is there one who is worse than the Creator but holy? “There is no rock like our God.” Does that mean that there is another rock, which is a little worse than the Creator? Rather, there are holy ones and angels and souls, and all receive <em>Kedusha</em> [holiness] from the Creator. This is not so “because there is none besides You.” Rather, You will give them <em>Kedusha</em> [holiness] (<em>The Zohar</em>, <em>Tazria</em>, Item 37). </p> <p>  We should ask what this tells us in the work. One must believe how all the overcoming in the work, and did he labor in order to be rewarded with the Holy one, as it is written, “You will be holy, for I am holy.” At that time, one must know that all of man’s work does not help him whatsoever. Rather, it is all from the Creator. </p> <div class="scroll-to-search" id="__scrollSearchToHere__"><p>  In other words, all the <em>Kedusha</em> [holiness] that one feels he has comes to him from the Creator. This is what it means that there is no <em>Kedusha</em>, meaning no <em>Kedusha</em> in the world that one can obtain by himself. Rather, everything comes from the Creator. <em class="_h">This</em> <em class="_h">is</em> <em class="_h">why</em> <em class="_h">it</em> <em class="_h">is</em> <em class="_h">written,</em> <em class="_h">“There</em> <em class="_h">is</em> <em class="_h">none</em> <em class="_h">as</em> <em class="_h">holy</em> <em class="_h">as</em> <em class="_h">the</em> <em class="_h">Lord,”</em> <em class="_h">and</em> <em class="_h">“There</em> <em class="_h">is</em> <em class="_h">no</em> <em class="_h">rock</em> <em class="_h">like</em> <em class="_h">our</em> <em class="_h">God.”</em></p><em class="_h"></em> </p></div> <p>  It is known that <em>Kelim</em> [vessels] are called by the name <em>Elokim</em> [God], and lights are called by the name of <em>HaVaYaH</em>. It is written, “there is no rock,” which is when one sees that he has vessels of bestowal. This is regarded that a new thing was created for him, which is called a “rock,” meaning that in a place where he had vessels of reception, vessels of bestowal have been depicted in him. One should not think that he helped the Creator in any way and by this obtained vessels of bestowal. Rather, everything came from above. </p> <p>  Baal HaSulam said that prior to working, one must say, “If I am not for me, who is for me?” After the work, he should believe in private Providence, meaning that the Creator does everything. This is the meaning of what is written there: “The Creator draws a picture within a picture.” We should interpret that within the form of the <em>Kelim</em>, which is reception, He draws there the form of bestowal. </p> </div>`)
