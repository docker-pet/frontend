import { authConfirm, clearNotification as clearAuthNotification } from '@/store/authConfirmStore';
import { outline, clearNotification as clearOutlineNotification } from '@/store/outlineStore';
import { FingerprintIcon, FlyingSaucerIcon, InfoIcon } from '@phosphor-icons/react';
import { Snackbar } from '@telegram-apps/telegram-ui';
import { toJS } from 'mobx';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function SnackbarMiddleware({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const [notification, setNotification] = useState('');
  const [Icon, setIcon] = useState(() => InfoIcon);
  const authNotification = toJS(authConfirm.notification);
  const outlineNotification = toJS(outline.notification);

  useEffect(() => {
    if (notification !== '') {
      return;
    }

    if (authNotification) {
      setNotification(t(`auth-confirm.notifications.${authNotification}`));
      setIcon(FingerprintIcon);
    } else if (outlineNotification) {
      setNotification(t(`outline.notifications.${outlineNotification}`));
      setIcon(FlyingSaucerIcon);
    }
  }, [notification, authNotification, outlineNotification]);

  function clear() {
    clearAuthNotification();
    clearOutlineNotification();
    setNotification('');
  }

  return (
    <>
      {children}

      {/* Notification */}
      {notification ? (
        <Snackbar before={<Icon size={32} />} description={notification} onClose={clear} />
      ) : null}
    </>
  );
}
