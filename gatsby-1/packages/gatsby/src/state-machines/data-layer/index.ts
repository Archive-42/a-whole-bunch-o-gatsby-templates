import { Machine, StatesConfig, MachineOptions } from "xstate"
import { dataLayerActions } from "./actions"
import { IDataLayerContext } from "./types"
import { dataLayerServices } from "./services"

export type DataLayerResult = Pick<
  IDataLayerContext,
  | "gatsbyNodeGraphQLFunction"
  | "graphqlRunner"
  | "pagesToBuild"
  | "pagesToDelete"
>

const loadDataStates: StatesConfig<IDataLayerContext, any, any> = {
  customizingSchema: {
    invoke: {
      src: `customizeSchema`,
      id: `customizing-schema`,
      onDone: {
        target: `sourcingNodes`,
      },
    },
  },
  sourcingNodes: {
    invoke: {
      src: `sourceNodes`,
      id: `sourcing-nodes`,
      onDone: {
        target: `buildingSchema`,
        actions: `assignChangedPages`,
      },
    },
  },
}

const initialCreatePagesStates: StatesConfig<IDataLayerContext, any, any> = {
  buildingSchema: {
    invoke: {
      id: `building-schema`,
      src: `buildSchema`,
      onDone: {
        target: `creatingPages`,
        actions: `assignGraphQLRunners`,
      },
    },
  },
  creatingPages: {
    invoke: {
      id: `creating-pages`,
      src: `createPages`,
      onDone: {
        target: `rebuildingSchemaWithSitePage`,
        actions: `assignChangedPages`,
      },
    },
  },
  rebuildingSchemaWithSitePage: {
    invoke: {
      src: `rebuildSchemaWithSitePage`,
      onDone: {
        target: `writingOutRedirects`,
      },
    },
  },
  writingOutRedirects: {
    invoke: {
      src: `writeOutRedirectsAndWatch`,
      onDone: {
        target: `done`,
      },
    },
  },
}

const recreatePagesStates: StatesConfig<IDataLayerContext, any, any> = {
  buildingSchema: {
    invoke: {
      id: `building-schema`,
      src: `buildSchema`,
      onDone: {
        target: `creatingPages`,
        actions: `assignGraphQLRunners`,
      },
    },
  },
  creatingPages: {
    invoke: {
      id: `creating-pages`,
      src: `createPages`,
      onDone: {
        target: `rebuildingSchemaWithSitePage`,
        actions: `assignChangedPages`,
      },
    },
  },
  rebuildingSchemaWithSitePage: {
    invoke: {
      src: `rebuildSchemaWithSitePage`,
      onDone: {
        target: `done`,
      },
    },
  },
}

const doneState: StatesConfig<IDataLayerContext, any, any> = {
  done: {
    type: `final`,
    data: ({
      gatsbyNodeGraphQLFunction,
      graphqlRunner,
      pagesToBuild,
      pagesToDelete,
    }): DataLayerResult => {
      return {
        gatsbyNodeGraphQLFunction,
        graphqlRunner,
        pagesToBuild,
        pagesToDelete,
      }
    },
  },
}

const options: Partial<MachineOptions<IDataLayerContext, any>> = {
  actions: dataLayerActions,
  services: dataLayerServices,
}

/**
 * Machine used during first run
 */

export const initializeDataMachine = Machine(
  {
    id: `initializeDataMachine`,
    context: {},
    initial: `customizingSchema`,
    states: {
      ...loadDataStates,
      ...initialCreatePagesStates,
      ...doneState,
    },
  },
  options
)

/**
 * Machine used when we need to source nodes again
 */

export const reloadDataMachine = Machine(
  {
    id: `reloadDataMachine`,
    context: {},
    initial: `customizingSchema`,
    states: {
      ...loadDataStates,
      ...recreatePagesStates,
      ...doneState,
    },
  },
  options
)

/**
 * Machine used when we need to re-create pages after a
 * node mutation outside of sourceNodes
 */
export const recreatePagesMachine = Machine(
  {
    id: `recreatePagesMachine`,
    context: {},
    initial: `buildingSchema`,
    states: {
      ...recreatePagesStates,
      ...doneState,
    },
  },
  options
)
