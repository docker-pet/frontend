import { useMemo, useRef } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { retrieveLaunchParams, useSignal, isMiniAppDark } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { routes } from '@/navigation/routes.tsx';
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';
import { SnackbarMiddleware } from '@/middlewares/SnackbarMiddleware';
import { authConfirm } from '@/store/authConfirmStore';

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);
  const isFirstRender = useRef(true);

  if (isFirstRender.current) {
    isFirstRender.current = false;
    if (authConfirm.initConfirmPin) {
      location.hash = '#/2fa';
    }
  }

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
      style={{
        paddingBottom:
          'calc(90px + calc(var(--tg-viewport-content-safe-area-inset-bottom) + var(--tg-viewport-safe-area-inset-bottom)))',
      }}
    >
      <AuthMiddleware>
        <SnackbarMiddleware>
          <HashRouter>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} {...route} />
              ))}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </HashRouter>
        </SnackbarMiddleware>
      </AuthMiddleware>
    </AppRoot>
  );
}
