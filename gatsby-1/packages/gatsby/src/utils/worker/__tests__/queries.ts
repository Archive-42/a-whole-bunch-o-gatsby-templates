import "jest-extended"
import * as path from "path"
import fs from "fs-extra"
import type { watch as ChokidarWatchType } from "chokidar"
import { build } from "../../../schema"
import sourceNodesAndRemoveStaleNodes from "../../source-nodes"
import {
  savePartialStateToDisk,
  store,
  loadPartialStateFromDisk,
} from "../../../redux"
import { loadConfigAndPlugins } from "../../../bootstrap/load-config-and-plugins"
import {
  createTestWorker,
  describeWhenLMDB,
  GatsbyTestWorkerPool,
} from "./test-helpers"
import { getDataStore } from "../../../datastore"
import { IGroupedQueryIds } from "../../../services"
import { IGatsbyPage } from "../../../redux/types"
import { runQueriesInWorkersQueue } from "../pool"

let worker: GatsbyTestWorkerPool | undefined

// when we load config and run sourceNodes on "main process" we start file watchers
// because of default `gatsby-plugin-page-creator` which would prevent test process from
// exiting gracefully without forcing exit
// to prevent that we keep track of created watchers and close them after all tests are done
const mockWatchersToClose = new Set<ReturnType<typeof ChokidarWatchType>>()
jest.mock(`chokidar`, () => {
  const chokidar = jest.requireActual(`chokidar`)
  const originalChokidarWatch = chokidar.watch

  chokidar.watch = (
    ...args: Parameters<typeof ChokidarWatchType>
  ): ReturnType<typeof ChokidarWatchType> => {
    const watcher = originalChokidarWatch.call(chokidar, ...args)
    mockWatchersToClose.add(watcher)
    return watcher
  }

  return chokidar
})

const dummyKeys = `a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z`.split(
  `,`
)

function pagePlaceholders(key): any {
  return {
    path: `/${key}`,
    componentPath: `/${key}.js`,
    component: `/${key}.js`,
    internalComponentName: `Component/${key}/`,
    matchPath: undefined,
    componentChunkName: `component--${key}`,
    isCreatedByStatefulCreatePages: true,
    updatedAt: 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pluginCreator___NODE: key,
    pluginCreatorId: key,
    ownerNodeId: key,
  }
}

const dummyPages: Array<IGatsbyPage> = dummyKeys.map(name => {
  return {
    ...pagePlaceholders(name),
    query: `{ nodeTypeOne { number } }`,
    context: {},
  }
})

const dummyPageFoo = {
  ...pagePlaceholders(`foo`),
  query: `{ nodeTypeOne { number } }`,
  context: {},
}

const dummyPageBar = {
  ...pagePlaceholders(`bar`),
  query: `query($var: Boolean) { nodeTypeOne { default: fieldWithArg, fieldWithArg(isCool: true), withVar: fieldWithArg(isCool: $var) } }`,
  context: {
    var: true,
  },
}

const dummyStaticQuery = {
  id: `sq--q1`,
  name: `q1-name`,
  componentPath: `/static-query-component.js`,
  query: `{ nodeTypeOne { resolverField } }`,
  hash: `q1-hash`,
}

const pageQueryIds = [dummyPageFoo, dummyPageBar, ...dummyPages]

const queryIdsSmall: IGroupedQueryIds = {
  pageQueryIds: [dummyPageFoo, dummyPageBar],
  staticQueryIds: [dummyStaticQuery.id],
}

const queryIdsBig: IGroupedQueryIds = {
  pageQueryIds,
  staticQueryIds: [dummyStaticQuery.id],
}

