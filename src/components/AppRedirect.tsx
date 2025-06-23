import { useMedia } from 'react-use';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { isIOS, isMacOs } from 'react-device-detect';
import { RedirectPage } from '@/pages/RedirectPage';

export function AppRedirect() {
  const isDark = useMedia('(prefers-color-scheme: dark)');

  return (
    <AppRoot appearance={isDark ? 'dark' : 'light'} platform={isIOS || isMacOs ? 'ios' : 'base'}>
      <RedirectPage />
    </AppRoot>
  );
}
