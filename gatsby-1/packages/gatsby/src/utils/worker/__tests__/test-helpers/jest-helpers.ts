// spawning processing will occasionally exceed default time for test
// this sets up a bit longer time for each test to avoid flakiness due to tests not being executed within short time frame
jest.setTimeout(35000)

export const itWhenLMDB = process.env.GATSBY_EXPERIMENTAL_LMDB_STORE
  ? it
  : it.skip

export const describeWhenLMDB = process.env.GATSBY_EXPERIMENTAL_LMDB_STORE
  ? describe
  : describe.skip
