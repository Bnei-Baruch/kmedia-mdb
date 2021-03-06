import { prepareScrollToSearch } from '../helper';

describe('highlighted text is too big', () => {

  const srchend   = null;
  const srchstart = 'האהבה, שאוהבים אמיתיים צריכים להרגיש שווים זה לזה.:$:3331';

  test('test_reproduce bug', () => {
    const result = prepareScrollToSearch(data, { srchstart, srchend }, true);
    expect(result).toEqual(expected);
  });
});

const data = (`"<div><h1 id="חוכמת-הקבלה-והפילוסופיה">
  <span dir="rtl">חוכמת הקבלה והפילוסופיה</span>
</h1>
<p>
  <strong><span dir="rtl">(ניתוח השוואתי בין קבלה לפילוסופיה)</span></strong>
</p>
<h2 id="הגדרת-הרוחניות">
  <span dir="rtl">הגדרת הרוחניות</span>
</h2>
<p>
  <span dir="rtl">לפילוסופיה יש טענה, שהגשמיות היא תולדה מהרוחניות, שהנשמה מולידה את הגוף. הבעיה בטענתה, שחייב להיות קשר בין רוחניות לגשמיות. לעומתה יש הטוענים, שלרוחניות אין כלל קשר לגשמיות. ואם כך, אין שום דרך ושיטה לאפשר מגע בין הרוחניות לגשמיות, שהרוחניות אי פעם תניע את הגשמיות.</span>
</p>
<p>
  <span dir="rtl">ואילו הקבלה, בדומה לכל מדע אחר טוענת, שלא ניתן כלל לדון, במה שאי אפשר לחוש ולחקור. ולכן, אפילו בשביל להגדיר רוחניות, צריך להבחין ולהבדיל את הרוחניות מהגשמיות, ולשם כך צריך קודם כל להרגיש ולהשיג רוחניות, יכולת שניקנֵת על ידי חוכמת הקבלה, אותה חוכמה שמאפשרת לאדם, להתחיל להרגיש את העולם העליון.</span>
</p>
<h2 id="מהותו-של-כוח-ההשגחה-העליון-הבורא">
  <span dir="rtl">מהותו של כוח ההשגחה העליון (הבורא)</span>
</h2>
<p>
  <span dir="rtl">במהות הכוח העליון עצמו, הקבלה לא עוסקת, וגם לא בהוכחת החוקים שכלולים בו, משום שמעצם הגדרתה כמדע המבוסס על ניסוי, היא אינה מדברת על מה שאין לה תפיסה והשגה בו, ואפילו לא על שלילת ההשגה. כי הגדרת השלילה, אין ערכה פחות מהגדרת הקיום, כי אם רואים איזו מהות מרחוק, ומזהים בה את כל המרכיבים הנעדרים ממנה, כלומר, מה שאינו קיים בה, הרי גם הוא נחשב לעדות ולהכרה במידת מה. משום שאם דבר רחוק באמת מן העין, אי אפשר לזהות מה שנעדר ממנו.</span>
</p>
<p>
  <span dir="rtl">ולכן יש בחוכמת הקבלה עיקרון בסיסי, שאומר: <strong>"כל מה שלא נשיג, לא נוכל להגדירו בשם ומילה"</strong>. "שם" הכוונה, לתחילתה של השגה כלשהי. והאור העליון, שהוא הרגשה של כוח ההשגחה העליון ושל פעולותיו, שאותו משיגים בתוך הכלי של הנשמה, כולו ערוך במדע הקבלה בפרטי פרטים ובדקויות הניתוח והניסוי, לא פחות מכל ההשגות הגשמיות.</span>
</p>
<h2 id="רוחניות-אינה-כוח-שמלובש-בגוף">
  <span dir="rtl">רוחניות אינה כוח שמלובש בגוף</span>
</h2>
<p>
  <span dir="rtl">רוחניות מוגדרת בקבלה, ככוח בלבד, שאין לו קשר לזמן, למרחב ולחומר. כוח שאינו מלובש בגוף. כוח ללא גוף.</span>
</p>
<h2 id="כלי-רוחני-נקרא-כוח">
  <span dir="rtl">כלי רוחני נקרא "כוח"</span>
</h2>
<p>
  <span dir="rtl">כשמדובר על כוח ברוחניות, אין הכוונה לאור הרוחני עצמו, משום שהאור עצמו נמצא מחוץ לכלי, מחוץ לחוש ולהשגה, ולכן הוא בלתי מושג (הוא נובע ממהותו של הבורא ושווה למהות הבורא). כלומר, את האור הרוחני אין ביכולתנו להבין ולהשיג, כדי להגדיר אותו בשם, מפני שהשם "אור" מושאל ואינו אמיתי. לפיכך כאשר אומרים: "כוח ללא גוף", הכוונה היא לכלי הרוחני.</span>
</p>
<p>
  <span dir="rtl">ובקבלה הגדרה של אורות, לא מדברת על מהותם, אלא על התפעלות הכלי, תגובותיו, מהרשימות שהותיר בתוכו, המפגש עם האור.</span>
</p>
<h2 id="אור-וכלי">
  <span dir="rtl">אור וכלי</span>
</h2>
<p>
  <span dir="rtl">אור אפשר להשיג. כלומר, התפעלות של הכלי. והשגה כזאת נקראת "חומר וצורה יחד", כי ההתפעלות היא הצורה, והכוח הוא ה"חומר". אולם הרגשת האהבה, שנולדת כתוצאה מזה בתוך הכלי, מוגדרת כ"צורה ללא חומר". כלומר, אם מנתקים את האהבה מהמתנה, כאילו היא מעולם לא היתה מלובשת במתנה מוגדרת, ואינה יותר משם מופשט של "אהבת הכוח העליון המשגיח (הבורא)", אז היא מוגדרת כצורה. והעיסוק בה נקרא "קבלת הצורה". וזהו מחקר מוגדר, משום שרוח האהבה הזאת, היא הנשארת באמת בהשגה, כמושג הנפרד לגמרי מהמתנה, כלומר, כמהות האור.</span>
</p>
<h2 id="החומר-והצורה-בקבלה">
  <span dir="rtl">החומר והצורה בקבלה</span>
</h2>
<p>
  <span dir="rtl">אף על פי שהאהבה הזאת, היא תוצאה מהמתנה, מכל מקום היא חשובה לאין ערוך מהמתנה עצמה, משום שמעריכים אותה לפי גדלות הנותן, ולא לפי ערכה של המתנה. כלומר, דווקא לאהבה ולגילויי תשומת הלב של הנותן, יש ערך וחשיבות אינסופיים. ולכן האהבה היא דבר נפרד לחלוטין מהחומר, שהוא האור והמתנה, באופן שנשארת רק ההשגה של האהבה, והמתנה נשכחת לה ונמחקת מן הלב. ולפיכך החלק הזה של המדע נקרא "הצורה בחוכמת הקבלה", וזהו החלק החשוב ביותר בחוכמה.</span>
</p>
<h2 id="עולמות-אביע-אצילות-בריאה-יצירה-עשייה">
  <span dir="rtl">עולמות אבי"ע (אצילות, בריאה, יצירה, עשייה)</span>
</h2>
<p>
  <span dir="rtl">באהבה הזאת ניתן להבחין בארבע מדרגות, הדומות למדרגות האהבה באדם. בעת קבלת מתנה בפעם ראשונה, האדם עוד לא מוכן לאהוב את נותן המתנה, בפרט אם נותן המתנה הינו אישיות חשובה, שהוא אינו משתווה אליה. אבל ככל שמתרבות המתנות, והן מתמידות ובאות, מרגיש המקבל שגם מאותו איש חשוב, אפשר לקבל כשווה, ולאהוב אותו באמת. בהתאם לחוק האהבה, שאוהבים אמיתיים צריכים להרגיש שווים זה לזה.</span>
</p>
<p>
  <span dir="rtl">בהתאם לכך אפשר להגדיר את ארבע מדרגות האהבה:</span>
</p>
<p>
  <span dir="rtl">מדרגה ראשונה - נתינת המתנה נקראת "עולם העשייה".</span>
</p>
<p>
  <span dir="rtl">מדרגה שניה - הגדלת כמות המתנות נקראת "עולם היצירה".</span>
</p>
<p>
  <span dir="rtl">מדרגה שלישית - גילוי מהות האהבה נקרא "עולם הבריאה". ובה מתחילה חקירת הצורה במדע הקבלה, משום שבמדרגה הזו נפרדת האהבה מהמתנה - האור מסתלק מעולם היצירה, והאהבה נשארת בלי אור, בלי המתנות שלה.</span>
</p>"`);

