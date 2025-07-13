import { pb } from '@/pocketbase';
import { action, observable, runInAction } from 'mobx';
import { app } from './appStore';

export const authConfirm = observable({
  notification: null as string | null,
  opened: false,
  initConfirmPin: null as number[] | null,
  pin: [] as number[],
});

export function setInitialConfirmPin(pin: number[] | null) {
  runInAction(() => {
    authConfirm.initConfirmPin = pin;
  });
}

export function openAuthConfirm() {
  toggleAuthConfirm(true);
}

export function closeAuthConfirm() {
  toggleAuthConfirm(false);
}

export function clearNotification() {
  runInAction(() => {
    authConfirm.notification = null;
  });
}

export function toggleAuthConfirm(value: boolean) {
  runInAction(() => {
    authConfirm.opened = value;
  });
}

const showNotification = action((type: string) => {
  authConfirm.pin = [];
  switch (type) {
    case 'confirmed':
      authConfirm.notification = 'confirmed';
      closeAuthConfirm();
      break;
    case 'not_found':
      authConfirm.notification = 'not_found';
      break;
    case 'unauthorized': // TODO: remove
      authConfirm.notification = 'unauthorized';
      break;
    default:
      authConfirm.notification = 'catch';
  }
});

export function setPin(pin: number[]) {
  runInAction(() => {
    authConfirm.pin = pin;
  });

  // To short
  if (pin.length < app.value?.authPinLength) {
    return;
  }

  // Send pin to server
  pb.send<{ notification: string }>('/api/otp/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: pin.join(''),
    }),
  })
    .then((response) => {
      showNotification(response.notification);
    })
    .catch((error) => {
      console.error('Failed to confirm pin:', error);
      showNotification('catch');
    });
}

export function usePin(): [number[], (pin: number[]) => void] {
  return [authConfirm.pin, setPin];
}
