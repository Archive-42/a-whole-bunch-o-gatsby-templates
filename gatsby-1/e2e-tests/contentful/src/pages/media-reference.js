import { graphql } from "gatsby"
import * as React from "react"
import slugify from "slugify"

import Layout from "../components/layout"

const MediaReferencePage = ({ data }) => {
  const defaultEntries = data.default.nodes
  const englishEntries = data.english.nodes
  const germanEntries = data.german.nodes
  return (
    <Layout>
      {defaultEntries.map(({ contentful_id, title, one, many }) => {
        const slug = slugify(title, { strict: true, lower: true })

        let content = null
        if (many) {
          content = many.map(imageData => (
            <img src={imageData.file.url} style={{ width: 200 }} alt={title} />
          ))
        }

        if (one) {
          content = (
            <img src={one.file.url} style={{ width: 200 }} alt={title} />
          )
        }

        return (
          <div data-cy-id={slug} key={contentful_id}>
            <h2>{title}</h2>
            {content}
          </div>
        )
      })}
      <h1>English Locale</h1>
      {englishEntries.map(
        ({ contentful_id, title, one, oneLocalized, many, manyLocalized }) => {
          const slug = slugify(title, { strict: true, lower: true })

          let content = null
          if (manyLocalized) {
            content = manyLocalized.map(imageData => (
              <img
                src={imageData.file.url}
                style={{ width: 200 }}
                alt={title}
              />
            ))
          }

          if (oneLocalized) {
            content = (
              <img
                src={oneLocalized.file.url}
                style={{ width: 200 }}
                alt={title}
              />
            )
          }

          if (many) {
            content = many.map(imageData => (
              <img
                src={imageData.file.url}
                style={{ width: 200 }}
                alt={title}
              />
            ))
          }

          if (one) {
            content = (
              <img src={one.file.url} style={{ width: 200 }} alt={title} />
            )
          }

          return (
            <div data-cy-id={`english-${slug}`} key={contentful_id}>
              <h2>{title}</h2>
              {content}
            </div>
          )
        }
      )}

      <h1>German Locale</h1>
      {germanEntries.map(
        ({ contentful_id, title, one, oneLocalized, many, manyLocalized }) => {
          const slug = slugify(title, { strict: true, lower: true })

          let content = null
          if (manyLocalized) {
            content = manyLocalized.map(imageData => (
              <img
                src={imageData.file.url}
                style={{ width: 200 }}
                alt={title}
              />
            ))
          }

          if (oneLocalized) {
            content = (
              <img
                src={oneLocalized.file.url}
                style={{ width: 200 }}
                alt={title}
              />
            )
          }

          if (many) {
            content = many.map(imageData => (
              <img
                src={imageData.file.url}
                style={{ width: 200 }}
                alt={title}
              />
            ))
          }

          if (one) {
            content = (
              <img src={one.file.url} style={{ width: 200 }} alt={title} />
            )
          }

          return (
            <div data-cy-id={`german-${slug}`} key={contentful_id}>
              <h2>{title}</h2>
              {content}
            </div>
          )
        }
      )}
    </Layout>
  )
}

export default MediaReferencePage

export const pageQuery = graphql`
  query MediaReferenceQuery {
    default: allContentfulMediaReference(
      sort: { fields: title }
      filter: { title: { glob: "!*Localized*" }, node_locale: { eq: "en-US" } }
    ) {
      nodes {
        title
        contentful_id
        one {
          file {
            url
          }
        }
        many {
          file {
            url
          }
        }
      }
    }
    english: allContentfulMediaReference(
      sort: { fields: title }
      filter: { title: { glob: "*Localized*" }, node_locale: { eq: "en-US" } }
    ) {
      nodes {
        title
        contentful_id
        one {
          file {
            url
          }
        }
        many {
          file {
            url
          }
        }
        oneLocalized {
          file {
            url
          }
        }
        manyLocalized {
          file {
            url
          }
        }
      }
    }
    german: allContentfulMediaReference(
      sort: { fields: title }
      filter: { title: { glob: "*Localized*" }, node_locale: { eq: "de-DE" } }
    ) {
      nodes {
        title
        contentful_id
        one {
          file {
            url
          }
        }
        many {
          file {
            url
          }
        }
        oneLocalized {
          file {
            url
          }
        }
        manyLocalized {
          file {
            url
          }
        }
      }
    }
  }
`
