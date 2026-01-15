import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { DeviceInfoContext } from "../../helpers/app-contexts";
import { settingsGetUrlLangSelector } from "../../redux/selectors";

const LanguagesBtn = React.forwardRef(({ handlePopup }, ref) => {
  const urlLang = useSelector(settingsGetUrlLangSelector);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t } = useTranslation();

  return (
  <div onClick={handlePopup} ref={ref}>
    {isMobileDevice ? (
      <Icon size="big" name="language" className="no-margin" />
    ) : (
      <div className="language-trigger">
        {urlLang && <Icon name="unlink" />}
        {!urlLang && <Icon name="sliders horizontal" />}
        {t("languages.language")}
      </div>
    )}
  </div>
  );
});
export default LanguagesBtn;
