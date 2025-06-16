import { useLocation, useNavigate } from 'react-router-dom';
import { hideBackButton, onBackButtonClick, showBackButton } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { GhostIcon, PopcornIcon, FlyingSaucerIcon } from '@phosphor-icons/react';

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
    if (pathname.startsWith('/lampa')) {
      return 'lampa';
    } else if (pathname.startsWith('/vpn')) {
      return 'vpn';
    }

    return 'account';
  }, [pathname]);

  return (
    <>
      {children}
      <Tabbar>
        <Tabbar.Item
          text="Аккаунт"
          selected={activeTab === 'account'}
          onClick={() => {
            void navigate('/');
          }}
        >
          <GhostIcon size={28} weight="fill" />
        </Tabbar.Item>
        <Tabbar.Item
          text="Кино"
          selected={activeTab === 'lampa'}
          onClick={() => {
            void navigate('/lampa');
          }}
        >
          <PopcornIcon size={28} weight="fill" />
        </Tabbar.Item>
        <Tabbar.Item
          text="VPN"
          selected={activeTab === 'vpn'}
          onClick={() => {
            void navigate('/vpn');
          }}
        >
          <FlyingSaucerIcon size={28} weight="fill" />
        </Tabbar.Item>
      </Tabbar>
    </>
  );
}
