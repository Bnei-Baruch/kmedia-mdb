import { OFFSET_TEXT_SEPARATOR, prepareScrollToSearch } from '../helper';

describe('_no highlight any text', () => {

  const srchend   = (`этого»4. Т.е. «человек» означает трепет перед${OFFSET_TEXT_SEPARATOR}100`);
  const srchstart = (`называетесь человеком»? И почему, исходя только${OFFSET_TEXT_SEPARATOR}1`);

  test('bug reproduce _no highlight', () => {
    const result = prepareScrollToSearch(data, { srchstart, srchend });
    expect(result).not.toBeNull();
    expect(result).not.toEqual(data);
    expect(result).toEqual(expected);
  });
});

const data = (`<div><p>
  276. Человек, на коже тела которого
</p>
<p>
  «Человек, на коже тела которого появится опухоль, или лишай, или пятно, и станет оно на коже тела его похожим на язву проказы, должен быть приведен к Аарону-коэну»<a href="#fn1" class="footnote-ref" id="fnref1" name="fnref1"><sup>1</sup></a>.
</p>
<p>
  Комментаторы задают вопрос, почему сказано «адам» (человек), а не «иш» (муж). Возможно, это соответствует словам мудрецов: «Вы называетесь человеком [а не народы мира]»<a href="#fn2" class="footnote-ref" id="fnref2" name="fnref2"><sup>2</sup></a>. И отсюда следует, что идолопоклонники не могут быть осквернены язвами.
</p>
<p>
  И сказано: «На коже тела которого появится», – т.е. скверна проказы появляется у человека из Исраэля только на <em>коже</em> его тела, а не внутри. Ведь у идолопоклонника сама душа его относится к свойству проказы и тому подобного. А на душу человека из Исраэля, когда она повреждена из-за греха, который он совершил, это накладывает видимость проказы на кожу тела его, и именно на <em>кожу</em>, а не на плоть, и не следует говорить о внутренней составляющей (свете жизни).
</p>
<p>
  И следует спросить:
</p>
<ol type="1">
  <li>
    <p>
      Почему именно «вы называетесь человеком»?
    </p>
  </li>
  <li>
    <p>
      И почему, исходя [только лишь] из своего существования, человек в своей внутренней части называется чистым?
    </p>
  </li>
</ol>
<p>
  Можно объяснить это в духе того, что мудрецы сказали о стихе: «В конце всего всё будет услышано: Творца бойся и заповеди Его соблюдай, потому что в этом – весь человек»<a href="#fn3" class="footnote-ref" id="fnref3" name="fnref3"><sup>3</sup></a>. И сказал он [рав Хельбо со слов рава Хуны]: «Что значит: «Потому что в этом – весь человек?» … Весь мир был сотворен только ради этого … это равнозначно всему миру … весь мир был создан, чтобы собраться вокруг этого»<a href="#fn4" class="footnote-ref" id="fnref4" name="fnref4"><sup>4</sup></a>.
</p>
<p>
  Т.е. «человек» означает трепет перед небесами. Поэтому «вы называетесь человеком» – имеется в виду трепет перед небесами, т.е. тот, у кого есть трепет пред небесами, называется человеком. Поэтому иногда выходит, что совершение какого-либо греха – это только случайность, что называется внешней стороной, на которую указывает «кожа», так как кожа – это внешнее свойство, как объясняется, что есть моха, ацамот (кости), гидин (сухожилия), плоть и кожа.
</p>
<p>
  И отсюда становится ясно, что тот, кто называется человеком, в своей внутренней части чист, а скверна, которая раскрывается в нем иногда из-за греха, – это только во внешней части. Поэтому у идолопоклонника, т.е. у того, в ком нет страха перед небесами, нет проказы, – он нечист изнутри.
</p>
<p>
  Ибо только для того, у кого есть страх перед небесами, и кто называется человеком, можно говорить о грехе. И грех проявляется у него в виде проказы, прилепившейся к человеку.
</p>
<p>
  В то же время, тот, у кого нет страха перед небесами, полон грехов, и его внутренняя часть тоже не такая, как нужно. Поэтому не надо думать, что грех будет считаться его внешней частью, ибо он и во внутренней части нечист.
</p>
<p>
  А прийти к страху перед небесами можно с помощью Торы, как сказали наши мудрецы: «Свет в ней возвращает к источнику»<a href="#fn5" class="footnote-ref" id="fnref5" name="fnref5"><sup>5</sup></a>.
</p>
<section class="footnotes">
  <hr>
  <ol>
    <li id="fn1">
      <p>
        Ваикра, 13:2.<a href="#fnref1" class="footnote-back">↩︎</a>
      </p>
    </li>
    <li id="fn2">
      <p>
        Трактат Евамот, 61:1.<a href="#fnref2" class="footnote-back">↩︎</a>
      </p>
    </li>
    <li id="fn3">
      <p>
        Коэлет, 12:13.<a href="#fnref3" class="footnote-back">↩︎</a>
      </p>
    </li>
    <li id="fn4">
      <p>
        Трактат Брахот, 6:2/<a href="#fnref4" class="footnote-back">↩︎</a>
      </p>
    </li>
    <li id="fn5">
      <p>
        Мидраш Раба, Эйха, Предисловие, п. 2.<a href="#fnref5" class="footnote-back">↩︎</a>
      </p>
    </li>
  </ol>
</section>
</div>`);