const expected = (`<div><div class="scroll-to-search" id="__scrollSearchToHere__"><h1 id="חוכמת-הקבלה-והפילוסופיה">  <span dir="rtl">חוכמת <em class="_h">ה</em>קבלה והפילוסופיה</span> </h1></div> <p>  <strong><span dir="rtl">(ניתוח השוואתי בין קבלה לפילוסופיה)</span></strong> </p> <h2 id="הגדרת-הרוחניות">  <span dir="rtl">הגדרת הרוחניות</span> </h2> <p>  <span dir="rtl">לפילוסופיה יש טענה, שהגשמיות היא תולדה מהרוחניות, שהנשמה מולידה את הגוף. הבעיה בטענתה, שחייב להיות קשר בין רוחניות לגשמיות. לעומתה יש הטוענים, שלרוחניות אין כלל קשר לגשמיות. ואם כך, אין שום דרך ושיטה לאפשר מגע בין הרוחניות לגשמיות, שהרוחניות אי פעם תניע את הגשמיות.</span> </p> <p>  <span dir="rtl">ואילו הקבלה, בדומה לכל מדע אחר טוענת, שלא ניתן כלל לדון, במה שאי אפשר לחוש ולחקור. ולכן, אפילו בשביל להגדיר רוחניות, צריך להבחין ולהבדיל את הרוחניות מהגשמיות, ולשם כך צריך קודם כל להרגיש ולהשיג רוחניות, יכולת שניקנֵת על ידי חוכמת הקבלה, אותה חוכמה שמאפשרת לאדם, להתחיל להרגיש את העולם העליון.</span> </p> <h2 id="מהותו-של-כוח-ההשגחה-העליון-הבורא">  <span dir="rtl">מהותו של כוח ההשגחה העליון (הבורא)</span> </h2> <p>  <span dir="rtl">במהות הכוח העליון עצמו, הקבלה לא עוסקת, וגם לא בהוכחת החוקים שכלולים בו, משום שמעצם הגדרתה כמדע המבוסס על ניסוי, היא אינה מדברת על מה שאין לה תפיסה והשגה בו, ואפילו לא על שלילת ההשגה. כי הגדרת השלילה, אין ערכה פחות מהגדרת הקיום, כי אם רואים איזו מהות מרחוק, ומזהים בה את כל המרכיבים הנעדרים ממנה, כלומר, מה שאינו קיים בה, הרי גם הוא נחשב לעדות ולהכרה במידת מה. משום שאם דבר רחוק באמת מן העין, אי אפשר לזהות מה שנעדר ממנו.</span> </p> <p>  <span dir="rtl">ולכן יש בחוכמת הקבלה עיקרון בסיסי, שאומר: <strong>"כל מה שלא נשיג, לא נוכל להגדירו בשם ומילה"</strong>. "שם" הכוונה, לתחילתה של השגה כלשהי. והאור העליון, שהוא הרגשה של כוח ההשגחה העליון ושל פעולותיו, שאותו משיגים בתוך הכלי של הנשמה, כולו ערוך במדע הקבלה בפרטי פרטים ובדקויות הניתוח והניסוי, לא פחות מכל ההשגות הגשמיות.</span> </p> <h2 id="רוחניות-אינה-כוח-שמלובש-בגוף">  <span dir="rtl">רוחניות אינה כוח שמלובש בגוף</span> </h2> <p>  <span dir="rtl">רוחניות מוגדרת בקבלה, ככוח בלבד, שאין לו קשר לזמן, למרחב ולחומר. כוח שאינו מלובש בגוף. כוח ללא גוף.</span> </p> <h2 id="כלי-רוחני-נקרא-כוח">  <span dir="rtl">כלי רוחני נקרא "כוח"</span> </h2> <p>  <span dir="rtl">כשמדובר על כוח ברוחניות, אין הכוונה לאור הרוחני עצמו, משום שהאור עצמו נמצא מחוץ לכלי, מחוץ לחוש ולהשגה, ולכן הוא בלתי מושג (הוא נובע ממהותו של הבורא ושווה למהות הבורא). כלומר, את האור הרוחני אין ביכולתנו להבין ולהשיג, כדי להגדיר אותו בשם, מפני שהשם "אור" מושאל ואינו אמיתי. לפיכך כאשר אומרים: "כוח ללא גוף", הכוונה היא לכלי הרוחני.</span> </p> <p>  <span dir="rtl">ובקבלה הגדרה של אורות, לא מדברת על מהותם, אלא על התפעלות הכלי, תגובותיו, מהרשימות שהותיר בתוכו, המפגש עם האור.</span> </p> <h2 id="אור-וכלי">  <span dir="rtl">אור וכלי</span> </h2> <p>  <span dir="rtl">אור אפשר להשיג. כלומר, התפעלות של הכלי. והשגה כזאת נקראת "חומר וצורה יחד", כי ההתפעלות היא הצורה, והכוח הוא ה"חומר". אולם הרגשת האהבה, שנולדת כתוצאה מזה בתוך הכלי, מוגדרת כ"צורה ללא חומר". כלומר, אם מנתקים את האהבה מהמתנה, כאילו היא מעולם לא היתה מלובשת במתנה מוגדרת, ואינה יותר משם מופשט של "אהבת הכוח העליון המשגיח (הבורא)", אז היא מוגדרת כצורה. והעיסוק בה נקרא "קבלת הצורה". וזהו מחקר מוגדר, משום שרוח האהבה הזאת, היא הנשארת באמת בהשגה, כמושג הנפרד לגמרי מהמתנה, כלומר, כמהות האור.</span> </p> <h2 id="החומר-והצורה-בקבלה">  <span dir="rtl">החומר והצורה בקבלה</span> </h2> <p>  <span dir="rtl">אף על פי שהאהבה הזאת, היא תוצאה מהמתנה, מכל מקום היא חשובה לאין ערוך מהמתנה עצמה, משום שמעריכים אותה לפי גדלות הנותן, ולא לפי ערכה של המתנה. כלומר, דווקא לאהבה ולגילויי תשומת הלב של הנותן, יש ערך וחשיבות אינסופיים. ולכן האהבה היא דבר נפרד לחלוטין מהחומר, שהוא האור והמתנה, באופן שנשארת רק ההשגה של האהבה, והמתנה נשכחת לה ונמחקת מן הלב. ולפיכך החלק הזה של המדע נקרא "הצורה בחוכמת הקבלה", וזהו החלק החשוב ביותר בחוכמה.</span> </p> <h2 id="עולמות-אביע-אצילות-בריאה-יצירה-עשייה">  <span dir="rtl">עולמות אבי"ע (אצילות, בריאה, יצירה, עשייה)</span> </h2> <p>  <span dir="rtl">באהבה הזאת ניתן להבחין בארבע מדרגות, הדומות למדרגות האהבה באדם. בעת קבלת מתנה בפעם ראשונה, האדם עוד לא מוכן לאהוב את נותן המתנה, בפרט אם נותן המתנה הינו אישיות חשובה, שהוא אינו משתווה אליה. אבל ככל שמתרבות המתנות, והן מתמידות ובאות, מרגיש המקבל שגם מאותו איש חשוב, אפשר לקבל כשווה, ולאהוב אותו באמת. בהתאם לחוק האהבה, שאוהבים אמיתיים צריכים להרגיש שווים זה לזה.</span> </p> <p>  <span dir="rtl">בהתאם לכך אפשר להגדיר את ארבע מדרגות האהבה:</span> </p> <p>  <span dir="rtl">מדרגה ראשונה - נתינת המתנה נקראת "עולם העשייה".</span> </p> <p>  <span dir="rtl">מדרגה שניה - הגדלת כמות המתנות נקראת "עולם היצירה".</span> </p> <p>  <span dir="rtl">מדרגה שלישית - גילוי מהות האהבה נקרא "עולם הבריאה". ובה מתחילה חקירת הצורה במדע הקבלה, משום שבמדרגה הזו נפרדת האהבה מהמתנה - האור מסתלק מעולם היצירה, והאהבה נשארת בלי אור, בלי המתנות שלה.</span> </p>`);
