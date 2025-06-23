// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root.tsx';
import { ErrorPage, ErrorPageType } from '@/components/ErrorPage.tsx';
import { init } from '@/init.ts';

import './index.css';

import { i18next } from '@/locale';

import './store/userStore.ts';
import './store/outlineStore.ts';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';
import { setInitialConfirmPin } from './store/authConfirmStore.ts';
import { parsetgWebAppStartParam } from './helpers/authQr.ts';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  // Telegram API init
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || '').includes('platformer_debug') || import.meta.env.DEV;

  // Launch with auth confirmation
  const launchAuthPin = parsetgWebAppStartParam(launchParams.tgWebAppStartParam || '');
  if (launchAuthPin.length > 0) {
    setInitialConfirmPin(launchAuthPin);
  }

  // Initialize i18n
  await i18next;

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  });

  void root.render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
} catch (e) {
  console.error('Failed to initialize the application:', e);
  root.render(<ErrorPage type={ErrorPageType.unsupported} />);
}
