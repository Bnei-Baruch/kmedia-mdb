/**
 * data for test
 * @type {string}
 */
export const data = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify this exalted matter, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`
);

export const tagsPosition_data = [
  {
    "str": "<div>",
    "pos": 0
  },
  {
    "str": "<p>",
    "pos": 5
  },
  {
    "str": "<strong>",
    "pos": 9
  },
  {
    "str": "</strong>",
    "pos": 30
  },
  {
    "str": "</p>",
    "pos": 40
  },
  {
    "str": "<p>",
    "pos": 45
  },
  {
    "str": "<strong>",
    "pos": 49
  },
  {
    "str": "</strong>",
    "pos": 697
  },
  {
    "str": "</p>",
    "pos": 707
  },
  {
    "str": "<p>",
    "pos": 712
  },
  {
    "str": "<strong>",
    "pos": 716
  },
  {
    "str": "</strong>",
    "pos": 1137
  },
  {
    "str": "</p>",
    "pos": 1146
  },
  {
    "str": "</div>",
    "pos": 1150
  }
];

export const data_withTagInEnd = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify this exalted <sup>matter</sup>, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`
);

export const data_withTagInMiddle = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify <div dir="ltr">this exalted</div> matter, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`
);

export const data_withP = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify <p>this exalted</p> matter, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`
);

/**
 * expected data
 * @type {string}
 */
export const expected = `<div><p> <strong>Body and Soul</strong> </p> <div class="scroll-to-search" id="__scrollSearchToHere__"><p> <strong><em class="_h">Before</em> <em class="_h">I</em> <em class="_h">clarify</em> <em class="_h">this</em> <em class="_h">exalted</em> <em class="_h">matter,</em> <em class="_h">it</em> <em class="_h">is</em> <em class="_h">important</em> <em class="_h">for</em> <em class="_h">me</em> <em class="_h">to</em> <em class="_h">note</em> <em class="_h">that</em> <em class="_h">although</em> <em class="_h">all</em> <em class="_h">the</em> <em class="_h">readers</em> <em class="_h">seem</em> <em class="_h">to</em> <em class="_h">consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p></div> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`;

export const expected_withTagInMiddle = `<div><p> <strong>Body and Soul</strong> </p> <div class="scroll-to-search" id="__scrollSearchToHere__"><p> <strong><em class="_h">Before</em> <em class="_h">I</em> <em class="_h">clarify</em><div dir="ltr"> <em class="_h">this</em> <em class="_h">exalted</em></div> <em class="_h">matter,</em> <em class="_h">it</em> <em class="_h">is</em> <em class="_h">important</em> <em class="_h">for</em> <em class="_h">me</em> <em class="_h">to</em> <em class="_h">note</em> <em class="_h">that</em> <em class="_h">although</em> <em class="_h">all</em> <em class="_h">the</em> <em class="_h">readers</em> <em class="_h">seem</em> <em class="_h">to</em> <em class="_h">consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p></div> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`;

export const expected_withTagInEnd = `<div><p> <strong>Body and Soul</strong> </p> <div class="scroll-to-search" id="__scrollSearchToHere__"><p> <strong><em class="_h">Before</em> <em class="_h">I</em> <em class="_h">clarify</em> <em class="_h">this</em> <em class="_h">exalted</em><sup> <em class="_h">matter,</em></sup> <em class="_h">it</em> <em class="_h">is</em> <em class="_h">important</em> <em class="_h">for</em> <em class="_h">me</em> <em class="_h">to</em> <em class="_h">note</em> <em class="_h">that</em> <em class="_h">although</em> <em class="_h">all</em> <em class="_h">the</em> <em class="_h">readers</em> <em class="_h">seem</em> <em class="_h">to</em> <em class="_h">consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p></div> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`;

export const expected_withP = `<div><div class="scroll-to-search" id="__scrollSearchToHere__"><p> <strong><em class="_h">Body</em> <em class="_h">and</em> <em class="_h">Soul</em></strong> </p> <p> <em class="_h">Before</em><strong> <em class="_h">I</em> <em class="_h">clarify</em> <em class="_h">this</em> <em class="_h">exalted</em> <em class="_h">matter,</em> <em class="_h">it</em> <em class="_h">is</em> <em class="_h">important</em> <em class="_h">for</em> <em class="_h">me</em> <em class="_h">to</em> <em class="_h">note</em> <em class="_h">that</em> <em class="_h">although</em> <em class="_h">all</em> <em class="_h">the</em> <em class="_h">readers</em> <em class="_h">seem</em> <em class="_h">to</em> <em class="_h">consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p></div> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`;

export const expected_wrapped_before = (
  `<div><div class="scroll-to-search" id="__scrollSearchToHere__"><p>
<strong>Body `
);

export const expected_wrapped_after = (
  ` to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p></div>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…</strong></p></div>`
);
