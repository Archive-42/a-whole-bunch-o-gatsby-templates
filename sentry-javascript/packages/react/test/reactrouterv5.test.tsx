import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history-4';
import * as React from 'react';
import { matchPath, Route, Router, Switch } from 'react-router-5';

import { reactRouterV5Instrumentation, withSentryRouting } from '../src';
import { RouteConfig } from '../src/reactrouter';

describe('React Router v5', () => {
  function createInstrumentation(_opts?: {
    startTransactionOnPageLoad?: boolean;
    startTransactionOnLocationChange?: boolean;
    routes?: RouteConfig[];
  }): [jest.Mock, any, { mockSetName: jest.Mock; mockFinish: jest.Mock }] {
    const options = {
      matchPath: _opts && _opts.routes !== undefined ? matchPath : undefined,
      routes: undefined,
      startTransactionOnLocationChange: true,
      startTransactionOnPageLoad: true,
      ..._opts,
    };
    const history = createMemoryHistory();
    const mockFinish = jest.fn();
    const mockSetName = jest.fn();
    const mockStartTransaction = jest.fn().mockReturnValue({ setName: mockSetName, finish: mockFinish });
    reactRouterV5Instrumentation(history, options.routes, options.matchPath)(
      mockStartTransaction,
      options.startTransactionOnPageLoad,
      options.startTransactionOnLocationChange,
    );
    return [mockStartTransaction, history, { mockSetName, mockFinish }];
  }

  it('starts a pageload transaction when instrumentation is started', () => {
    const [mockStartTransaction] = createInstrumentation();
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/',
      op: 'pageload',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
  });

  it('does not start pageload transaction if option is false', () => {
    const [mockStartTransaction] = createInstrumentation({ startTransactionOnPageLoad: false });
    expect(mockStartTransaction).toHaveBeenCalledTimes(0);
  });

  it('starts a navigation transaction', () => {
    const [mockStartTransaction, history] = createInstrumentation();
    render(
      <Router history={history}>
        <Switch>
          <Route path="/features" component={() => <div>Features</div>} />
          <Route path="/about" component={() => <div>About</div>} />
          <Route path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );

    history.push('/about');
    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/about',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });

    history.push('/features');
    expect(mockStartTransaction).toHaveBeenCalledTimes(3);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/features',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
  });

  it('does not start a transaction if option is false', () => {
    const [mockStartTransaction, history] = createInstrumentation({ startTransactionOnLocationChange: false });
    render(
      <Router history={history}>
        <Switch>
          <Route path="/features" component={() => <div>Features</div>} />
          <Route path="/about" component={() => <div>About</div>} />
          <Route path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);
  });

  it('only starts a navigation transaction on push', () => {
    const [mockStartTransaction, history] = createInstrumentation();
    render(
      <Router history={history}>
        <Switch>
          <Route path="/features" component={() => <div>Features</div>} />
          <Route path="/about" component={() => <div>About</div>} />
          <Route path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );

    history.replace('hello');
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);
  });

  it('finishes a transaction on navigation', () => {
    const [mockStartTransaction, history, { mockFinish }] = createInstrumentation();
    render(
      <Router history={history}>
        <Switch>
          <Route path="/features" component={() => <div>Features</div>} />
          <Route path="/about" component={() => <div>About</div>} />
          <Route path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);

    history.push('/features');
    expect(mockFinish).toHaveBeenCalledTimes(1);
    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
  });

  it('does not normalize transaction name ', () => {
    const [mockStartTransaction, history] = createInstrumentation();
    const { container } = render(
      <Router history={history}>
        <Switch>
          <Route path="/users/:userid" component={() => <div>UserId</div>} />
          <Route path="/users" component={() => <div>Users</div>} />
          <Route path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );

    history.push('/users/123');
    expect(container.innerHTML).toContain('UserId');

    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/users/123',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
  });

  it('normalizes transaction name with custom Route', () => {
    const [mockStartTransaction, history, { mockSetName }] = createInstrumentation();
    const SentryRoute = withSentryRouting(Route);
    const { container } = render(
      <Router history={history}>
        <Switch>
          <SentryRoute path="/users/:userid" component={() => <div>UserId</div>} />
          <SentryRoute path="/users" component={() => <div>Users</div>} />
          <SentryRoute path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );

    history.push('/users/123');
    expect(container.innerHTML).toContain('UserId');

    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/users/123',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
    expect(mockSetName).toHaveBeenCalledTimes(2);
    expect(mockSetName).toHaveBeenLastCalledWith('/users/:userid');
  });

  it('normalizes nested transaction names with custom Route', () => {
    const [mockStartTransaction, history, { mockSetName }] = createInstrumentation();
    const SentryRoute = withSentryRouting(Route);
    const { container } = render(
      <Router history={history}>
        <Switch>
          <SentryRoute path="/organizations/:orgid/v1/:teamid" component={() => <div>Team</div>} />
          <SentryRoute path="/organizations/:orgid" component={() => <div>OrgId</div>} />
          <SentryRoute path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );

    history.push('/organizations/1234/v1/758');
    expect(container.innerHTML).toContain('Team');

    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/organizations/1234/v1/758',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
    expect(mockSetName).toHaveBeenCalledTimes(2);
    expect(mockSetName).toHaveBeenLastCalledWith('/organizations/:orgid/v1/:teamid');

    history.push('/organizations/543');
    expect(container.innerHTML).toContain('OrgId');

    expect(mockStartTransaction).toHaveBeenCalledTimes(3);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/organizations/543',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
    expect(mockSetName).toHaveBeenCalledTimes(3);
    expect(mockSetName).toHaveBeenLastCalledWith('/organizations/:orgid');
  });

  it('matches with route object', () => {
    const routes: RouteConfig[] = [
      {
        path: '/organizations/:orgid/v1/:teamid',
      },
      { path: '/organizations/:orgid' },
      { path: '/' },
    ];
    const [mockStartTransaction, history] = createInstrumentation({ routes });
    render(
      <Router history={history}>
        <Switch>
          <Route path="/organizations/:orgid/v1/:teamid" component={() => <div>Team</div>} />
          <Route path="/organizations/:orgid" component={() => <div>OrgId</div>} />
          <Route path="/" component={() => <div>Home</div>} />
        </Switch>
      </Router>,
    );

    history.push('/organizations/1234/v1/758');
    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/organizations/:orgid/v1/:teamid',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });

    history.push('/organizations/1234');
    expect(mockStartTransaction).toHaveBeenCalledTimes(3);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/organizations/:orgid',
      op: 'navigation',
      tags: { 'routing.instrumentation': 'react-router-v5' },
    });
  });
});
