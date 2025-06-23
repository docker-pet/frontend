import { outline } from '@/store/outlineStore';
import { user } from '@/store/userStore';
import { useMemo } from 'react';

export function usePickedServer() {
  return useMemo(() => {
    const pickedServer = outline.value[user.value.outlineServer];
    if (!pickedServer || (pickedServer.premium && user.value.premium)) {
      return null;
    }

    return pickedServer;
  }, [user.value.outlineServer, outline.value]);
}
