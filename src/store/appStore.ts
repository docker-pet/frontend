import { pb } from '@/pocketbase';
import { IApp } from '@/types/app';
import { observable, runInAction } from 'mobx';

export const app = observable({
  initialized: false,
  failed: false,
  value: null as unknown as IApp,
});

function setApp(data: IApp) {
  runInAction(() => {
    app.initialized = true;
    app.value = data;
  });
}

function setFailed() {
  runInAction(() => {
    app.initialized = true;
    app.failed = true;
  });
}

void (async () => {
  try {
    const record = await pb.collection('app').getFirstListItem<IApp>('');

    void pb.collection(record.collectionId).subscribe<IApp>(record.id, function (e) {
      if (e.action === 'delete') {
        setFailed();
      } else {
        setApp(e.record);
      }
    });

    setApp(record);
  } catch (error) {
    console.error('Failed to load app data:', error);
    setFailed();
  }
})();
