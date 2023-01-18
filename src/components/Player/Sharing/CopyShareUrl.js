import { Input, Button } from 'semantic-ui-react';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useShareUrl from '../hooks/useShareUrl';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { withTranslation } from 'react-i18next';

const CopyShareUrl = ({ t }) => {
  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const shareUrl = useShareUrl();

  return (
    <Input
      size="mini"
      fluid
      value={shareUrl}
      action
      dir={dir}
    >
      <input dir={'ltr'} />
      <CopyToClipboard text={shareUrl}>
        <Button
          content={t('buttons.copy')}
          size="small"
          compact
        />
      </CopyToClipboard>
    </Input>
  );
};

export default withTranslation()(CopyShareUrl);
