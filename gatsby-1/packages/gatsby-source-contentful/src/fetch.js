const contentful = require(`contentful`)
const _ = require(`lodash`)
const chalk = require(`chalk`)
const { formatPluginOptionsForCLI } = require(`./plugin-options`)
const { CODES } = require(`./report`)

/**
 * Generate a user friendly error message.
 *
 * Contentful's API has its own error message structure, which might change depending of internal server or authentification errors.
 *
 * Additionally the SDK strips the error object, sometimes:
 * https://github.com/contentful/contentful.js/blob/b67b77ac8c919c4ec39203f8cac2043854ab0014/lib/create-contentful-api.js#L89-L99
 *
 * This code tries to work around this.
 */
const createContentfulErrorMessage = e => {
  if (typeof e === `string`) {
    return e
  }
  // If we got a response, it is very likely that it is a Contentful API error.
  if (e.response) {
    let parsedContentfulErrorData = null

    // Parse JSON response data, and add it to the object.
    if (typeof e.response.data === `string`) {
      try {
        parsedContentfulErrorData = JSON.parse(e.response.data)
      } catch (err) {
        e.message = e.response.data
      }
      // If response data was parsed already, just add it.
    } else if (typeof e.response.data === `object`) {
      parsedContentfulErrorData = e.response.data
    }

    e = { ...e, ...e.response, ...parsedContentfulErrorData }
  }

  let errorMessage = [
    // Generic error values
    e.code && String(e.code),
    e.status && String(e.status),
    e.statusText,
    // Contentful API error response values
    e.sys?.id,
  ]
    .filter(Boolean)
    .join(` `)

  // Add message if it exists. Usually error default or Contentful's error message
  if (e.message) {
    errorMessage += `\n\n${e.message}`
  }

  // Get request ID from headers or Contentful's error data
  const requestId =
    (e.headers &&
      typeof e.headers === `object` &&
      e.headers[`x-contentful-request-id`]) ||
    e.requestId

  if (requestId) {
    errorMessage += `\n\nRequest ID: ${requestId}`
  }

  // Tell the user about how many request attempts Contentful SDK made
  if (e.attempts) {
    errorMessage += `\n\nThe request was sent with ${e.attempts} attempts`
  }

  return errorMessage
}

