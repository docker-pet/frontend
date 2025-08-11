import { pb } from '@/pocketbase';
import { IOutlineServer } from '@/types/outline';
import { action, observable, reaction } from 'mobx';
import { user } from './userStore';

export const outline = observable({
  notification: null as string | null,
  initialized: false,
  failed: false,
  value: {} as Record<string, IOutlineServer>,
  length: 0,
});

const removeServer = action((id: string) => {
  if (!outline.value[id]) {
    return;
  }

  outline.length--;
  delete outline.value[id];
});

const updateServer = action((server: IOutlineServer) => {
  if (!outline.value[server.id]) {
    outline.length++;
  }
  outline.value[server.id] = server;
});

const setServers = action((servers: IOutlineServer[]) => {
  let length = 0;
  outline.value = servers.reduce(
    (acc, server) => {
      if (server.enabled === false) {
        return acc; // Skip disabled servers
      }
      length++;
      acc[server.id] = server;
      return acc;
    },
    {} as Record<string, IOutlineServer>,
  );
  outline.length = length;
});

const setNotification = action((notification: string | null) => {
  outline.notification = notification;
});

export const clearNotification = () => setNotification(null);

export const saveSettings = async (data: {
  outlineServer?: string,
  outlinePrefixEnabled?: boolean,
  outlineReverseServerEnabled?: boolean,
}) => {
  const { 
    outlineServer = user.value.outlineServer,
    outlinePrefixEnabled = user.value.outlinePrefixEnabled,
    outlineReverseServerEnabled = user.value.outlineReverseServerEnabled,
  } = data;

  void outlinePrefixEnabled;

  try {
    await pb.send<undefined>('/api/outline/settings', {
      method: 'POST',
      body: JSON.stringify({
        outlineServer,
        outlinePrefixEnabled: false,
        outlineReverseServerEnabled,
      }),
    });
    setNotification('success');
  } catch (error) {
    console.error('Failed to pick server:', error);
    setNotification('error');
  }
};

void (async () => {
  reaction(
    () => user.initialized,
    (value) => {
      if (value) {
        void init();
      }
    },
  );
})();

async function init() {
  try {
    const records = await pb.collection('outline_servers').getFullList<IOutlineServer>();
    const collectionName = pb.collection('outline_servers').collectionIdOrName;

    void pb.collection(collectionName).subscribe<IOutlineServer>('*', function (e) {
      if (e.action === 'delete') {
        removeServer(e.record.id);
      } else {
        if (e.record.enabled === false) {
          removeServer(e.record.id);
          return;
        }

        updateServer(e.record);
      }
    });

    setServers(records);
  } catch (error) {
    console.error('Failed to load outline servers data:', error);
  }
}
