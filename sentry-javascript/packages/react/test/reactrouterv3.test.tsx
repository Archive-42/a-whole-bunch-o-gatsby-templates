import { render } from '@testing-library/react';
import * as React from 'react';
import { createMemoryHistory, createRoutes, IndexRoute, match, Route, Router } from 'react-router-3';

import { Match, reactRouterV3Instrumentation, Route as RouteType } from '../src/reactrouterv3';

// Have to manually set types because we are using package-alias
declare module 'react-router-3' {
  type History = { replace: (s: string) => void; push: (s: string) => void };
  export function createMemoryHistory(): History;
  export const Router: React.ComponentType<{ history: History }>;
  export const Route: React.ComponentType<{ path: string; component?: React.ComponentType<any> }>;
  export const IndexRoute: React.ComponentType<{ component: React.ComponentType<any> }>;
  export const match: Match;
  export const createRoutes: (routes: any) => RouteType[];
}

describe('React Router V3', () => {
  const routes = (
    <Route path="/" component={({ children }: { children: JSX.Element }) => <div>{children}</div>}>
      <IndexRoute component={() => <div>Home</div>} />
      <Route path="about" component={() => <div>About</div>} />
      <Route path="features" component={() => <div>Features</div>} />
      <Route
        path="users/:userid"
        component={({ params }: { params: Record<string, string> }) => <div>{params.userid}</div>}
      />
      <Route path="organizations/">
        <Route path=":orgid" component={() => <div>OrgId</div>} />
        <Route path=":orgid/v1/:teamid" component={() => <div>Team</div>} />
      </Route>
    </Route>
  );
  const history = createMemoryHistory();

  const instrumentationRoutes = createRoutes(routes);
  const instrumentation = reactRouterV3Instrumentation(history, instrumentationRoutes, match);

  it('starts a pageload transaction when instrumentation is started', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction);
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/',
      op: 'pageload',
      tags: { 'routing.instrumentation': 'react-router-v3' },
    });
  });

  it('does not start pageload transaction if option is false', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction, false);
    expect(mockStartTransaction).toHaveBeenCalledTimes(0);
  });

  it('starts a navigation transaction', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction);
    render(<Router history={history}>{routes}</Router>);

    history.push('/about');
    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/about',
      op: 'navigation',
      tags: { from: '/', 'routing.instrumentation': 'react-router-v3' },
    });

    history.push('/features');
    expect(mockStartTransaction).toHaveBeenCalledTimes(3);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/features',
      op: 'navigation',
      tags: { from: '/about', 'routing.instrumentation': 'react-router-v3' },
    });
  });

  it('does not start a transaction if option is false', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction, true, false);
    render(<Router history={history}>{routes}</Router>);
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);
  });

  it('only starts a navigation transaction on push', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction);
    render(<Router history={history}>{routes}</Router>);

    history.replace('hello');
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);
  });

  it('finishes a transaction on navigation', () => {
    const mockFinish = jest.fn();
    const mockStartTransaction = jest.fn().mockReturnValue({ finish: mockFinish });
    instrumentation(mockStartTransaction);
    render(<Router history={history}>{routes}</Router>);
    expect(mockStartTransaction).toHaveBeenCalledTimes(1);

    history.push('/features');
    expect(mockFinish).toHaveBeenCalledTimes(1);
    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
  });

  it('normalizes transaction names', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction);
    const { container } = render(<Router history={history}>{routes}</Router>);

    history.push('/users/123');
    expect(container.innerHTML).toContain('123');

    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/users/:userid',
      op: 'navigation',
      tags: { from: '/', 'routing.instrumentation': 'react-router-v3' },
    });
  });

  it('normalizes nested transaction names', () => {
    const mockStartTransaction = jest.fn();
    instrumentation(mockStartTransaction);
    const { container } = render(<Router history={history}>{routes}</Router>);

    history.push('/organizations/1234/v1/758');
    expect(container.innerHTML).toContain('Team');

    expect(mockStartTransaction).toHaveBeenCalledTimes(2);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/organizations/:orgid/v1/:teamid',
      op: 'navigation',
      tags: { from: '/', 'routing.instrumentation': 'react-router-v3' },
    });

    history.push('/organizations/543');
    expect(container.innerHTML).toContain('OrgId');

    expect(mockStartTransaction).toHaveBeenCalledTimes(3);
    expect(mockStartTransaction).toHaveBeenLastCalledWith({
      name: '/organizations/:orgid',
      op: 'navigation',
      tags: { from: '/organizations/:orgid/v1/:teamid', 'routing.instrumentation': 'react-router-v3' },
    });
  });
});
