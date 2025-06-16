import { pb } from '@/pocketbase';
import { observable, runInAction } from 'mobx';
import { app } from './appStore';

export const authConfirm = observable({
  notification: null as string | null,
  opened: false,
});

export function openAuthConfirm() {
  toggleAuthConfirm(true);
}

export function closeAuthConfirm() {
  toggleAuthConfirm(false);
}

export function toggleAuthConfirm(value: boolean) {
  runInAction(() => {
    authConfirm.opened = value;
  });
}

export function usePinEditCallback() {
  return function (pin: number[]) {
    // To short
    if (pin.length < app.value?.authPinLength) {
      return;
    }

    // Send pin to server
    pb.send<{ type: string }>('/api/otp/confirm', {
      method: 'POST',
      headers: { 'X-Auth-Pin': pin.join('') },
    })
      .then((response) => {
        runInAction(() => {
          switch (response.type) {
            case 'confirmed':
              authConfirm.notification = 'confirmed';
              closeAuthConfirm();
              break;
            case 'not_found':
              authConfirm.notification = 'not_found';
              break;
            case 'unauthorized':
              authConfirm.notification = 'unauthorized';
              break;
          }
        });
      })
      .catch((error) => {
        console.error('Failed to confirm pin:', error);
        runInAction(() => {
          authConfirm.notification = 'auth-confirm.error';
        });
      });
  };
}
