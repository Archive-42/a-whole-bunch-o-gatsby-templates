import { graphql } from "gatsby"
import React from "react"

export default function FSRouteTest({ data }) {
  return <div>filesystem route. id {data.testFsRouteType.id}</div>
}

export const query = graphql`
  query FSRouteTest($id: String!) {
    testFsRouteType(id: { eq: $id }) {
      id
    }
    # querying this other node to make sure inferring the owner from context.id prevents this node from being the page owner
    otherNode: testNode(id: { eq: "2" }) {
      id
    }
  }
`
