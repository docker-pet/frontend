import { useLocation, useNavigate } from 'react-router-dom';
import { hideBackButton, onBackButtonClick, showBackButton } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { GhostIcon, FlyingSaucerIcon, FingerprintIcon, StarIcon } from '@phosphor-icons/react';
import { user } from '@/store/userStore';

export function Page({
  children,
  back = true,
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean;
}>) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const premium = user.value.premium;

  useEffect(() => {
    if (back) {
      showBackButton();
      return onBackButtonClick(() => {
        void navigate(-1);
      });
    }
    hideBackButton();
  }, [back]);

  const activeTab = useMemo(() => {
    if (pathname.startsWith('/2fa')) {
      return '2fa';
    } else if (pathname.startsWith('/premium') && !premium) {
      return 'premium';
    } else if (pathname.startsWith('/vpn') && premium) {
      return 'vpn';
    }

    return 'account';
  }, [pathname]);

  return (
    <>
      {children}
      <Tabbar
        style={{
          paddingBottom:
            'calc(var(--tg-viewport-content-safe-area-inset-bottom) + var(--tg-viewport-safe-area-inset-bottom))',
          display: activeTab === '2fa' ? 'none' : undefined,
        }}
      >
        <Tabbar.Item
          text="Сервисы"
          selected={activeTab === 'account'}
          onClick={() => {
            void navigate('/');
          }}
        >
          <GhostIcon size={28} weight="fill" />
        </Tabbar.Item>
        <Tabbar.Item
          text="2FA"
          selected={activeTab === '2fa'}
          onClick={() => {
            void navigate('/2fa');
          }}
        >
          <FingerprintIcon size={28} />
        </Tabbar.Item>

        {!premium ? (
          <Tabbar.Item
            text="Premium"
            selected={activeTab === 'premium'}
            onClick={() => {
              void navigate('/premium');
            }}
          >
            <StarIcon size={28} />
          </Tabbar.Item>
        ) : (
          <Tabbar.Item
            text="VPN"
            selected={activeTab === 'vpn'}
            onClick={() => {
              void navigate('/vpn');
            }}
          >
            <FlyingSaucerIcon size={28} weight="fill" />
          </Tabbar.Item>
        )}
      </Tabbar>
    </>
  );
}
