import { app } from '@/store/appStore';
import { authConfirm, closeAuthConfirm, usePinEditCallback } from '@/store/authConfirmStore';
import { WarningDiamondIcon, XCircleIcon } from '@phosphor-icons/react';
import { IconButton, PinInput, RootRenderer, Snackbar } from '@telegram-apps/telegram-ui';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/css/classnames.ts';

import './AuthConfirmMiddleware.css';

export function AuthConfirmMiddleware({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  const pinEditCallback = usePinEditCallback();

  const notification = (
    <Snackbar
      before={<WarningDiamondIcon size={32} />}
      description="Message returned to the list"
      onClose={console.log}
      // onClose={() => setIsUndoSnackbarShown(false)}
    >
      Message restored
    </Snackbar>
  );

  if (!authConfirm.opened) {
    return (
      <>
        {children}
        {notification}
      </>
    );
  }

  return (
    <>
      {/* Pin input */}
      <PinInput
        label={t('auth-confirm.title')}
        pinCount={app.value.authPinLength}
        onChange={pinEditCallback}
      />

      {/* Close button */}
      <RootRenderer>
        <IconButton
          mode="plain"
          size="l"
          onClick={closeAuthConfirm}
          className={classNames('closeButton')}
        >
          <XCircleIcon size={28} />
        </IconButton>
      </RootRenderer>

      {/* Notification */}
      {notification}
    </>
  );
}
