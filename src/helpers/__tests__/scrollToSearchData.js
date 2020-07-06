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
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`
);

export const data_withTagInEnd = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify this exalted <sup>matter</sup>, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`
);

export const data_withTagInMiddle = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify <div dir="ltr">this exalted</div> matter, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`
);

export const data_withP = (
  `<div><p>
<strong>Body and Soul</strong>
</p>
<p>
<strong>Before I clarify <p>this exalted</p> matter, it is important for me to note that although all the readers seem to consider it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong>
</p>
<p>
<strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`
);

/**
 * expected data
 * @type {string}
 */
export const expected = `<div><p> <strong>Body and Soul</strong> </p> <p> <strong><em>Before</em> <em>I</em> <em>clarify</em> <em>this</em> <em>exalted</em> <em>matter,</em> <em>it</em> <em>is</em> <em>important</em> <em>for</em> <em>me</em> <em>to</em> <em>note</em> <em>that</em> <em>although</em> <em>all</em> <em>the</em> <em>readers</em> <em>seem</em> <em>to</em> <em>consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`;

export const expected_withTagInMiddle = `<div><p> <strong>Body and Soul</strong> </p> <p> <strong><em>Before</em> <em>I</em> <em>clarify</em><div dir="ltr"> <em>this</em> <em>exalted</em></div> <em>matter,</em> <em>it</em> <em>is</em> <em>important</em> <em>for</em> <em>me</em> <em>to</em> <em>note</em> <em>that</em> <em>although</em> <em>all</em> <em>the</em> <em>readers</em> <em>seem</em> <em>to</em> <em>consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`;

export const expected_withTagInEnd = `<div><p> <strong>Body and Soul</strong> </p> <p> <strong><em>Before</em> <em>I</em> <em>clarify</em> <em>this</em> <em>exalted</em><sup> <em>matter,</em></sup> <em>it</em> <em>is</em> <em>important</em> <em>for</em> <em>me</em> <em>to</em> <em>note</em> <em>that</em> <em>although</em> <em>all</em> <em>the</em> <em>readers</em> <em>seem</em> <em>to</em> <em>consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`;

export const expected_withP = `<div><p> <strong><em>Body</em> <em>and</em> <em>Soul</em></strong> </p> <p> <em>Before</em><strong> <em>I</em> <em>clarify</em> <em>this</em> <em>exalted</em> <em>matter,</em> <em>it</em> <em>is</em> <em>important</em> <em>for</em> <em>me</em> <em>to</em> <em>note</em> <em>that</em> <em>although</em> <em>all</em> <em>the</em> <em>readers</em> <em>seem</em> <em>to</em> <em>consider</em> it impossible to clarify and bring such a matter closer to the human mind, except by relying on abstract, philosophical concepts, as is usually the case with such scrutinies, since the day I have discovered the wisdom of Kabbalah and dedicated myself to it, I have distanced myself from abstract philosophy and all its branches as the east from the west. Everything that I will write henceforth will be from a purely scientific perspective, in utter precision, and by means of simple recognition of practical, useful things.</strong> </p> <p> <strong>Clearly, such a proof cannot be found in any spiritual matter, but only in physical matters, set up for perception by the senses. Hence, we are permitted to use the third method, to an extent. It engages only in matters of the body, in all those deductions that have been proven by experiments, and which no one doubts. The rest of the concepts, which combine the reason of their method and other methods, are fo…`;

