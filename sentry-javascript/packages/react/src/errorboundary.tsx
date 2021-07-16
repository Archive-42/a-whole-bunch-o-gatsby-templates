import { captureException, ReportDialogOptions, Scope, showReportDialog, withScope } from '@sentry/browser';
import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

export const UNKNOWN_COMPONENT = 'unknown';

export type FallbackRender = (errorData: {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
}) => React.ReactNode;

export type ErrorBoundaryProps = {
  /** If a Sentry report dialog should be rendered on error */
  showDialog?: boolean;
  /**
   * Options to be passed into the Sentry report dialog.
   * No-op if {@link showDialog} is false.
   */
  dialogOptions?: ReportDialogOptions;
  /**
   * A fallback component that gets rendered when the error boundary encounters an error.
   *
   * Can either provide a React Component, or a function that returns React Component as
   * a valid fallback prop. If a function is provided, the function will be called with
   * the error, the component stack, and an function that resets the error boundary on error.
   *
   */
  fallback?: React.ReactNode | FallbackRender;
  /** Called with the error boundary encounters an error */
  onError?(error: Error, componentStack: string, eventId: string): void;
  /** Called on componentDidMount() */
  onMount?(): void;
  /** Called if resetError() is called from the fallback render props function  */
  onReset?(error: Error | null, componentStack: string | null, eventId: string | null): void;
  /** Called on componentWillUnmount() */
  onUnmount?(error: Error | null, componentStack: string | null, eventId: string | null): void;
  /** Called before the error is captured by Sentry, allows for you to add tags or context using the scope */
  beforeCapture?(scope: Scope, error: Error | null, componentStack: string | null): void;
};

type ErrorBoundaryState = {
  componentStack: string | null;
  error: Error | null;
  eventId: string | null;
};

const INITIAL_STATE = {
  componentStack: null,
  error: null,
  eventId: null,
};

/**
 * A ErrorBoundary component that logs errors to Sentry.
 * Requires React >= 16
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = INITIAL_STATE;

  public componentDidCatch(error: Error, { componentStack }: React.ErrorInfo): void {
    const { beforeCapture, onError, showDialog, dialogOptions } = this.props;

    withScope(scope => {
      if (beforeCapture) {
        beforeCapture(scope, error, componentStack);
      }
      const eventId = captureException(error, { contexts: { react: { componentStack } } });
      if (onError) {
        onError(error, componentStack, eventId);
      }
      if (showDialog) {
        showReportDialog({ ...dialogOptions, eventId });
      }

      // componentDidCatch is used over getDerivedStateFromError
      // so that componentStack is accessible through state.
      this.setState({ error, componentStack, eventId });
    });
  }

  public componentDidMount(): void {
    const { onMount } = this.props;
    if (onMount) {
      onMount();
    }
  }

  public componentWillUnmount(): void {
    const { error, componentStack, eventId } = this.state;
    const { onUnmount } = this.props;
    if (onUnmount) {
      onUnmount(error, componentStack, eventId);
    }
  }

  public resetErrorBoundary: () => void = () => {
    const { onReset } = this.props;
    const { error, componentStack, eventId } = this.state;
    if (onReset) {
      onReset(error, componentStack, eventId);
    }
    this.setState(INITIAL_STATE);
  };

  public render(): React.ReactNode {
    const { fallback } = this.props;
    const { error, componentStack, eventId } = this.state;

    if (error) {
      if (React.isValidElement(fallback)) {
        return fallback;
      }
      if (typeof fallback === 'function') {
        return fallback({ error, componentStack, resetError: this.resetErrorBoundary, eventId }) as FallbackRender;
      }

      // Fail gracefully if no fallback provided
      return null;
    }

    return this.props.children;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorBoundary<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryOptions: ErrorBoundaryProps,
): React.FC<P> {
  const componentDisplayName = WrappedComponent.displayName || WrappedComponent.name || UNKNOWN_COMPONENT;

  const Wrapped: React.FC<P> = (props: P) => (
    <ErrorBoundary {...errorBoundaryOptions}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  Wrapped.displayName = `errorBoundary(${componentDisplayName})`;

  // Copy over static methods from Wrapped component to Profiler HOC
  // See: https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
  hoistNonReactStatics(Wrapped, WrappedComponent);
  return Wrapped;
}

export { ErrorBoundary, withErrorBoundary };
