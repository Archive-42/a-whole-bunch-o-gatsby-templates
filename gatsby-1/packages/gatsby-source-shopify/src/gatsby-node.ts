import { createOperations } from "./operations"
import { eventsApi } from "./events"
import {
  CreateResolversArgs,
  NodePluginArgs,
  PluginOptionsSchemaArgs,
  SourceNodesArgs,
} from "gatsby"
import { makeResolveGatsbyImageData } from "./resolve-gatsby-image-data"
import {
  getGatsbyImageResolver,
  IGatsbyGraphQLResolverArgumentConfig,
} from "gatsby-plugin-image/graphql-utils"
import { shiftLeft } from "shift-left"
import { pluginErrorCodes as errorCodes } from "./errors"
import { makeSourceFromOperation } from "./make-source-from-operation"
export { createSchemaCustomization } from "./create-schema-customization"
import { createNodeId } from "./node-builder"
import { JoiObject } from "joi"

export function pluginOptionsSchema({
  Joi,
}: PluginOptionsSchemaArgs): JoiObject {
  // @ts-ignore TODO: When Gatsby updates Joi version, update type
  // Vague type error that we're not able to figure out related to isJoi missing
  // Probably related to Joi being outdated
  return Joi.object({
    password: Joi.string().required(),
    storeUrl: Joi.string()
      .pattern(/^[a-z0-9-]+\.myshopify\.com$/)
      .message(
        `The storeUrl value should be your store's myshopify.com URL in the form "my-site.myshopify.com", without https or slashes`
      )
      .required(),
    downloadImages: Joi.boolean(),
    typePrefix: Joi.string()
      .pattern(new RegExp(`(^[A-Z]w*)`))
      .message(
        `"typePrefix" can only be alphanumeric characters, starting with an uppercase letter`
      )
      .default(``),
    shopifyConnections: Joi.array()
      .default([])
      .items(Joi.string().valid(`orders`, `collections`)),
    salesChannel: Joi.string().default(
      process.env.GATSBY_SHOPIFY_SALES_CHANNEL || ``
    ),
  })
}

async function sourceAllNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: ShopifyPluginOptions
): Promise<void> {
  const {
    createProductsOperation,
    createProductVariantsOperation,
    createOrdersOperation,
    createCollectionsOperation,
    finishLastOperation,
    completedOperation,
    cancelOperationInProgress,
  } = createOperations(pluginOptions, gatsbyApi)

  const operations = [createProductsOperation, createProductVariantsOperation]
  if (pluginOptions.shopifyConnections?.includes(`orders`)) {
    operations.push(createOrdersOperation)
  }

  if (pluginOptions.shopifyConnections?.includes(`collections`)) {
    operations.push(createCollectionsOperation)
  }

  const sourceFromOperation = makeSourceFromOperation(
    finishLastOperation,
    completedOperation,
    cancelOperationInProgress,
    gatsbyApi,
    pluginOptions
  )

  for (const op of operations) {
    await sourceFromOperation(op)
  }
}

const shopifyNodeTypes = [
  `ShopifyLineItem`,
  `ShopifyProductMetafield`,
  `ShopifyProductVariantMetafield`,
  `ShopifyCollectionMetafield`,
  `ShopifyOrder`,
  `ShopifyProduct`,
  `ShopifyCollection`,
  `ShopifyProductImage`,
  `ShopifyCollectionImage`,
  `ShopifyProductFeaturedImage`,
  `ShopifyProductVariant`,
  `ShopifyProductVariantImage`,
  `ShopifyProductVariantPricePair`,
  `ShopifyProductFeaturedMediaPreviewImage`,
]

async function sourceChangedNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: ShopifyPluginOptions
): Promise<void> {
  const {
    incrementalProducts,
    incrementalProductVariants,
    incrementalOrders,
    incrementalCollections,
    finishLastOperation,
    completedOperation,
    cancelOperationInProgress,
  } = createOperations(pluginOptions, gatsbyApi)
  const { typePrefix = `` } = pluginOptions
  const lastBuildTime = new Date(
    gatsbyApi.store.getState().status.plugins?.[`gatsby-source-shopify`]?.[
      `lastBuildTime${typePrefix}`
    ]
  )

  for (const nodeType of shopifyNodeTypes) {
    gatsbyApi
      .getNodesByType(`${typePrefix}${nodeType}`)
      .forEach(node => gatsbyApi.actions.touchNode(node))
  }

  const operations = [
    incrementalProducts(lastBuildTime),
    incrementalProductVariants(lastBuildTime),
  ]

  if (pluginOptions.shopifyConnections?.includes(`orders`)) {
    operations.push(incrementalOrders(lastBuildTime))
  }

  if (pluginOptions.shopifyConnections?.includes(`collections`)) {
    operations.push(incrementalCollections(lastBuildTime))
  }

  const sourceFromOperation = makeSourceFromOperation(
    finishLastOperation,
    completedOperation,
    cancelOperationInProgress,
    gatsbyApi,
    pluginOptions
  )

  for (const op of operations) {
    await sourceFromOperation(op)
  }

  const { fetchDestroyEventsSince } = eventsApi(pluginOptions)
  const destroyEvents = await fetchDestroyEventsSince(lastBuildTime)

  gatsbyApi.reporter.info(
    `${destroyEvents.length} items have been deleted since ${lastBuildTime}`
  )

  if (destroyEvents.length) {
    gatsbyApi.reporter.info(`Removing matching nodes from Gatsby`)
    destroyEvents.forEach(e => {
      const id = `${typePrefix}gid://shopify/${e.subject_type}/${e.subject_id}`
      gatsbyApi.reporter.info(`Looking up node with ID: ${id}`)
      const nodeId = createNodeId(id, gatsbyApi, pluginOptions)
      const node = gatsbyApi.getNode(nodeId)

      if (node) {
        gatsbyApi.reporter.info(
          `Removing ${node.internal.type}: ${node.id} with shopifyId ${e.subject_id}`
        )
        gatsbyApi.actions.deleteNode(node)
      } else {
        gatsbyApi.reporter.info(`Couldn't find node with ID: ${id}`)
      }
    })
  }
}

