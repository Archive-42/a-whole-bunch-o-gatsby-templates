const { onCreateWebpackConfig, onCreateBabelConfig } = require(`../gatsby-node`)
const PreactRefreshPlugin = require(`@prefresh/webpack`)
const ReactRefreshWebpackPlugin = require(`@pmmmwh/react-refresh-webpack-plugin`)

describe(`gatsby-plugin-preact`, () => {
  it(`sets the correct webpack config in development`, () => {
    const getConfig = jest.fn(() => {
      return {
        entry: {
          commons: [],
        },
        plugins: [new ReactRefreshWebpackPlugin()],
      }
    })
    const actions = {
      setWebpackConfig: jest.fn(),
      setBabelPlugin: jest.fn(),
      replaceWebpackConfig: jest.fn(),
    }

    onCreateBabelConfig({ stage: `develop`, actions })
    onCreateBabelConfig({ stage: `develop-html`, actions })
    onCreateWebpackConfig({ stage: `develop`, actions, getConfig })
    onCreateWebpackConfig({ stage: `develop-html`, actions, getConfig })

    expect(actions.setWebpackConfig).toHaveBeenCalledTimes(2)
    expect(actions.setWebpackConfig).toHaveBeenCalledWith({
      plugins: expect.arrayContaining([expect.any(PreactRefreshPlugin)]),
      resolve: {
        alias: {
          react: `preact/compat`,
          "react-dom": `preact/compat`,
        },
      },
    })

    expect(getConfig).toHaveBeenCalledTimes(2)
    expect(actions.setBabelPlugin).toHaveBeenCalledTimes(1)
    expect(actions.setBabelPlugin).toHaveBeenCalledWith({
      name: `@prefresh/babel-plugin`,
      stage: `develop`,
    })
    expect(actions.replaceWebpackConfig).toHaveBeenCalledTimes(1)
    expect(actions.replaceWebpackConfig).toHaveBeenCalledWith({
      plugins: [],
      entry: {
        commons: [`@gatsbyjs/webpack-hot-middleware/client`],
      },
    })
  })

  it(`sets the correct webpack config in production`, () => {
    const FRAMEWORK_BUNDLES = [`react`, `react-dom`, `scheduler`, `prop-types`]
    const getConfig = jest.fn(() => {
      return {
        optimization: {
          splitChunks: {
            chunks: `all`,
            cacheGroups: {
              default: false,
              vendors: false,
              framework: {
                chunks: `all`,
                name: `framework`,
                // This regex ignores nested copies of framework libraries so they're bundled with their issuer.
                test: new RegExp(
                  `(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join(
                    `|`
                  )})[\\\\/]`
                ),
                priority: 40,
                // Don't let webpack eliminate this chunk (prevents this chunk from becoming a part of the commons chunk)
                enforce: true,
              },
            },
          },
        },
      }
    })
    const actions = {
      setWebpackConfig: jest.fn(),
      setBabelPlugin: jest.fn(),
      replaceWebpackConfig: jest.fn(),
    }

    onCreateBabelConfig({ stage: `build-javascript`, actions })
    onCreateBabelConfig({ stage: `build-html`, actions })
    onCreateWebpackConfig({ stage: `build-javascript`, actions, getConfig })
    onCreateWebpackConfig({ stage: `build-html`, actions, getConfig })

    expect(actions.setWebpackConfig).toHaveBeenCalledTimes(2)
    expect(actions.setWebpackConfig).toHaveBeenCalledWith({
      plugins: [],
      resolve: {
        alias: {
          react: `preact/compat`,
          "react-dom": `preact/compat`,
        },
      },
    })

    expect(getConfig).toHaveBeenCalledTimes(1)
    expect(actions.setBabelPlugin).toHaveBeenCalledTimes(0)
    expect(actions.replaceWebpackConfig).toHaveBeenCalledTimes(1)
    expect(actions.replaceWebpackConfig).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {
              "optimization": Object {
                "splitChunks": Object {
                  "cacheGroups": Object {
                    "default": false,
                    "framework": Object {
                      "chunks": "all",
                      "enforce": true,
                      "name": "framework",
                      "priority": 40,
                      "test": [Function],
                    },
                    "vendors": false,
                  },
                  "chunks": "all",
                },
              },
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `)
  })
})
