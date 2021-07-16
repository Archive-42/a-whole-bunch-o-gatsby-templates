jest.mock(`fs-extra`, () => {
  const fs = jest.requireActual(`fs-extra`)
  return {
    ...fs,
    readFile: jest.fn(),
  }
})
jest.mock(`../../utils/api-runner-node`, () => () => [])
jest.mock(`gatsby-cli/lib/reporter/index`)
const reporter = require(`gatsby-cli/lib/reporter`)
const fs = require(`fs-extra`)

const FileParser = require(`../file-parser`).default

const specialChars = `ж-ä-!@#$%^&*()_-=+:;'"?,~\``

describe(`File parser`, () => {
  const MOCK_FILE_INFO = {
    "no-query.js": `import React from "react"`,
    "other-graphql-tag.js": `import { graphql } from 'relay'
    export const query = graphql\`
query PageQueryName {
  foo
}
\``,
    "global-query.js": `export const query = graphql\`
query pageQueryName {
  foo
}
\``,
    "global-static-query-hooks.js": `import { useStaticQuery } from 'gatsby'
export default () => {
  const data = useStaticQuery(graphql\`query StaticQueryName { foo }\`);
  return <div>{data.doo}</div>;
}`,
    "page-query.js": `import { graphql } from 'gatsby'
    export const query = graphql\`
query PageQueryName {
  foo
}
\``,
    "page-query-indirect.js": `import { graphql } from 'gatsby'
    const query = graphql\`
query PageQueryIndirect {
  foo
}
\`
export { query }
`,
    "page-query-indirect-2.js": `import { graphql } from 'gatsby'
    const query = graphql\`
query PageQueryIndirect2 {
  foo
}
\`
const query2 = query;
export { query2 }
`,
    "page-query-no-name.js": `import { graphql } from 'gatsby'
  export const query = graphql\`
query {
  foo
}
\``,
    "static-query.js": `import { graphql } from 'gatsby'
  export default () => (
  <StaticQuery
    query={graphql\`query StaticQueryName { foo }\`}
    render={data => <div>{data.doo}</div>}
  />
)`,
    "static-query-no-name.js": `import { graphql } from 'gatsby'
  export default () => (
  <StaticQuery
    query={graphql\`{ foo }\`}
    render={data => <div>{data.foo}</div>}
  />
)`,
    "static-query-named-export.js": `import { graphql } from 'gatsby'
  export const Component = () => (
  <StaticQuery
    query={graphql\`query StaticQueryName { foo }\`}
    render={data => <div>{data.doo}</div>}
  />
)`,
    "static-query-closing-tag.js": `import { graphql } from 'gatsby'
  export default () => (
  <StaticQuery
    query={graphql\`{ foo }\`}
  >
    {data => <div>{data.foo}</div>}
  </StaticQuery>
)`,
    "page-query-and-static-query-named-export.js": `import { graphql } from 'gatsby'
  export const Component = () => (
  <StaticQuery
    query={graphql\`query StaticQueryName { foo }\`}
    render={data => <div>{data.doo}</div>}
  />
)
export const pageQuery = graphql\`query PageQueryName { foo }\`
`,
    "multiple-fragment-exports.js": `import { graphql } from 'gatsby'
  export const fragment1 = graphql\`
  fragment Fragment1 on RootQueryField {
    foo
  }
  fragment Fragment2 on RootQueryField {
    bar
  }
\`
export const fragment3 = graphql\`
  fragment Fragment3 on RootQueryField {
    baz
  }
\`
`,
    "fragment-shorthand.js": `import React from "react"
import { StaticQuery, graphql } from "gatsby"

const query = graphql\`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
\`

export default () => (
  <>
    <StaticQuery
      query={query}
      render={data => <div>{data.title}</div>}
    />
  </>
)`,
    "query-in-separate-variable.js": `import React from "react"
import { StaticQuery, graphql } from "gatsby"

const query = graphql\`{ allMarkdownRemark { blah { node { cheese }}}}\`

export default () => (
  <StaticQuery
    query={query}
    render={data => <div>{data.pizza}</div>}
  />
)`,
    "query-in-separate-variable-2.js": `import React from "react"
import { StaticQuery, graphql } from "gatsby"

const query = graphql\`{ fakeOut { blah { node { cheese }}}}\`
const strangeQueryName = graphql\`{ allStrangeQueryName { blah { node { cheese }}}}\`

export default () => (
  <StaticQuery
    query={strangeQueryName}
    render={data => <div>{data.pizza}</div>}
  />
)`,
    "query-not-defined.js": `import React from "react"
import { StaticQuery, graphql } from "gatsby"

export default () => (
  <StaticQuery
    query={strangeQueryName}
    render={data => <div>{data.pizza}</div>}
  />
)`,
    "query-imported.js": `import React from "react"
import { StaticQuery, graphql } from "gatsby"
import strangeQueryName from "./another-file.js"

export default () => (
  <StaticQuery
    query={strangeQueryName}
    render={data => <div>{data.pizza}</div>}
  />
)`,
    "static-query-hooks.js": `import { graphql, useStaticQuery } from 'gatsby'
export default () => {
  const data = useStaticQuery(graphql\`query StaticQueryName { foo }\`);
  return <div>{data.doo}</div>;
}`,
    "static-query-hooks-with-other-export.js": `import { graphql, useStaticQuery } from 'gatsby'
export { Bar } from 'bar'
export default () => {
  const data = useStaticQuery(graphql\`query StaticQueryName { foo }\`);
  return <div>{data.doo}</div>;
}
`,
    "static-query-hooks-alternative-import.js": `import * as Gatsby from 'gatsby'
export default () => {
  const data = Gatsby.useStaticQuery(Gatsby.graphql\`query StaticQueryName { foo }\`);
  return <div>{data.doo}</div>;
}`,
    "static-query-hooks-with-type-parameter.ts": `import { graphql, useStaticQuery } from 'gatsby'
export default () => {
  const data = useStaticQuery<HomepageQuery>(graphql\`query StaticQueryName { foo }\`);
  return <div>{data.doo}</div>;
}`,
    "static-query-hooks-missing-argument.js": `import { graphql, useStaticQuery } from 'gatsby'
export default () => {
  const data = useStaticQuery();
  return <div>{data.doo}</div>;
}`,
    "static-query-hooks-in-separate-variable.js": `import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const query = graphql\`{ allMarkdownRemark { blah { node { cheese }}}}\`

export default () => {
  const data = useStaticQuery(query);
  return <div>{data.doo}</div>;
}`,
    "static-query-hooks-not-defined.js": `import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default () => {
  const data = useStaticQuery(strangeQueryName);
  return <div>{data.pizza}</div>;
}`,
    "static-query-hooks-imported.js": `import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import strangeQueryName from "./another-file.js"

export default () => {
  const data = useStaticQuery(strangeQueryName);
  return <div>{data.pizza}</div>;
}`,
    [`${specialChars}.js`]: `import { graphql, useStaticQuery } from 'gatsby'
export default () => {
  const data = useStaticQuery(graphql\`query { foo }\`);
  return <div>{data.doo}</div>;
}`,
    [`static-${specialChars}.js`]: `import { graphql } from 'gatsby'
  export default () => (
  <StaticQuery
    query={graphql\`query { foo }\`}
    render={data => <div>{data.doo}</div>}
  />
)`,
    "static-query-hooks-commonjs.js": `const { graphql, useStaticQuery } = require('gatsby')
module.exports = () => {
  const data = useStaticQuery(graphql\`query StaticQueryName { foo }\`);
  return <div>{data.doo}</div>;
}`,
    "static-query-hooks-commonjs-no-destructuring.js": `const gatsby = require('gatsby')
const {graphql} = require('gatsby')
module.exports = () => {
  const data = gatsby.useStaticQuery(graphql\`query StaticQueryNameNoDestructuring { foo }\`);
  return <div>{data.doo}</div>;
}`,
  }

  const parser = new FileParser()

  beforeAll(() => {
    fs.readFile.mockImplementation(file =>
      Promise.resolve(MOCK_FILE_INFO[file])
    )
  })

  it(`extracts query AST correctly from files`, async () => {
    const errors = []
    const addError = errors.push.bind(errors)
    const results = await parser.parseFiles(
      Object.keys(MOCK_FILE_INFO),
      addError
    )

    // Check that invalid entries are not in the results and thus haven't been extracted
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ filePath: `static-query-hooks-commonjs.js` }),
        expect.not.objectContaining({ filePath: `no-query.js` }),
        expect.not.objectContaining({ filePath: `other-graphql-tag.js` }),
        expect.not.objectContaining({ filePath: `global-query.js` }),
        expect.not.objectContaining({
          filePath: `global-static-query-hooks.js`,
        }),
      ])
    )

    // The second param is a "hint", see: https://jestjs.io/docs/en/expect#tomatchsnapshotpropertymatchers-hint
    expect(results).toMatchSnapshot({}, `results`)
    expect(reporter.warn).toMatchSnapshot({}, `warn`)
    expect(reporter.panicOnBuild).toMatchSnapshot({}, `panicOnBuild`)
    expect(errors.length).toEqual(1)
  })

  it(`generates spec-compliant query names out of path`, async () => {
    const ast = await parser.parseFile(`${specialChars}.js`, jest.fn())
    const nameNode = ast[0].doc.definitions[0].name
    expect(nameNode).toEqual({
      kind: `Name`,
      value: `zhADollarpercentandJs1125018085`,
    })

    const ast2 = await parser.parseFile(`static-${specialChars}.js`, jest.fn())
    const nameNode2 = ast2[0].doc.definitions[0].name
    expect(nameNode2).toEqual({
      kind: `Name`,
      value: `staticZhADollarpercentandJs1125018085`,
    })
  })
})
