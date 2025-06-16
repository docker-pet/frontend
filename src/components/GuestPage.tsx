import { useTranslation } from 'react-i18next';
import { AnimatedBanner, BannerType } from './AnimatedBanner';
import { Button } from '@telegram-apps/telegram-ui';
import { openTelegramLink } from '@telegram-apps/sdk-react';
import { app } from '@/store/appStore';
import { user } from '@/store/userStore';

export function GuestPage() {
  const { t } = useTranslation();
  const type = user.value.joinPending ? 'wait' : 'join';
  const banner = user.value.joinPending ? BannerType.chair : BannerType.loading;

  return (
    <AnimatedBanner
      type={banner}
      header={t(`guest-page.${type}.title`)}
      description={
        <>
          {t(`guest-page.${type}.description`)}
          <Button
            mode="bezeled"
            size="l"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => {
              openTelegramLink(app.value.telegramChannelInviteLink);
            }}
          >
            {t(`guest-page.${type}.button`)}
          </Button>
        </>
      }
    />
  );
}
