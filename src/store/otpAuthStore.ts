import { useAsyncInterval } from '@/helpers/useAsyncInterval';
import { pb } from '@/pocketbase';
import { deviceName } from '@/useragent';
import { observable, runInAction } from 'mobx';
import { useEffect } from 'react';
import { app } from './appStore';

export const otpAuth = observable({
  initialized: false,
  failed: false,
  success: false,
  pinCode: '',
});

export function useOtpAuth() {
  useEffect(() => {
    void fetchOtpAuth();
  }, []);

  const needToRedirect = otpAuth.success && app.initialized;
  useEffect(() => {
    if (!needToRedirect) {
      return;
    }

    try {
      const url = new URL(document.location.href);
      const redirectUrl = new URL(decodeURIComponent(url.searchParams.get('redirect') || ''));

      if (redirectUrl.protocol !== 'https:') {
        throw new Error('Redirect URL must use HTTPS protocol');
      }

      if (!`.${redirectUrl.hostname}`.endsWith(`.${app.value.appDomain}`)) {
        throw new Error('Redirect URL is not allowed');
      }

      location.href = redirectUrl.toString();
    } catch (error) {
      console.error('Failed to parse redirect URL:', error);
      return;
    }
  }, [needToRedirect]);

  useAsyncInterval(async () => {
    // Already authorized
    if (otpAuth.success) {
      return;
    }

    await fetchOtpAuth();
  }, 3400);
}

async function fetchOtpAuth() {
  try {
    const response = await pb.send<{ type: string; pin?: string }>('/api/otp/pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Name': encodeURIComponent(deviceName),
      },
    });

    runInAction(() => {
      switch (response.type) {
        case 'pin':
          otpAuth.initialized = true;
          otpAuth.failed = false;
          otpAuth.success = false;
          otpAuth.pinCode = response.pin || '';
          break;
        case 'confirmed':
        case 'already_authenticated':
          otpAuth.initialized = true;
          otpAuth.failed = false;
          otpAuth.success = true;
          otpAuth.pinCode = '';
          break;
        case 'failed_to_generate_pin':
        case 'invalid_device_name':
          throw new Error('Failed to fetch pin code: ' + response.type);
      }
    });
  } catch (error) {
    runInAction(() => {
      otpAuth.initialized = true;
      otpAuth.failed = true;
      otpAuth.success = false;
      otpAuth.pinCode = '';
    });
    console.error('Failed to fetch pin code:', error);
  }
}
