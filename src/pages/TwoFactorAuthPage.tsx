import { useEffect, useRef, useState, type FC } from 'react';

import { Page } from '@/components/Page.tsx';
import {
  IconButton,
  PinInput,
  RootRenderer,
} from '@telegram-apps/telegram-ui';
import { useTranslation } from 'react-i18next';
import {
  authConfirm,
  closeAuthConfirm,
  openAuthConfirm,
  setInitialConfirmPin,
  usePin,
} from '@/store/authConfirmStore';
import { app } from '@/store/appStore';
import { classNames } from '@/css/classnames';
import { QrCodeIcon, XCircleIcon } from '@phosphor-icons/react';

import './TwoFactorAuthPage.css';
import { useNavigate } from 'react-router-dom';
import { popup, qrScanner } from '@telegram-apps/sdk-react';
import { parseAuthLink } from '@/helpers/authQr';
import { toJS } from 'mobx';

export const TwoFactorAuthPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialized = useRef(false);
  const qrScannerSupported = qrScanner.isSupported();
  const [value, setValue] = usePin();
  const [isInitConfirm] = useState(null);
  const [pinRerender, setPinRerender] = useState(0);
  const blockAutoQRScannerOpen = useRef(false);

  const close = () => {
    void navigate(isInitConfirm ? '/' : '-1');
  };

  function confirmPin(pin: number[]) {
    blockAutoQRScannerOpen.current = true;
    void popup
      .show({
        title: `${pin ? pin.join('') : 'X'.repeat(app.value.authPinLength)}`,
        message:
          'Убедитесь, что PIN на экране и в приложении совпадают. Если всё верно — нажмите Подтвердить.',
        buttons: [
          { id: 'confirm', type: 'default', text: 'Подтвердить' },
          { id: 'close', type: 'destructive', text: 'Отклонить' },
        ],
      })
      .then((result) => {
        if (result === 'confirm') {
          setValue(pin);
          setPinRerender((prev) => prev + 1);
        }
      });
  }

  const openQRScanner = () => {
    if (!qrScannerSupported) {
      return;
    }

    void qrScanner.open({
      capture: (qr) => {
        const pin = parseAuthLink(qr);
        if (pin.length === 0) {
          return false;
        }

        setTimeout(() => confirmPin(pin), 100);
        return true;
      },
      text: 'Для добавления нового устройства отсканируйте QR-код, который вы видете на экране.',
    });
  };

  useEffect(() => {
    initialized.current = true;
    openAuthConfirm();

    if (authConfirm.initConfirmPin) {
      confirmPin(toJS(authConfirm.initConfirmPin));
      setInitialConfirmPin(null);
    } else if (blockAutoQRScannerOpen.current != true) {
      openQRScanner();
    }
  }, []);

  useEffect(() => {
    if (!authConfirm.opened && initialized.current) {
      close();
      void qrScanner.close();
    }
  }, [authConfirm.opened]);

  useEffect(() => {
    if (authConfirm.pin.length === 0) {
      setPinRerender((prev) => prev + 1);
    }
  }, [authConfirm.pin]);

  return (
    <Page back={!isInitConfirm}>
      {/* Pin input */}
      <PinInput
        key={pinRerender}
        label={t('auth-confirm.title')}
        pinCount={app.value.authPinLength}
        value={value}
        onChange={setValue}
      />

      {/* Close button */}
      <RootRenderer>
        {qrScannerSupported && (
          <IconButton
            mode="bezeled"
            size="l"
            onClick={openQRScanner}
            className={classNames('qrButton')}
          >
            <QrCodeIcon size={28} />
          </IconButton>
        )}

        <IconButton
          mode="plain"
          size="l"
          onClick={closeAuthConfirm}
          className={classNames('closeButton')}
        >
          <XCircleIcon size={28} />
        </IconButton>
      </RootRenderer>
    </Page>
  );
};
