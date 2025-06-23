import { pb } from '@/pocketbase';
import { IUser, UserRole } from '@/types/user';
import { initData } from '@telegram-apps/sdk-react';
import { observable, runInAction } from 'mobx';
import { AuthRecord } from 'pocketbase';

const DEFAULT_GUEST_USER: IUser = {
  id: '',
  telegramId: 0,
  telegramUsername: '',
  name: '',
  language: '',
  role: UserRole.guest,
  premium: false,
  joinPending: false,
  avatar: '',
  outlineToken: '',
  outlineServer: '',

  collectionId: '',
  collectionName: '',
  created: '',
  updated: '',
  synced: '',
};

export const user = observable({
  initialized: false,
  failed: false,
  value: DEFAULT_GUEST_USER,
});

function setUser(data: IUser) {
  runInAction(() => {
    user.initialized = true;
    user.value = data;
  });
}

function setFailed() {
  runInAction(() => {
    user.initialized = true;
    user.failed = true;
  });
}

void (async () => {
  let initDataRaw = sessionStorage.getItem('tgInitData') || '';
  // Wait for init data to be available.
  while (true) {
    const rawInitData = initData.raw() || '';
    if (rawInitData !== '') {
      initDataRaw = rawInitData;
      break;
    }

    // Wait
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  try {
    if (initDataRaw === '' || location.pathname.startsWith('/auth')) {
      console.warn('Telegram Mini App init data is empty, user will be set as guest.');
      return;
    }

    const { token, record } = await pb.send<{ token: string; record: AuthRecord }>(
      '/api/telegram_miniapp/auth',
      {
        method: 'POST',
        body: JSON.stringify({ initData: initDataRaw }),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    sessionStorage.setItem('tgInitData', initDataRaw);
    pb.authStore.save(token, record);

    void pb.collection(record!.collectionId).subscribe<IUser>(record!.id, function (e) {
      if (e.action === 'delete') {
        setFailed();
      } else {
        setUser(e.record);
      }
    });

    setUser(record! as IUser);
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    setFailed();
  }
})();
