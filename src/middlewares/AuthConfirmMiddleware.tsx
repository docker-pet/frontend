import { app } from '@/store/appStore';
import { authConfirm, clearNotification, closeAuthConfirm, usePinEditCallback } from '@/store/authConfirmStore';
import { FingerprintIcon, XCircleIcon } from '@phosphor-icons/react';
import { IconButton, PinInput, RootRenderer, Snackbar } from '@telegram-apps/telegram-ui';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/css/classnames.ts';

import './AuthConfirmMiddleware.css';

export function AuthConfirmMiddleware({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  const pinEditCallback = usePinEditCallback();

  return (
    <>
      {/* Dialog close */}
      {!authConfirm.opened && children}

      {/* Auth Dialog */}
      {authConfirm.opened && (
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
        </>
      )}

      {/* Notification */}
      {authConfirm.notification && (
        <Snackbar
          before={<FingerprintIcon size={32} />}
          description={t(`auth-confirm.notifications.${authConfirm.notification}`)}
          onClose={clearNotification}
        />
      )}
    </>
  )
}
