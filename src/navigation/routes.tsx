import type { ComponentType, JSX } from 'react';

import { IndexPage } from '@/pages/IndexPage';
import { LampaPage } from '@/pages/LampaPage';
import { TwoFactorAuthPage } from '@/pages/TwoFactorAuthPage';
import { PremiumPage } from '@/pages/PremiumPage';
import { VpnPage } from '@/pages/VpnPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/lampa', Component: LampaPage, title: 'Lampa' },
  { path: '/premium', Component: PremiumPage, title: 'Premium' },
  { path: '/vpn', Component: VpnPage, title: 'Outline VPN' },
  { path: '/2fa', Component: TwoFactorAuthPage, title: 'Добавить новое устройство' },
];
