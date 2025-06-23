// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import { RootRedirect } from '@/components/Root.tsx';
import { ErrorPage, ErrorPageType } from '@/components/ErrorPage.tsx';

import './index.css';

import { i18next } from '@/locale';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';
import { init } from './init.ts';
import { isMacOs } from 'react-device-detect';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  // Initialize i18n
  await i18next;

  // Configure all application dependencies.
  await init({
    debug: false,
    eruda: false,
    mockForMacOS: isMacOs,
  });

  void root.render(
    <StrictMode>
      <RootRedirect />
    </StrictMode>,
  );
} catch (e) {
  console.error('Failed to initialize the application:', e);
  root.render(<ErrorPage type={ErrorPageType.unsupported} />);
}
