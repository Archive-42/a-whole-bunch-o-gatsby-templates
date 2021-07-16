import { graphql } from "gatsby"
import * as React from "react"
import slugify from "slugify"

import Layout from "../components/layout"

const DatePage = ({ data }) => {
  const entries = [
    data.date,
    data.dateTime,
    data.dateTimeTimezone,
    { ...data.dateEnglish, title: "Date: English" },
    { ...data.dateGerman, title: "Date: German" },
  ]
  return (
    <Layout>
      {entries.map(({ title, date, formatted }) => {
        const slug = slugify(title, { strict: true, lower: true })
        return (
          <div data-cy-id={slug} key={slug}>
            <h2>{title}</h2>
            <p data-cy-value>{date}</p>
            <p data-cy-value-formatted>{formatted}</p>
          </div>
        )
      })}
    </Layout>
  )
}

export default DatePage

export const pageQuery = graphql`
  query DateQuery {
    dateTime: contentfulDate(contentful_id: { eq: "38akBjGb3T1t4AjB87wQjo" }) {
      title
      date: dateTime
      formatted: dateTime(formatString: "D.M.YYYY - hh:mm")
    }
    dateTimeTimezone: contentfulDate(
      contentful_id: { eq: "6dZ8pK4tFWZDZPHgSC0tNS" }
    ) {
      title
      date: dateTimeTimezone
      formatted: dateTimeTimezone(formatString: "D.M.YYYY - hh:mm (z)")
    }
    date: contentfulDate(contentful_id: { eq: "5FuULz0jl0rKoKUKp2rshf" }) {
      title
      date
      formatted: date(formatString: "D.M.YYYY")
    }
    dateEnglish: contentfulDate(
      contentful_id: { eq: "1ERWZvDiYELryAZEP1dmKG" }
      node_locale: { eq: "en-US" }
    ) {
      title
      date: dateLocalized
      formatted: dateLocalized(formatString: "D.M.YYYY - HH:mm:ss")
    }
    dateGerman: contentfulDate(
      contentful_id: { eq: "1ERWZvDiYELryAZEP1dmKG" }
      node_locale: { eq: "de-DE" }
    ) {
      title
      date: dateLocalized
      formatted: dateLocalized(formatString: "D.M.YYYY - HH:mm:ss")
    }
  }
`
