import { useTranslation } from 'react-i18next';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { retrieveLaunchParams, isColorDark, isRGB } from '@telegram-apps/sdk-react';
import { useMemo } from 'react';
import { AnimatedBanner, BannerType } from './AnimatedBanner';

export enum ErrorPageType {
  'unsupported' = 'unsupported',
  'unauthorized' = 'unauthorized',
}

export function ErrorPage({ type }: { type: ErrorPageType }) {
  const { t } = useTranslation();

  const [platform, isDark] = useMemo(() => {
    try {
      const lp = retrieveLaunchParams();
      const { bg_color: bgColor } = lp.tgWebAppThemeParams;
      return [lp.tgWebAppPlatform, bgColor && isRGB(bgColor) ? isColorDark(bgColor) : false];
    } catch {
      return ['android', false];
    }
  }, []);

  const content = (
    <AnimatedBanner
      type={BannerType[type]}
      header={t(`error-page.${type}.title`)}
      description={t(`error-page.${type}.description`)}
    />
  );

  if (type === ErrorPageType.unsupported) {
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(platform) ? 'ios' : 'base'}
    >
      {content}
    </AppRoot>;
  }

  return content;
}