export async function sourceNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: ShopifyPluginOptions
): Promise<void> {
  const pluginStatus = gatsbyApi.store.getState().status.plugins?.[
    `gatsby-source-shopify`
  ]

  const lastBuildTime =
    pluginStatus?.[`lastBuildTime${pluginOptions.typePrefix || ``}`]

  if (lastBuildTime !== undefined) {
    gatsbyApi.reporter.info(`Cache is warm, running an incremental build`)
    await sourceChangedNodes(gatsbyApi, pluginOptions)
  } else {
    gatsbyApi.reporter.info(`Cache is cold, running a clean build`)
    await sourceAllNodes(gatsbyApi, pluginOptions)
  }

  gatsbyApi.reporter.info(`Finished sourcing nodes, caching last build time`)
  gatsbyApi.actions.setPluginStatus(
    pluginStatus !== undefined
      ? {
          ...pluginStatus,
          [`lastBuildTime${pluginOptions.typePrefix || ``}`]: Date.now(),
        }
      : {
          [`lastBuildTime${pluginOptions.typePrefix || ``}`]: Date.now(),
        }
  )
}

export function createResolvers(
  { createResolvers, cache }: CreateResolversArgs,
  {
    downloadImages,
    typePrefix = ``,
    shopifyConnections = [],
  }: ShopifyPluginOptions
): void {
  if (!downloadImages) {
    const args = {
      placeholder: {
        description: `Low resolution version of the image`,
        type: `String`,
        defaultValue: null,
      } as IGatsbyGraphQLResolverArgumentConfig,
    }
    const imageNodeTypes = [
      `ShopifyProductImage`,
      `ShopifyProductVariantImage`,
      `ShopifyProductFeaturedImage`,
      `ShopifyProductFeaturedMediaPreviewImage`,
    ]

    if (shopifyConnections.includes(`collections`)) {
      imageNodeTypes.push(`ShopifyCollectionImage`)
    }

    const resolvers = imageNodeTypes.reduce((r, nodeType) => {
      return {
        ...r,
        [`${typePrefix}${nodeType}`]: {
          gatsbyImageData: getGatsbyImageResolver(
            makeResolveGatsbyImageData(cache),
            args
          ),
        },
      }
    }, {})

    createResolvers(resolvers)
  }
}

interface IErrorContext {
  sourceMessage: string
}

const getErrorText = (context: IErrorContext): string => context.sourceMessage

export function onPreInit({ reporter }: NodePluginArgs): void {
  reporter.setErrorMap({
    [errorCodes.bulkOperationFailed]: {
      text: getErrorText,
      level: `ERROR`,
      category: `USER`,
    },
    [errorCodes.apiConflict]: {
      text: (): string => shiftLeft`
        Your operation was canceled. You might have another production site for this Shopify store.

        Shopify only allows one bulk operation at a time for a given shop, so we recommend that you
        avoid having two production sites that point to the same Shopify store.

        If the duplication is intentional, please wait for the other operation to finish before trying
        again. Otherwise, consider deleting the other site or pointing it to a test store instead.
      `,
      level: `ERROR`,
      category: `USER`,
    },
    /**
     * If we don't know what it is, we haven't done our due
     * diligence to handle it explicitly. That means it's our
     * fault, so THIRD_PARTY indicates us, the plugin authors.
     */
    [errorCodes.unknownSourcingFailure]: {
      text: getErrorText,
      level: `ERROR`,
      category: `THIRD_PARTY`,
    },
    [errorCodes.unknownApiError]: {
      text: getErrorText,
      level: `ERROR`,
      category: `THIRD_PARTY`,
    },
  })
}
