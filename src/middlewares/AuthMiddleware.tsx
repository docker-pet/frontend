import { ErrorPage, ErrorPageType } from '@/components/ErrorPage';
import { user } from '@/store/userStore';
import { PropsWithChildren } from 'react';
import { AnimatedBanner, BannerType } from '@/components/AnimatedBanner';
import { GuestPage } from '@/components/GuestPage';
import { app } from '@/store/appStore';
import { UserRole } from '@/types/user';

export function AuthMiddleware({ children }: PropsWithChildren) {
  // In progress
  if (!app.initialized || !user.initialized) {
    return <AnimatedBanner type={BannerType.loading} />;
  }

  // Init data is not available
  if (app.failed) {
    return <ErrorPage type={ErrorPageType.unsupported} />;
  }

  // Unauthorized
  if (user.failed) {
    return <ErrorPage type={ErrorPageType.unauthorized} />;
  }

  // Guest user
  if (user.value.role === UserRole.guest) {
    return <GuestPage />;
  }

  return <>{children}</>;
}
