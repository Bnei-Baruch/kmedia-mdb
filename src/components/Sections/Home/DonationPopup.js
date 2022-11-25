import React, { useContext, useState } from 'react'
import { Button, Grid, Header, Icon, Image, Modal } from 'semantic-ui-react'
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import PropTypes from 'prop-types';
import { getQuery } from '../../../helpers/url';
import { assetUrl } from '../../../helpers/Api';
import banner from '../../../images/DonationBanner.jpg'
import clsx from 'clsx';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

function DonationPopup({ t, language, location }) {
  const shouldOpen = () => {
    const query    = getQuery(location);
    if (!!query.showPopup)
      return true;
    const d = new Date();
    const firstWeek = d.getDate();
    const theDay = d.getDay();
    const popupCountKey = `showDonationPopup_${d.toISOString().split('T')[0]}`;
    const popupCount = parseInt(localStorage.getItem(popupCountKey) ?? 0);
    if (popupCount > 1)
      return false;
    // First Sunday and Saturday of the week
    if (firstWeek <= 7 && (theDay == 0 || theDay == 6)) {
      localStorage.setItem(popupCountKey, (popupCount + 1).toString());
      return true;
    }

    return false;
  }

  const [open, setOpen] = React.useState(shouldOpen())
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const isRTL = isLanguageRtl(language);

  const { linkLang, utmTerm } = getDonateLinkDetails(language);
  const link = `https://www.kab1.com/${linkLang}?utm_source=kabbalah_media&utm_medium=button&utm_campaign=donations&utm_id=donations&utm_term=${utmTerm}&utm_content=header_button_donate`;


  const getContent = () => {
    switch (language) {
      case LANG_HEBREW:
        return <div dir="rtl">
          <p>חברים וחברות יקרים,</p>
          <p>רגע לפני שאתם גוללים הלאה ונהנים מהתכנים המקוריים באתר, אנחנו רוצים להזמין אתכם להיות שותפים שלנו במפעל
            ההפצה של עמותת &quot;בני ברוך &ndash; קבלה לעם&quot;.</p>
          <p>עד היום הפצנו בכל העולם כמויות חסרות תקדים של חומר ערכי וייחודי, והכול בזכותכם, אלפי מתנדבים ומתנדבות
            נאמנים.</p>
          <p>אבל זה לא מספיק. מיום ליום העולם נקלע למשבר חריף יותר בכל תחומי החיים, והוא זקוק לתכנים שרק הארגון שלנו
            מסוגל לספק; תכנים המסבירים את חשיבות הקשר בין בני אדם ומקרבים אותם לפתרון כל המשברים.</p>
          <p>לכן עכשיו, יותר מתמיד, אנחנו מזמינים אתכם לתרום כספית ולהשתתף בהגברת הפצת התכנים שלנו לאנושות.&nbsp;</p>
          <p>כך יכול כל אחד ואחת מאיתנו להגשים את חלום המקובלים להפיץ את חכמת הקבלה ברבים ולהזרים אור ביטחון לעולם, כמו
            שכתב הרב המקובל יהודה אשלג, &quot;בעל הסולם&quot;: &quot;אך ורק בהתפשטות חכמת הקבלה נזכה לגאולה
            השלמה&quot;.</p>
          <p>בהזדמנות זו אנחנו מודים לכל החברים והחברות שתרמו ותורמים בקביעות, ומודים מראש לכל המצטרפים החדשים על
            תרומתכם החשובה להפצת חכמת הקבלה.</p>
          <p><b>הנהלת עמותת &quot;בני ברוך - קבלה לעם&quot;</b></p>
        </div>;
      case LANG_RUSSIAN:
        return <div>
          <p>Дорогие товарищи и подруги!</p>
          <p>Перед тем, как вы пройдете дальше и насладитесь оригинальным контентом на сайте, мы хотели бы пригласить вас стать нашими партнерами в предприятии по распространению ассоциации &laquo;Бней Барух - лаАм&raquo;.</p>
          <p>На сегодняшний день мы распространили беспрецедентное количество ценного и уникального материала по всему миру, и все это благодаря вам, тысячам преданных волонтеров.</p>
          <p>Но этого недостаточно. День ото дня мир впадает во все более острый кризис во всех сферах жизни, и ему необходимы материалы, которые может предоставить только наша организация &minus; контент, объясняющий важность отношений между людьми и приближающий их к разрешению всех кризисов.</p>
          <p>Вот почему сейчас, более чем когда-либо, мы приглашаем вас делать финансовые пожертвования и участвовать в расширении распространения нашего контента среди всего человечества.</p>
          <p>Таким образом, каждый из нас поможет осуществить мечту каббалистов по распространению каббалистической мудрости в массы и привнести в мир высший свет и безопасность. Как писал каббалист Иегуда Ашлаг, Бааль Сулам: &laquo;Только распространяя мудрость науки каббала, мы удостоимся полного избавления&raquo;.</p>
          <p>Пользуясь случаем, мы благодарим всех товарищей и подруг, которые вносили и вносят регулярные пожертвования, и заранее благодарим всех новых участников за ваш важный вклад в распространение науки каббала.</p>
          <p><b>Руководство ассоциации &quot;Бней Барух - лаАм&quot;</b></p>
        </div>;
      case LANG_SPANISH:
        return <div>
          <p>Queridos amigos y amigas,</p>
          <p>Justo antes de continuar y disfrutar del contenido original del sitio, nos gustar&iacute;a invitarles a convertirse en nuestros socios y socias en la f&aacute;brica de distribuci&oacute;n de la Asociaci&oacute;n Bnei Baruj.</p>
          <p>Hasta la fecha, hemos distribuido cantidades sin precedentes de material valioso y &uacute;nico en todo el mundo, y todo gracias a ustedes, miles de fieles voluntarios.</p>
          <p>Pero no es suficiente. D&iacute;a a d&iacute;a el mundo cae en una crisis m&aacute;s aguda en todos los &aacute;mbitos de la vida, y necesita contenidos que solo nuestra organizaci&oacute;n puede brindar; contenidos que explican la importancia de la conexi&oacute;n entre las personas y las acerca a la soluci&oacute;n de todas las crisis.</p>
          <p>Por eso ahora, m&aacute;s que nunca, les invitamos a apoyar econ&oacute;micamente, participando as&iacute; en la expansi&oacute;n de la difusi&oacute;n de nuestros contenidos a la humanidad.</p>
          <p>De esta manera, todos y cada uno de nosotros podemos cumplir el sue&ntilde;o de los cabalistas de difundir la sabidur&iacute;a de la Cabal&aacute; a las masas y esparcir una luz de seguridad en el mundo, tal como lo escribi&oacute; el cabalista Rab&iacute; Yehuda Ashlag (Baal HaSulam): &quot;S&oacute;lo a trav&eacute;s de la expansi&oacute;n de la sabidur&iacute;a de la Cabal&aacute; a las masas obtendremos la completa redenci&oacute;n&rdquo;.&nbsp;&nbsp;</p>
          <p>En esta ocasi&oacute;n agradecemos a todos los amigos y amigas que alguna vez contribuyeron o que lo siguen haciendo regularmente, y agradecemos de antemano a todos los nuevos colaboradores por su importante aporte a la difusi&oacute;n de la sabidur&iacute;a de la Cabal&aacute;.</p>
          <p><b>La Direcci&oacute;n de la Asociaci&oacute;n Bnei Baruj</b></p>
        </div>;
      default:
        return <div>
          <p>Dear Friends,</p>
          <p>Before you scroll further and enjoy the original contents on the site, we would like to invite you to
            become
            our partners in the dissemination enterprise of the "Bnei Baruch - Kabbalah La'am" association.</p>
          <p>To date we have distributed unprecedented amounts of valuable and unique material all over the world, and
            it is
            all thanks to you, thousands of loyal volunteers.</p>
          <p>But it is not enough. Day by day the world falls into a more acute crisis in all areas of life, and it
            needs
            content that only our organization can provide; content that explains the importance of the connection
            between
            people and brings them closer to solving all crises.</p>
          <p>That is why now, more than ever, we invite you to donate financially and participate in increasing the
            dissemination of our content to humanity.</p>
          <p>In this way, each and every one of us can fulfill the Kabbalists' dream to spread the wisdom of Kabbalah to
            the
            masses and pour the light of confidence to the world, as the Baal HaSulam wrote: "Only by the expansion of
            the
            wisdom of Kabbalah will we be rewarded with complete redemption."</p>
          <p>On this occasion we wish to thank the friends who have donated and keep donating on a regular basis, and we
            thank in advance everyone who now joins in for your important contribution to the dissemination of the
            wisdom of
            Kabbalah.</p>
          <p><b>The management of the "Bnei Baruch - Kabbalah La'am" association.</b></p>
        </div>;
    }
  }

  return (
    <Modal
      closeIcon
      className=""
      className={clsx('donationPopup', {
        'rtl': isRTL
      })}
      centered={!isMobileDevice}
      size="large"
      dimmer="inverted"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      {/*<Header content='Donate'/>*/}
      <Modal.Content scrolling>
        <Grid>
          <Grid.Row columns={isMobileDevice ? 1 : 2}>
            <Grid.Column>
              <Image src={banner}
                href={link}
                as="a"
                target="_blank" />
            </Grid.Column>
            <Grid.Column>
              {getContent()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}
          href={link}
          className="donate-button"
          as="a"
          target="_blank"
          content={` ${ t('home.donate')  } `}
          icon={'heart'}
        />
      </Modal.Actions>
    </Modal>
  )
}

const getDonateLinkDetails = language => {
  switch (language) {
    case LANG_HEBREW:
      return { linkLang: '', utmTerm: 'heb' };
    case LANG_ENGLISH:
      return { linkLang: 'en', utmTerm: 'eng' };
    case LANG_RUSSIAN:
      return { linkLang: 'ru', utmTerm: 'rus' };
    case LANG_SPANISH:
      return { linkLang: 'es', utmTerm: 'spa' };
    default:
      return { linkLang: 'en', utmTerm: 'other_lang' };
  }
};

DonationPopup.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  location: shapes.HistoryLocation.isRequired,
};

export default DonationPopup
