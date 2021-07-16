import _ from "lodash"
import fastq from "fastq"
import { IProgressReporter } from "gatsby-cli/lib/reporter/reporter-progress"
import { store } from "../redux"
import { IGatsbyPage, IGatsbyState } from "../redux/types"
import { hasFlag, FLAG_ERROR_EXTRACTION } from "../redux/reducers/queries"
import { IQueryJob, queryRunner } from "./query-runner"
import {
  IStaticQueryResult,
  websocketManager,
} from "../utils/websocket-manager"
import { GraphQLRunner } from "./graphql-runner"
import { IGroupedQueryIds } from "../services"

if (process.env.GATSBY_EXPERIMENTAL_QUERY_CONCURRENCY) {
  console.info(
    `GATSBY_EXPERIMENTAL_QUERY_CONCURRENCY: Running with concurrency set to \`${process.env.GATSBY_EXPERIMENTAL_QUERY_CONCURRENCY}\``
  )
}

const concurrency =
  Number(process.env.GATSBY_EXPERIMENTAL_QUERY_CONCURRENCY) || 4

/**
 * Calculates the set of dirty query IDs (page.paths, or staticQuery.id's).
 *
 * Dirty state is tracked in `queries` reducer, here we simply filter
 * them from all tracked queries.
 */
export function calcDirtyQueryIds(state: IGatsbyState): Array<string> {
  const { trackedQueries, trackedComponents, deletedQueries } = state.queries

  const queriesWithBabelErrors = new Set()
  for (const component of trackedComponents.values()) {
    if (hasFlag(component.errors, FLAG_ERROR_EXTRACTION)) {
      for (const queryId of component.pages) {
        queriesWithBabelErrors.add(queryId)
      }
    }
  }
  // Note: trackedQueries contains both - page and static query ids
  const dirtyQueryIds: Array<string> = []
  for (const [queryId, query] of trackedQueries) {
    if (deletedQueries.has(queryId)) {
      continue
    }
    if (query.dirty > 0 && !queriesWithBabelErrors.has(queryId)) {
      dirtyQueryIds.push(queryId)
    }
  }
  return dirtyQueryIds
}

export { calcDirtyQueryIds as calcInitialDirtyQueryIds }

/**
 * Groups queryIds by whether they are static or page queries.
 */
export function groupQueryIds(queryIds: Array<string>): IGroupedQueryIds {
  const grouped = _.groupBy(queryIds, p =>
    p.slice(0, 4) === `sq--` ? `static` : `page`
  )

  const { pages } = store.getState()

  return {
    staticQueryIds: grouped?.static || [],
    pageQueryIds:
      grouped?.page
        ?.map(path => pages.get(path) as IGatsbyPage)
        ?.filter(Boolean) || [],
  }
}

function createQueue<QueryIDType>({
  createJobFn,
  state,
  activity,
  graphqlRunner,
  graphqlTracing,
}: {
  createJobFn: (
    state: IGatsbyState,
    queryId: QueryIDType
  ) => IQueryJob | undefined
  state: IGatsbyState
  activity: IProgressReporter
  graphqlRunner: GraphQLRunner
  graphqlTracing: boolean
}): fastq.queue<QueryIDType, any> {
  if (!graphqlRunner) {
    graphqlRunner = new GraphQLRunner(store, { graphqlTracing })
  }
  state = state || store.getState()

  function worker(queryId: QueryIDType, cb): void {
    const job = createJobFn(state, queryId)
    if (!job) {
      cb(null, undefined)
      return
    }
    queryRunner(graphqlRunner, job, activity?.span)
      .then(result => {
        if (activity.tick) {
          activity.tick()
        }
        cb(null, { job, result })
      })
      .catch(error => {
        cb(error)
      })
  }
  // Note: fastq.promise version is much slower
  return fastq(worker, concurrency)
}

async function processQueries<QueryIDType>({
  queryIds,
  createJobFn,
  onQueryDone,
  state,
  activity,
  graphqlRunner,
  graphqlTracing,
}: {
  queryIds: Array<QueryIDType>
  createJobFn: (
    state: IGatsbyState,
    queryId: QueryIDType
  ) => IQueryJob | undefined
  onQueryDone:
    | (({ job, result }: { job: IQueryJob; result: unknown }) => void)
    | undefined
  state: IGatsbyState
  activity: IProgressReporter
  graphqlRunner: GraphQLRunner
  graphqlTracing: boolean
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const fastQueue = createQueue({
      createJobFn,
      state,
      activity,
      graphqlRunner,
      graphqlTracing,
    })

    queryIds.forEach((queryId: QueryIDType) => {
      fastQueue.push(queryId, (err, res) => {
        if (err) {
          fastQueue.kill()
          reject(err)
          return
        }
        if (res && onQueryDone) {
          onQueryDone(res)
        }
      })
    })

    if (!fastQueue.idle()) {
      fastQueue.drain = (): any => resolve()
    } else {
      resolve()
    }
  })
}

function createStaticQueryJob(
  state: IGatsbyState,
  queryId: string
): IQueryJob | undefined {
  const component = state.staticQueryComponents.get(queryId)

  if (!component) {
    return undefined
  }

  const { hash, id, query, componentPath } = component

  return {
    id: queryId,
    query,
    isPage: false,
    hash,
    componentPath,
    context: { path: id },
  }
}

function onDevelopStaticQueryDone({
  job,
  result,
}: {
  job: IQueryJob
  result: IStaticQueryResult["result"]
}): void {
  if (!job.hash) {
    return
  }

  websocketManager.emitStaticQueryData({
    result,
    id: job.hash,
  })
}

export async function processStaticQueries(
  queryIds: IGroupedQueryIds["staticQueryIds"],
  { state, activity, graphqlRunner, graphqlTracing }
): Promise<void> {
  return processQueries<string>({
    queryIds,
    createJobFn: createStaticQueryJob,
    onQueryDone:
      process.env.NODE_ENV === `production`
        ? undefined
        : onDevelopStaticQueryDone,
    state,
    activity,
    graphqlRunner,
    graphqlTracing,
  })
}

export async function processPageQueries(
  queryIds: IGroupedQueryIds["pageQueryIds"],
  { state, activity, graphqlRunner, graphqlTracing }
): Promise<void> {
  return processQueries<IGatsbyPage>({
    queryIds,
    createJobFn: createPageQueryJob,
    onQueryDone: undefined,
    state,
    activity,
    graphqlRunner,
    graphqlTracing,
  })
}

function createPageQueryJob(
  state: IGatsbyState,
  page: IGatsbyPage
): IQueryJob | undefined {
  const component = state.components.get(page.componentPath)

  if (!component) {
    return undefined
  }

  const { path, componentPath, context } = page
  const { query } = component

  return {
    id: path,
    query,
    isPage: true,
    componentPath,
    context: {
      ...page,
      ...context,
    },
  }
}