module.exports = async function contentfulFetch({
  syncToken,
  pluginConfig,
  reporter,
}) {
  // Fetch articles.
  let syncProgress
  let syncItemCount = 0
  const pageLimit = pluginConfig.get(`pageLimit`)
  const contentfulClientOptions = {
    space: pluginConfig.get(`spaceId`),
    accessToken: pluginConfig.get(`accessToken`),
    host: pluginConfig.get(`host`),
    environment: pluginConfig.get(`environment`),
    proxy: pluginConfig.get(`proxy`),
    integration: `gatsby-source-contentful`,
    responseLogger: response => {
      function createMetadataLog(response) {
        if (!response.headers) {
          return null
        }
        return [
          response?.headers[`content-length`] &&
            `size: ${response.headers[`content-length`]}B`,
          response?.headers[`x-contentful-request-id`] &&
            `request id: ${response.headers[`x-contentful-request-id`]}`,
          response?.headers[`x-cache`] &&
            `cache: ${response.headers[`x-cache`]}`,
        ]
          .filter(Boolean)
          .join(` `)
      }

      // Sync progress
      if (
        response.config.url === `sync` &&
        !response.isAxiosError &&
        response?.data.items
      ) {
        syncItemCount += response.data.items.length
        syncProgress.total = syncItemCount
        syncProgress.tick(response.data.items.length)
      }

      const metadataLog = createMetadataLog(response)

      reporter.verbose(
        [
          `${response.config.method} /${response.config.url}:`,
          response.status,
          response.statusText,
          metadataLog && `(${metadataLog})`,
        ]
          .filter(Boolean)
          .join(` `)
      )
    },
    // Allow passing of custom configuration to the Contentful SDK like headers
    ...(pluginConfig.get(`contentfulClientConfig`) || {}),
  }

  const client = contentful.createClient(contentfulClientOptions)

  // The sync API puts the locale in all fields in this format { fieldName:
  // {'locale': value} } so we need to get the space and its default local.
  //
  // We'll extend this soon to support multiple locales.
  let space
  let locales
  let defaultLocale = `en-US`
  try {
    reporter.verbose(`Fetching default locale`)
    space = await client.getSpace()
    locales = await client.getLocales().then(response => response.items)
    defaultLocale = _.find(locales, { default: true }).code
    reporter.verbose(
      `Default locale is: ${defaultLocale}. There are ${locales.length} locales in total.`
    )
  } catch (e) {
    let details
    let errors
    if (e.code === `ENOTFOUND`) {
      details = `You seem to be offline`
    } else if (e.code === `SELF_SIGNED_CERT_IN_CHAIN`) {
      reporter.panic({
        id: CODES.SelfSignedCertificate,
        context: {
          sourceMessage: `We couldn't make a secure connection to your contentful space. Please check if you have any self-signed SSL certificates installed.`,
        },
      })
    } else if (e.responseData) {
      if (
        e.responseData.status === 404 &&
        contentfulClientOptions.environment &&
        contentfulClientOptions.environment !== `master`
      ) {
        // environments need to have access to master
        details = `Unable to access your space. Check if ${chalk.yellow(
          `environment`
        )} is correct and your ${chalk.yellow(
          `accessToken`
        )} has access to the ${chalk.yellow(
          contentfulClientOptions.environment
        )} and the ${chalk.yellow(`master`)} environments.`
        errors = {
          accessToken: `Check if setting is correct`,
          environment: `Check if setting is correct`,
        }
      } else if (e.responseData.status === 404) {
        // host and space used to generate url
        details = `Endpoint not found. Check if ${chalk.yellow(
          `host`
        )} and ${chalk.yellow(`spaceId`)} settings are correct`
        errors = {
          host: `Check if setting is correct`,
          spaceId: `Check if setting is correct`,
        }
      } else if (e.responseData.status === 401) {
        // authorization error
        details = `Authorization error. Check if ${chalk.yellow(
          `accessToken`
        )} and ${chalk.yellow(`environment`)} are correct`
        errors = {
          accessToken: `Check if setting is correct`,
          environment: `Check if setting is correct`,
        }
      }
    }

    reporter.panic({
      context: {
        sourceMessage: `Accessing your Contentful space failed: ${createContentfulErrorMessage(
          e
        )}

Try setting GATSBY_CONTENTFUL_OFFLINE=true to see if we can serve from cache.
${details ? `\n${details}\n` : ``}
Used options:
${formatPluginOptionsForCLI(pluginConfig.getOriginalPluginOptions(), errors)}`,
      },
    })
  }

  let currentSyncData
  let currentPageLimit = pageLimit
  let lastCurrentPageLimit
  let syncSuccess = false
  try {
    syncProgress = reporter.createProgress(
      `Contentful: ${syncToken ? `Sync changed items` : `Sync all items`}`,
      currentPageLimit,
      0
    )
    syncProgress.start()
    reporter.verbose(`Contentful: Sync ${currentPageLimit} items per page.`)

    while (!syncSuccess) {
      try {
        const basicSyncConfig = {
          limit: currentPageLimit,
          resolveLinks: false,
        }
        const query = syncToken
          ? { nextSyncToken: syncToken, ...basicSyncConfig }
          : { initial: true, ...basicSyncConfig }
        currentSyncData = await client.sync(query)
        syncSuccess = true
      } catch (e) {
        // Back off page limit if responses content length exceeds Contentfuls limits.
        if (
          e.response?.data?.message.includes(`Response size too big`) &&
          currentPageLimit > 1
        ) {
          lastCurrentPageLimit = currentPageLimit
          // Reduce page limit by a arbitrary 1/3 of the current limit to ensure
          // the new and bigger entries are synced without exceeding the reponse size limit
          currentPageLimit = Math.floor((currentPageLimit / 3) * 2) || 1
          reporter.warn(
            [
              `The sync with Contentful failed using pageLimit ${lastCurrentPageLimit} as the reponse size limit of the API is exceeded.`,
              `Retrying sync with pageLimit of ${currentPageLimit}`,
            ].join(`\n\n`)
          )
          continue
        }
        throw e
      }
      if (currentPageLimit !== pageLimit) {
        reporter.warn(
          `We recommend you to set your pageLimit in gatsby-config.js to ${currentPageLimit} to avoid failed synchronizations.`
        )
      }
    }
  } catch (e) {
    reporter.panic({
      id: CODES.SyncError,
      context: {
        sourceMessage: `Fetching contentful data failed: ${createContentfulErrorMessage(
          e
        )}`,
      },
    })
  } finally {
    syncProgress.done()
  }

  // We need to fetch content types with the non-sync API as the sync API
  // doesn't support this.
  let contentTypes
  try {
    contentTypes = await pagedGet(client, `getContentTypes`, pageLimit)
  } catch (e) {
    reporter.panic({
      id: CODES.FetchContentTypes,
      context: {
        sourceMessage: `Error fetching content types: ${createContentfulErrorMessage(
          e
        )}`,
      },
    })
  }
  reporter.verbose(`Content types fetched ${contentTypes.items.length}`)

  const contentTypeItems = contentTypes.items

  const result = {
    currentSyncData,
    contentTypeItems,
    defaultLocale,
    locales,
    space,
  }

  return result
}

/**
 * Gets all the existing entities based on pagination parameters.
 * The first call will have no aggregated response. Subsequent calls will
 * concatenate the new responses to the original one.
 */
function pagedGet(
  client,
  method,
  pageLimit,
  query = {},
  skip = 0,
  aggregatedResponse = null
) {
  return client[method]({
    ...query,
    skip: skip,
    limit: pageLimit,
    order: `sys.createdAt`,
  }).then(response => {
    if (!aggregatedResponse) {
      aggregatedResponse = response
    } else {
      aggregatedResponse.items = aggregatedResponse.items.concat(response.items)
    }
    if (skip + pageLimit <= response.total) {
      return pagedGet(
        client,
        method,
        pageLimit,
        query,
        skip + pageLimit,
        aggregatedResponse
      )
    }
    return aggregatedResponse
  })
}
