import { onCreatePage } from './gatsby-node'

const actions = {
  createPage: jest.fn(),
  deletePage: jest.fn(),
}

const mockPageShortPath = {
  path: '/test',
  context: {},
}

const mockPageEmptyPath = {
  path: '/test//',
}

const mockPageLongPath = {
  path: '/long/test',
}

const mockPathExcluded = {
  path: '/404/test.html',
}

const mockPathHTML = {
  path: '/long/404.html',
}

const calledWithShort = {
  path: '/test',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'test',
          pathname: '/test',
        },
      ],
      location: '/test',
    },
  },
}

const calledWithEmptyPath = {
  path: '/test//',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'test',
          pathname: '/test',
        },
      ],
      location: '/test//',
    },
  },
}

const calledWithLong = {
  path: '/long/test',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'long',
          pathname: '/long',
        },
        {
          crumbLabel: 'test',
          pathname: '/long/test',
        },
      ],
      location: '/long/test',
    },
  },
}

const calledWithLongLabelUpdates = {
  path: '/long/test',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'LONG',
          pathname: '/long',
        },
        {
          crumbLabel: 'test',
          pathname: '/long/test',
        },
      ],
      location: '/long/test',
    },
  },
}

const calledWithTrailingSlashes = {
  path: '/long/test',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'long',
          pathname: '/long/',
        },
        {
          crumbLabel: 'test',
          pathname: '/long/test/',
        },
      ],
      location: '/long/test',
    },
  },
}

const calledWithTrailingSlashesLabelUpdates = {
  path: '/long/test',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'LONG',
          pathname: '/long/',
        },
        {
          crumbLabel: 'test',
          pathname: '/long/test/',
        },
      ],
      location: '/long/test',
    },
  },
}

const calledWithTrailingSlashesLabelUpdatesHTMLExt = {
  path: '/long/404.html',
  context: {
    breadcrumb: {
      crumbs: [
        {
          crumbLabel: 'Home',
          pathname: '/',
        },
        {
          crumbLabel: 'LONG',
          pathname: '/long/',
        },
        {
          crumbLabel: '404.html',
          pathname: '/long/404.html',
        },
      ],
      location: '/long/404.html',
    },
  },
}

afterEach(() => {
  actions.createPage.mockClear()
  actions.deletePage.mockClear()
})

describe('AutoGen crumbs: ', () => {
  it('should generate no crumbs, excluded path', () => {
    onCreatePage(
      { page: mockPathExcluded, actions },
      {
        useAutoGen: true,
        exclude: ['**/404/**', '**/*.html', '**/test.????', '**/*?m?', '**'],
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(0)
    expect(actions.createPage).toHaveBeenCalledTimes(0)
  })
  it('should generate autogen crumbs short path', () => {
    onCreatePage(
      { page: mockPageShortPath, actions },
      {
        useAutoGen: true,
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageShortPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(calledWithShort)
  })
  it('should generate autogen crumbs excluding empty crumb', () => {
    onCreatePage(
      { page: mockPageEmptyPath, actions },
      {
        useAutoGen: true,
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageEmptyPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(calledWithEmptyPath)
  })
  it('should generate autogen crumbs long path', () => {
    onCreatePage(
      { page: mockPageLongPath, actions },
      {
        useAutoGen: true,
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageLongPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(calledWithLong)
  })
  it('should generage crumbs using pathPrefix', () => {
    onCreatePage(
      { page: mockPageShortPath, actions, pathPrefix: '/blog' },
      {
        useAutoGen: true,
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageShortPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(calledWithShort)
  })
  it('should generate crumbs with update path crumb labels', () => {
    onCreatePage(
      { page: mockPageLongPath, actions },
      {
        useAutoGen: true,
        crumbLabelUpdates: [{ pathname: '/long', crumbLabel: 'LONG' }],
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageLongPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(calledWithLongLabelUpdates)
  })
  it('should not generate auto crumbs, no useAutoGen', () => {
    onCreatePage(
      {
        page: {
          path: '/test',
          context: {},
        },
        actions,
      },
      {},
    )
    expect(actions.deletePage).not.toHaveBeenCalled()
    expect(actions.createPage).not.toHaveBeenCalled()
  })
  it('should not generate auto crumbs, exlude', () => {
    onCreatePage({ page: { path: '/404', context: {} }, actions }, {})
    expect(actions.deletePage).not.toHaveBeenCalled()
    expect(actions.createPage).not.toHaveBeenCalled()
  })
  it('should generate crumbs with trailingSlashes', () => {
    onCreatePage(
      { page: mockPageLongPath, actions },
      {
        useAutoGen: true,
        trailingSlashes: true,
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageLongPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(calledWithTrailingSlashes)
  })
  it('should generate crumbs with trailingSlashes and label updates', () => {
    onCreatePage(
      { page: mockPageLongPath, actions },
      {
        useAutoGen: true,
        trailingSlashes: true,
        crumbLabelUpdates: [{ pathname: '/long', crumbLabel: 'LONG' }],
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPageLongPath)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(
      calledWithTrailingSlashesLabelUpdates,
    )
  })
  it('should generate crumbs with trailingSlashes, no trailing slash on html extension', () => {
    onCreatePage(
      { page: mockPathHTML, actions },
      {
        useAutoGen: true,
        trailingSlashes: true,
        crumbLabelUpdates: [{ pathname: '/long', crumbLabel: 'LONG' }],
      },
    )
    expect(actions.deletePage).toHaveBeenCalledTimes(1)
    expect(actions.deletePage).toHaveBeenCalledWith(mockPathHTML)
    expect(actions.createPage).toHaveBeenCalledTimes(1)
    expect(actions.createPage).toHaveBeenCalledWith(
      calledWithTrailingSlashesLabelUpdatesHTMLExt,
    )
  })
})
