import React from "react"
import { graphql } from "gatsby"
import { QueryDataCachesView } from "../../../components/query-data-caches/view"

export default function PageQueryWithTrailingSlashAtoBtoAHistoryPageB({
  data,
  path,
}) {
  return (
    <>
      <QueryDataCachesView
        data={data}
        pageType="B"
        dataType="page-query"
        path={path}
      />
    </>
  )
}

export const query = graphql`
  {
    queryDataCachesJson(
      selector: { eq: "page-query-with-trailing-slash-A-to-B-to-A-history" }
    ) {
      ...QueryDataCachesFragmentSecondPage
    }
  }
`
