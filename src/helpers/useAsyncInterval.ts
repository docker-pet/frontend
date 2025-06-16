import { useRef } from 'react';
import { useInterval } from 'react-use';

export function useAsyncInterval(asyncCallback: () => Promise<void>, delay: number | null) {
  const callbackRef = useRef(asyncCallback);

  callbackRef.current = asyncCallback;

  useInterval(() => {
    void callbackRef.current();
  }, delay);
}