const expected = (`<div><p>  276. Человек, на коже тела которого </p> <p>  «Человек, на коже тела которого появится опухоль, или лишай, или пятно, и станет оно на коже тела его похожим на язву проказы, должен быть приведен к Аарону-коэну»<a href="#fn1" class="footnote-ref" id="fnref1" name="fnref1"><sup>1</sup></a>. </p> <p>  Комментаторы задают вопрос, почему сказано «адам» (человек), а не «иш» (муж). Возможно, это соответствует словам мудрецов: «Вы называетесь человеком [а не народы мира]»<a href="#fn2" class="footnote-ref" id="fnref2" name="fnref2"><sup>2</sup></a>. И отсюда следует, что идолопоклонники не могут быть осквернены язвами. </p> <p>  И сказано: «На коже тела которого появится», – т.е. скверна проказы появляется у человека из Исраэля только на <em>коже</em> его тела, а не внутри. Ведь у идолопоклонника сама душа его относится к свойству проказы и тому подобного. А на душу человека из Исраэля, когда она повреждена из-за греха, который он совершил, это накладывает видимость проказы на кожу тела его, и именно на <em>кожу</em>, а не на плоть, и не следует говорить о внутренней составляющей (свете жизни). </p> <p>  И следует спросить: </p> <ol type="1">  <li>  <div class="scroll-to-search" id="__scrollSearchToHere__"><p>  Почему именно «вы <em class="_h">называетесь</em> <em class="_h">человеком»?</em> </p>  </li>  <li>  <p>   <em class="_h">И</em> <em class="_h">почему,</em> <em class="_h">исходя</em> <em class="_h">[только</em> лишь] из своего существования, человек в своей внутренней части называется чистым?  </p>  </li> </ol> <p>  Можно объяснить это в духе того, что мудрецы сказали о стихе: «В конце всего всё будет услышано: Творца бойся и заповеди Его соблюдай, потому что в этом – весь человек»<a href="#fn3" class="footnote-ref" id="fnref3" name="fnref3"><sup>3</sup></a>. И сказал он [рав Хельбо со слов рава Хуны]: «Что значит: «Потому что в этом – весь человек?» … Весь мир был сотворен только ради этого … это равнозначно всему миру … весь мир был создан, чтобы собраться вокруг <em class="_h">этого»</em><a href="#fn4" class="footnote-ref" id="fnref4" name="fnref4"><em class="_h"></em><sup><em class="_h">4</em></sup><em class="_h"></em></a><em class="_h">.</em></p><em class="_h"></em> <p>   <em class="_h">Т.е.</em> <em class="_h">«человек»</em> <em class="_h">означает</em> <em class="_h">трепет</em> <em class="_h">перед</em> небесами. Поэтому «вы называетесь человеком» – имеется в виду трепет перед небесами, т.е. тот, у кого есть трепет пред небесами, называется человеком. Поэтому иногда выходит, что совершение какого-либо греха – это только случайность, что называется внешней стороной, на которую указывает «кожа», так как кожа – это внешнее свойство, как объясняется, что есть моха, ацамот (кости), гидин (сухожилия), плоть и кожа. </p></div> <p>  И отсюда становится ясно, что тот, кто называется человеком, в своей внутренней части чист, а скверна, которая раскрывается в нем иногда из-за греха, – это только во внешней части. Поэтому у идолопоклонника, т.е. у того, в ком нет страха перед небесами, нет проказы, – он нечист изнутри. </p> <p>  Ибо только для того, у кого есть страх перед небесами, и кто называется человеком, можно говорить о грехе. И грех проявляется у него в виде проказы, прилепившейся к человеку. </p> <p>  В то же время, тот, у кого нет страха перед небесами, полон грехов, и его внутренняя часть тоже не такая, как нужно. Поэтому не надо думать, что грех будет считаться его внешней частью, ибо он и во внутренней части нечист. </p> <p>  А прийти к страху перед небесами можно с помощью Торы, как сказали наши мудрецы: «Свет в ней возвращает к источнику»<a href="#fn5" class="footnote-ref" id="fnref5" name="fnref5"><sup>5</sup></a>. </p> <section class="footnotes">  <hr>  <ol>  <li id="fn1">  <p>  Ваикра, 13:2.<a href="#fnref1" class="footnote-back">↩︎</a>  </p>  </li>  <li id="fn2">  <p>  Трактат Евамот, 61:1.<a href="#fnref2" class="footnote-back">↩︎</a>  </p>  </li>  <li id="fn3">  <p>  Коэлет, 12:13.<a href="#fnref3" class="footnote-back">↩︎</a>  </p>  </li>  <li id="fn4">  <p>  Трактат Брахот, 6:2/<a href="#fnref4" class="footnote-back">↩︎</a>  </p>  </li>  <li id="fn5">  <p>  Мидраш Раба, Эйха, Предисловие, п. 2.<a href="#fnref5" class="footnote-back">↩︎</a>  </p>  </li>  </ol> </section> </div>`);