import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { AppRedirect } from './AppRedirect';
import { AppAuth } from './AppAuth';

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <App />
    </ErrorBoundary>
  );
}

export function RootAuth() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <AppAuth />
    </ErrorBoundary>
  );
}

export function RootRedirect() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <AppRedirect />
    </ErrorBoundary>
  );
}
