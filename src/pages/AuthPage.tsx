import { ReactNode, useEffect, useState, type FC } from 'react';

import { app } from '@/store/appStore';
import { useTranslation } from 'react-i18next';
import { otpAuth, useOtpAuth } from '@/store/otpAuthStore';
import { AnimatedBanner, BannerType } from '@/components/AnimatedBanner';
import { ErrorPage, ErrorPageType } from '@/components/ErrorPage';
import { LargeTitle, Text } from '@telegram-apps/telegram-ui';
import { deviceName } from '@/useragent';
import { QRCodeSVG } from 'qrcode.react';
import { classNames } from '@/css/classnames';

import './AuthPage.css';
import { isMobile } from 'react-device-detect';
import { generateAuthLink } from '@/helpers/authQr';

export const AuthPage: FC = () => {
  const { t } = useTranslation();
  const [pinLink, setPinLink] = useState('');
  const pin = getPinCode();

  // QR Code
  useEffect(() => {
    if (isMobile || !pin || !app.initialized) {
      return;
    }
    const pinLink = generateAuthLink(app.value.botUsername, pin);
    setPinLink(pinLink);
  }, [pin]);

  useOtpAuth();

  if (otpAuth.failed) {
    return <ErrorPage type={ErrorPageType.unsupported} />;
  }

  // Enter pin
  let description: ReactNode = '';
  if (pin) {
    description = (
      <>
        <p>{t('auth-page.description.default')}</p>
        <LargeTitle caps plain weight="1">
          {pin}
        </LargeTitle>
      </>
    );
  }

  // Authorized
  if (otpAuth.success) {
    description = <p>{t('auth-page.description.success')}</p>;
  }

  return (
    <AnimatedBanner
      type={otpAuth.success ? BannerType.chair : BannerType.loading}
      header={t('auth-page.title')}
      description={
        <>
          {description}
          <br />
          <Text weight="3">{deviceName}</Text>
          <br />
          {pinLink && !otpAuth.success && (
            <div className={classNames('qrContainer')}>
              <QRCodeSVG value={pinLink} marginSize={2} size={320} />
            </div>
          )}
        </>
      }
    />
  );
};

function getPinCode() {
  if (!app.initialized || otpAuth.success) {
    return '';
  }

  return otpAuth.pinCode ? otpAuth.pinCode : 'X'.repeat(app.value.authPinLength);
}
