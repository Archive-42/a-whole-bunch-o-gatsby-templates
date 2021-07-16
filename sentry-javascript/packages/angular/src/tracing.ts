import { AfterViewInit, Directive, Injectable, Input, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { getCurrentHub } from '@sentry/browser';
import { Span, Transaction, TransactionContext } from '@sentry/types';
import { logger, stripUrlQueryAndFragment, timestampWithMs } from '@sentry/utils';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

let instrumentationInitialized: boolean;
let stashedStartTransaction: (context: TransactionContext) => Transaction | undefined;
let stashedStartTransactionOnLocationChange: boolean;

/**
 * Creates routing instrumentation for Angular Router.
 */
export function routingInstrumentation(
  customStartTransaction: (context: TransactionContext) => Transaction | undefined,
  startTransactionOnPageLoad: boolean = true,
  startTransactionOnLocationChange: boolean = true,
): void {
  instrumentationInitialized = true;
  stashedStartTransaction = customStartTransaction;
  stashedStartTransactionOnLocationChange = startTransactionOnLocationChange;

  if (startTransactionOnPageLoad) {
    customStartTransaction({
      name: window.location.pathname,
      op: 'pageload',
    });
  }
}

export const instrumentAngularRouting = routingInstrumentation;

/**
 * Grabs active transaction off scope
 */
export function getActiveTransaction(): Transaction | undefined {
  const currentHub = getCurrentHub();

  if (currentHub) {
    const scope = currentHub.getScope();
    if (scope) {
      return scope.getTransaction();
    }
  }

  return undefined;
}

/**
 * Angular's Service responsible for hooking into Angular Router and tracking current navigation process.
 * Creates a new transaction for every route change and measures a duration of routing process.
 */
@Injectable({ providedIn: 'root' })
export class TraceService {
  public navStart$: Observable<Event> = this._router.events.pipe(
    filter(event => event instanceof NavigationStart),
    tap(event => {
      if (!instrumentationInitialized) {
        logger.error('Angular integration has tracing enabled, but Tracing integration is not configured');
        return;
      }

      const navigationEvent = event as NavigationStart;
      const strippedUrl = stripUrlQueryAndFragment(navigationEvent.url);
      let activeTransaction = getActiveTransaction();

      if (!activeTransaction && stashedStartTransactionOnLocationChange) {
        activeTransaction = stashedStartTransaction({
          name: strippedUrl,
          op: 'navigation',
        });
      }

      if (activeTransaction) {
        this._routingSpan = activeTransaction.startChild({
          description: `${navigationEvent.url}`,
          op: `angular.routing`,
          tags: {
            'routing.instrumentation': '@sentry/angular',
            url: strippedUrl,
            ...(navigationEvent.navigationTrigger && {
              navigationTrigger: navigationEvent.navigationTrigger,
            }),
          },
        });
      }
    }),
  );

  public navEnd$: Observable<Event> = this._router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    tap(() => {
      if (this._routingSpan) {
        this._routingSpan.finish();
        delete this._routingSpan;
      }
    }),
  );

  private _routingSpan?: Span;

  public constructor(private readonly _router: Router) {
    this.navStart$.subscribe();
    this.navEnd$.subscribe();
  }
}

const UNKNOWN_COMPONENT = 'unknown';

/**
 * A directive that can be used to capture initialization lifecycle of the whole component.
 */
@Directive({ selector: '[trace]' })
export class TraceDirective implements OnInit, AfterViewInit {
  @Input('trace') public componentName: string = UNKNOWN_COMPONENT;

  private _tracingSpan?: Span;

  /**
   * Implementation of OnInit lifecycle method
   * @inheritdoc
   */
  public ngOnInit(): void {
    const activeTransaction = getActiveTransaction();
    if (activeTransaction) {
      this._tracingSpan = activeTransaction.startChild({
        description: `<${this.componentName}>`,
        op: `angular.initialize`,
      });
    }
  }

  /**
   * Implementation of AfterViewInit lifecycle method
   * @inheritdoc
   */
  public ngAfterViewInit(): void {
    if (this._tracingSpan) {
      this._tracingSpan.finish();
    }
  }
}

/**
 * Decorator function that can be used to capture initialization lifecycle of the whole component.
 */
export function TraceClassDecorator(): ClassDecorator {
  let tracingSpan: Span;

  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return target => {
    const originalOnInit = target.prototype.ngOnInit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target.prototype.ngOnInit = function(...args: any[]): ReturnType<typeof originalOnInit> {
      const activeTransaction = getActiveTransaction();
      if (activeTransaction) {
        tracingSpan = activeTransaction.startChild({
          description: `<${target.name}>`,
          op: `angular.initialize`,
        });
      }
      if (originalOnInit) {
        return originalOnInit.apply(this, args);
      }
    };

    const originalAfterViewInit = target.prototype.ngAfterViewInit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target.prototype.ngAfterViewInit = function(...args: any[]): ReturnType<typeof originalAfterViewInit> {
      if (tracingSpan) {
        tracingSpan.finish();
      }
      if (originalAfterViewInit) {
        return originalAfterViewInit.apply(this, args);
      }
    };
  };
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */
}

/**
 * Decorator function that can be used to capture a single lifecycle methods of the component.
 */
export function TraceMethodDecorator(): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function(...args: any[]): ReturnType<typeof originalMethod> {
      const now = timestampWithMs();
      const activeTransaction = getActiveTransaction();
      if (activeTransaction) {
        activeTransaction.startChild({
          description: `<${target.constructor.name}>`,
          endTimestamp: now,
          op: `angular.${String(propertyKey)}`,
          startTimestamp: now,
        });
      }
      if (originalMethod) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return originalMethod.apply(this, args);
      }
    };
    return descriptor;
  };
}