describeWhenLMDB(`worker (queries)`, () => {
  beforeAll(async () => {
    store.dispatch({ type: `DELETE_CACHE` })
    const fileDir = path.join(process.cwd(), `.cache/worker`)
    await fs.emptyDir(fileDir)

    worker = createTestWorker()

    const siteDirectory = path.join(__dirname, `fixtures`, `sample-site`)
    await loadConfigAndPlugins({ siteDirectory })
    await Promise.all(worker.all.loadConfigAndPlugins({ siteDirectory }))
    await sourceNodesAndRemoveStaleNodes({ webhookBody: {} })
    await getDataStore().ready()

    await build({ parentSpan: {} })

    pageQueryIds.forEach(page => {
      store.dispatch({
        type: `CREATE_PAGE`,
        plugin: {
          id: `gatsby-plugin-test`,
          name: `gatsby-plugin-test`,
          version: `1.0.0`,
        },
        payload: {
          path: page.path,
          componentPath: page.componentPath,
          component: page.component,
        },
      })
    })

    savePartialStateToDisk([`inferenceMetadata`])

    pageQueryIds.forEach(page => {
      store.dispatch({
        type: `QUERY_EXTRACTED`,
        plugin: {
          id: `gatsby-plugin-test`,
          name: `gatsby-plugin-test`,
          version: `1.0.0`,
        },
        payload: {
          componentPath: page.componentPath,
          query: page.query,
        },
      })
    })

    store.dispatch({
      type: `REPLACE_STATIC_QUERY`,
      plugin: {
        id: `gatsby-plugin-test`,
        name: `gatsby-plugin-test`,
        version: `1.0.0`,
      },
      payload: dummyStaticQuery,
    })

    savePartialStateToDisk([`components`, `staticQueryComponents`])

    await Promise.all(worker.all.buildSchema())
    await worker.single.runQueries(queryIdsSmall)
  })

  afterAll(() => {
    if (worker) {
      worker.end()
      worker = undefined
    }
    for (const watcher of mockWatchersToClose) {
      watcher.close()
    }
  })

  it(`should save worker "queries" state to disk`, async () => {
    if (!worker) fail(`worker not defined`)

    await Promise.all(worker.all.saveQueries())
    // Pass "1" as workerId as the test only have one worker
    const result = loadPartialStateFromDisk([`queries`], `1`)

    expect(result).toMatchInlineSnapshot(`
      Object {
        "queries": Object {
          "byConnection": Map {},
          "byNode": Map {
            "ceb8e742-a2ce-5110-a560-94c93d1c71a5" => Set {
              "sq--q1",
              "/foo",
              "/bar",
            },
          },
          "deletedQueries": Set {},
          "dirtyQueriesListToEmitViaWebsocket": Array [],
          "queryNodes": Map {
            "sq--q1" => Set {
              "ceb8e742-a2ce-5110-a560-94c93d1c71a5",
            },
            "/foo" => Set {
              "ceb8e742-a2ce-5110-a560-94c93d1c71a5",
            },
            "/bar" => Set {
              "ceb8e742-a2ce-5110-a560-94c93d1c71a5",
            },
          },
          "trackedComponents": Map {},
          "trackedQueries": Map {
            "sq--q1" => Object {
              "dirty": 0,
              "running": 0,
            },
            "/foo" => Object {
              "dirty": 0,
              "running": 0,
            },
            "/bar" => Object {
              "dirty": 0,
              "running": 0,
            },
          },
        },
      }
    `)
  })

  it(`should execute static queries`, async () => {
    if (!worker) fail(`worker not defined`)
    const stateFromWorker = await worker.single.getState()

    const staticQueryResult = await fs.readJson(
      `${stateFromWorker.program.directory}/public/page-data/sq/d/${dummyStaticQuery.hash}.json`
    )

    expect(staticQueryResult).toStrictEqual({
      data: {
        nodeTypeOne: {
          resolverField: `Custom String`,
        },
      },
    })
  })

  it(`should execute page queries`, async () => {
    if (!worker) fail(`worker not defined`)
    const stateFromWorker = await worker.single.getState()

    const pageQueryResult = await fs.readJson(
      `${stateFromWorker.program.directory}/.cache/json/_foo.json`
    )

    expect(pageQueryResult.data).toStrictEqual({
      nodeTypeOne: {
        number: 123,
      },
    })
  })

  it(`should execute page queries with context variables`, async () => {
    if (!worker) fail(`worker not defined`)
    const stateFromWorker = await worker.single.getState()

    const pageQueryResult = await fs.readJson(
      `${stateFromWorker.program.directory}/.cache/json/_bar.json`
    )

    expect(pageQueryResult.data).toStrictEqual({
      nodeTypeOne: {
        default: `You are not cool`,
        fieldWithArg: `You are cool`,
        withVar: `You are cool`,
      },
    })
  })

  it(`should chunk work in runQueriesInWorkersQueue`, async () => {
    if (!worker) fail(`worker not defined`)
    const spy = jest.spyOn(worker.single, `runQueries`)

    // @ts-ignore - worker is defined
    await runQueriesInWorkersQueue(worker, queryIdsBig, 10)
    const stateFromWorker = await worker.single.getState()

    // Called the complete ABC so we can test _a
    const pageQueryResultA = await fs.readJson(
      `${stateFromWorker.program.directory}/.cache/json/_a.json`
    )

    expect(pageQueryResultA.data).toStrictEqual({
      nodeTypeOne: {
        number: 123,
      },
    })

    const pageQueryResultZ = await fs.readJson(
      `${stateFromWorker.program.directory}/.cache/json/_z.json`
    )

    expect(pageQueryResultZ.data).toStrictEqual({
      nodeTypeOne: {
        number: 123,
      },
    })

    expect(spy).toHaveBeenNthCalledWith(1, {
      pageQueryIds: [],
      staticQueryIds: expect.toBeArrayOfSize(1),
    })

    expect(spy).toHaveBeenNthCalledWith(2, {
      pageQueryIds: expect.toBeArrayOfSize(10),
      staticQueryIds: [],
    })

    expect(spy).toHaveBeenNthCalledWith(3, {
      pageQueryIds: expect.toBeArrayOfSize(10),
      staticQueryIds: [],
    })

    expect(spy).toHaveBeenNthCalledWith(4, {
      pageQueryIds: expect.toBeArrayOfSize(8),
      staticQueryIds: [],
    })

    spy.mockRestore()
  })
})
