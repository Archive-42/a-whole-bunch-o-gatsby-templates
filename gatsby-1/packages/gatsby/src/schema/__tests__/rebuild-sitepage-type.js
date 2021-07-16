const { store } = require(`../../redux`)
const { graphql } = require(`../../../graphql`)
const { build, rebuildWithSitePage } = require(`..`)

jest.mock(`gatsby-cli/lib/reporter`, () => {
  return {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    activityTimer: () => {
      return {
        start: jest.fn(),
        setStatus: jest.fn(),
        end: jest.fn(),
      }
    },
    phantomActivity: () => {
      return {
        start: jest.fn(),
        end: jest.fn(),
      }
    },
  }
})

const firstPage = () => {
  return {
    id: `page1`,
    parent: null,
    children: [],
    internal: { type: `SitePage`, contentDigest: `0`, counter: 0 },
    keep: `Page`,
    fields: {
      oldKey: `value`,
    },
  }
}

const secondPage = () => {
  return {
    id: `page2`,
    parent: null,
    children: [],
    internal: { type: `SitePage`, contentDigest: `0`, counter: 1 },
    fields: {
      key: `value`,
    },
    context: {
      key: `value`,
    },
  }
}

const nodes = () => [firstPage()]

describe(`build and update schema for SitePage`, () => {
  let schema

  beforeEach(async () => {
    store.dispatch({ type: `DELETE_CACHE` })
    nodes().forEach(node =>
      store.dispatch({ type: `CREATE_NODE`, payload: node })
    )

    await build({})
    schema = store.getState().schema
  })

  it(`updates SitePage on rebuild`, async () => {
    let fields
    let inputFields

    const initialFields = [
      `path`,
      `component`,
      `internalComponentName`,
      `componentChunkName`,
      `matchPath`,
      `keep`,
      `fields`,
      `id`,
      `parent`,
      `children`,
      `internal`,
    ]

    fields = Object.keys(schema.getType(`SitePage`).getFields())
    expect(fields.length).toBe(11)
    expect(fields).toEqual(initialFields)

    inputFields = Object.keys(schema.getType(`SitePageFilterInput`).getFields())
    expect(fields.length).toBe(11)
    expect(inputFields).toEqual(initialFields)

    // Rebuild Schema
    store.dispatch({ type: `CREATE_NODE`, payload: secondPage() })
    await rebuildWithSitePage({})
    schema = store.getState().schema

    fields = Object.keys(schema.getType(`SitePage`).getFields())
    expect(fields.length).toBe(12)
    expect(fields.sort()).toEqual(initialFields.concat(`context`).sort())

    inputFields = Object.keys(schema.getType(`SitePageFilterInput`).getFields())
    expect(fields.length).toBe(12)
    expect(inputFields.sort()).toEqual(initialFields.concat(`context`).sort())

    const fieldsEnum = schema
      .getType(`SitePageFieldsEnum`)
      .getValue(`context___key`)
    expect(fieldsEnum).toBeDefined()

    const sortFieldsEnum = schema.getType(`SitePageSortInput`).getFields()
      .fields.type.ofType
    expect(sortFieldsEnum.getValue(`context___key`)).toBeDefined()
  })

  const testNestedFields = async () => {
    let fields
    let inputFields

    fields = Object.keys(schema.getType(`SitePageFields`).getFields())
    expect(fields.length).toBe(1)
    expect(fields).toEqual([`oldKey`])
    inputFields = Object.keys(
      schema.getType(`SitePageFieldsFilterInput`).getFields()
    )
    expect(inputFields.length).toBe(1)
    expect(inputFields).toEqual([`oldKey`])

    // Rebuild Schema
    store.dispatch({ type: `CREATE_NODE`, payload: secondPage() })
    await rebuildWithSitePage({})
    schema = store.getState().schema

    fields = Object.keys(schema.getType(`SitePageFields`).getFields())
    expect(fields.length).toBe(2)
    expect(fields).toEqual([`oldKey`, `key`])

    inputFields = Object.keys(
      schema.getType(`SitePageFieldsFilterInput`).getFields()
    )
    expect(inputFields.length).toBe(2)
    expect(inputFields).toEqual([`oldKey`, `key`])

    const fieldsEnum = schema
      .getType(`SitePageFieldsEnum`)
      .getValues()
      .map(value => value.name)
    expect(fieldsEnum.includes(`fields___oldKey`)).toBeTruthy()
    expect(fieldsEnum.includes(`fields___key`)).toBeTruthy()
  }

  it(`updates nested types on rebuild`, testNestedFields)

  it(`updates nested types on rebuild (with query executed before rebuilding)`, async () => {
    // Set a stage for the same test as above but with graphql query executed before updating schema
    // See https://github.com/gatsbyjs/gatsby/issues/30107
    const result = await graphql(
      schema,
      `
        {
          __typename
        }
      `,
      null,
      {}
    )
    expect(result).toEqual({ data: { __typename: `Query` } })
    await testNestedFields()
  })

  it(`updates nested input types on rebuild`, async () => {
    // sanity-check
    const inputFields = Object.keys(
      schema.getType(`SitePageFieldsFilterInput`).getFields()
    )
    expect(inputFields.length).toBe(1)
    expect(inputFields).toEqual([`oldKey`])

    // Rebuild
    const page = firstPage()
    page.fields = {}
    store.dispatch({ type: `CREATE_NODE`, payload: page })
    await rebuildWithSitePage({})
    schema = store.getState().schema

    expect(schema.getType(`SitePageFieldsFilterInput`)).toBeUndefined()
  })

  it(`respects @dontInfer on SitePage`, async () => {
    const typeDefs = `
      type SitePage implements Node @dontInfer {
        keep: String!
        fields: SitePageFields
      }
      type SitePageFields {
        temp: String!
      }
    `
    store.dispatch({ type: `CREATE_TYPES`, payload: typeDefs })

    // rebuildWithSitePage ignores new type definitions,
    // so need to build again first
    await build({})

    store.dispatch({ type: `CREATE_NODE`, payload: secondPage() })

    await rebuildWithSitePage({})
    schema = store.getState().schema
    expect(schema.getType(`SitePage`).getFields().context).not.toBeDefined()
    expect(schema.getType(`SitePageFields`).getFields().key).not.toBeDefined()
  })
})
